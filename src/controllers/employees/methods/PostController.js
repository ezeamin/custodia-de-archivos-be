import HttpStatus from 'http-status-codes';
import dayjs from 'dayjs';

import { prisma } from '../../../helpers/prisma.js';
import { handleUpload } from '../../../helpers/cloudinary.js';
import { registerChange } from '../../../helpers/registering/registerChange.js';
import { formatAddressAsString } from '../../../helpers/formatters/formatAddress.js';
import { formatPhone, uppercaseName } from '../../../helpers/helpers.js';
import { registerError } from '../../../helpers/registering/registerError.js';

export class PostController {
  static async createEmployee(req, res) {
    const {
      body: {
        name,
        lastname,
        cuil,
        birthdate,
        genderId,
        email,
        startDate,
        position,
        fileNumber,
        areaId,
        force = false,
      },
      file,
      user: { id: userId },
    } = req;

    let imageUrl = '';

    // Check if image was sent
    if (!file) {
      res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        message: 'No se ha enviado una imagen',
      });
      return;
    }

    // Check image size
    const FIVE_MB = 5000000;
    if (file.size > FIVE_MB) {
      res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        message:
          'El tamaño de la imagen es demasiado grande. El máximo permitido es de 5MB',
      });
      return;
    }

    // Upload image to cloudinary
    try {
      const { url } = await handleUpload(file);

      const splitUrl = url.split('/upload/');
      imageUrl = `${splitUrl[0]}/upload/w_300,h_300,c_fill,g_face/${splitUrl[1]}`;
    } catch (e) {
      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el empleado. Intente de nuevo más tarde.',
      });
      return;
    }

    let person = null;
    try {
      // Check for existing (inactive) person
      const existingPerson = await prisma.person.findUnique({
        where: {
          identification_number: cuil,
        },
        include: {
          phone: true,
          address: {
            include: {
              street: {
                include: {
                  locality: {
                    include: {
                      province: true,
                    },
                  },
                },
              },
            },
          },
          employee: true,
          third_party: true,
        },
      });

      let activePerson = true;
      if (existingPerson && !existingPerson.person_isactive)
        activePerson = false;

      const isAnEmployee = !!(existingPerson && existingPerson.employee);
      const isAThirdParty = !!(existingPerson && existingPerson.third_party);

      if (existingPerson && activePerson && isAnEmployee) {
        res.status(HttpStatus.BAD_REQUEST).json({
          data: null,
          message:
            'Esta persona ya está registrada como empleado activo bajo el mismo CUIL.',
        });
        return;
      }

      if (existingPerson && activePerson && isAThirdParty) {
        res.status(HttpStatus.BAD_REQUEST).json({
          data: null,
          message:
            'Esta persona ya está registrada como usuario de solo lectura. Por favor, primero elimínela desde "Ajustes".',
        });
        return;
      }

      if (existingPerson && activePerson && !isAnEmployee && !force) {
        res.json({
          data: {
            body: req.body,
            name: uppercaseName(existingPerson.name),
            lastname: uppercaseName(existingPerson.surname),
            cuil: existingPerson.identification_number,
            phone: existingPerson?.phone?.phone_no || null,
            address: existingPerson.address
              ? formatAddressAsString(existingPerson.address)
              : null,
          },
          message: 'Duplicate',
        });
        return;
      }

      const isActiveFamilyMember =
        existingPerson &&
        activePerson &&
        !isAnEmployee &&
        !isAThirdParty &&
        force;

      const isInactiveThirdParty =
        existingPerson && activePerson && !isAnEmployee && isAThirdParty;

      const isInactivePersonNotThirdParty = existingPerson && !activePerson;

      if (isActiveFamilyMember) {
        // No updates needed
        person = existingPerson;
      } else if (isInactiveThirdParty) {
        // Enable person
        person = await prisma.person.update({
          where: {
            id_person: existingPerson.id_person,
          },
          data: {
            person_isactive: true,
          },
        });
      } else if (isInactivePersonNotThirdParty) {
        // Some deleted (inactive) person -> Update all data with new information
        person = await prisma.person.update({
          where: {
            id_person: existingPerson.id_person,
          },
          data: {
            person_isactive: true,
            name,
            surname: lastname,
            birth_date: birthdate,
            id_gender: genderId,
            address: {
              update: {
                address_isactive: true,
              },
            },
          },
        });
      } else {
        // No data -> Create person
        person = await prisma.person.create({
          data: {
            name,
            surname: lastname,
            identification_number: cuil,
            birth_date: birthdate,
            id_gender: genderId,
          },
        });
      }

      const inactiveEmployee = await prisma.employee.findUnique({
        where: {
          id_person: person.id_person,
          employee_isactive: false,
        },
      });

      const newData = {
        email,
        employment_date: startDate,
        position,
        no_file: +fileNumber,
        picture_url: imageUrl,
        person: {
          connect: {
            id_person: person.id_person,
          },
        },
        area: {
          connect: {
            id_area: areaId,
          },
        },
        employee_status: {
          connect: {
            status: 'active',
          },
        },
      };
      let employee = null;
      if (inactiveEmployee) {
        employee = await prisma.employee.update({
          where: {
            id_employee: inactiveEmployee.id_employee,
          },
          data: {
            employee_isactive: true,
            ...newData,
          },
        });
      } else {
        employee = await prisma.employee.create({
          data: newData,
        });
      }

      res.status(HttpStatus.CREATED).json({
        data: {
          employeeId: employee.id_employee,
        },
        message: 'Empleado creado exitosamente',
      });

      // Avoid registering change in test environment
      if (process.env.NODE_ENV === 'test') return;

      registerChange({
        changedField: 'employee',
        changedFieldLabel: 'Creación de Empleado',
        changedTable: 'employee',
        previousValue: null,
        newValue: new Date().toISOString(), // TODO: Check timezone
        modifyingUser: userId,
        employeeId: employee.id_employee,
      });
    } catch (e) {
      if (e.code === 'P2002') {
        if (e.meta.target.includes('identification_number')) {
          res.status(HttpStatus.BAD_REQUEST).json({
            data: null,
            message: 'El CUIL ingresado ya existe',
          });
          return;
        }

        if (e.meta.target.includes('email')) {
          res.status(HttpStatus.BAD_REQUEST).json({
            data: null,
            message: 'El email ingresado ya existe',
          });
          await prisma.person.delete({
            where: {
              id_person: person.id_person,
            },
          });
          return;
        }

        if (e.meta.target.includes('no_file')) {
          res.status(HttpStatus.BAD_REQUEST).json({
            data: null,
            message: 'El número de legajo ingresado ya existe',
          });
          await prisma.person.delete({
            where: {
              id_person: person.id_person,
            },
          });
          return;
        }
      }

      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el empleado. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async createEmployeeDoc(req, res) {
    const {
      params: { employeeId },
      body: { name, folderId },
      file,
      user: { id: loggedUserId },
    } = req;

    let docUrl = '';

    // Check if file was sent
    if (!file) {
      res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        message: 'No se ha enviado un archivo',
      });
      return;
    }

    // Check file size
    const TWENTY_MB = 20000000;
    if (file.size > TWENTY_MB) {
      res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        message:
          'El tamaño del archivo es demasiado grande. El máximo permitido es de 20MB',
      });
      return;
    }

    // Upload file to cloudinary
    try {
      const { url } = await handleUpload(file, true);
      docUrl = url;
    } catch (e) {
      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el documento. Intente de nuevo más tarde.',
      });
      return;
    }

    const fileExt = file.originalname.split('.').pop();
    const filename = `${name}.${fileExt}`;

    try {
      const folder = await prisma.document_folder.findUnique({
        where: {
          id_document_folder: folderId,
        },
      });

      if (folder.folder_name === 'Notificaciones') {
        res.status(HttpStatus.FORBIDDEN).json({
          data: null,
          message:
            'No se puede cargar un documento en la carpeta de Notificaciones',
        });
        return;
      }

      await prisma.employee_doc.create({
        data: {
          employee_doc_name: filename,
          employee_doc_url: docUrl,
          employee: {
            connect: {
              id_employee: employeeId,
            },
          },
          user: {
            connect: {
              id_user: loggedUserId,
            },
          },
          document_folder: {
            connect: {
              id_document_folder: folderId,
            },
          },
        },
      });

      res.status(HttpStatus.CREATED).json({
        data: null,
        message: 'Documento creado exitosamente',
      });

      registerChange({
        changedTable: 'employee_doc',
        changedField: 'employee_doc',
        changedFieldLabel: 'Carga de Documento',
        previousValue: null,
        newValue: `${filename} - ${dayjs().format('DD/MM/YYYY - HH:mm:ss')}`,
        modifyingUser: loggedUserId,
        employeeId,
      });
    } catch (e) {
      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el documento. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async createEmployeeFolder(req, res) {
    const {
      params: { employeeId },
      body: { name, color },
      user: { id: loggedUserId },
    } = req;

    try {
      const existingFolder = await prisma.document_folder.findFirst({
        where: {
          folder_name: name,
          id_employee: employeeId,
        },
      });

      if (existingFolder && existingFolder.folder_isactive) {
        res.status(HttpStatus.BAD_REQUEST).json({
          data: null,
          message: 'La carpeta ingresada ya existe',
        });
        return;
      }

      if (existingFolder && !existingFolder.folder_isactive) {
        await prisma.document_folder.update({
          where: {
            id_document_folder: existingFolder.id_document_folder,
          },
          data: {
            folder_isactive: true,
            folder_color: color,
          },
        });
      } else {
        await prisma.document_folder.create({
          data: {
            folder_name: name,
            folder_color: color,
            employee: {
              connect: {
                id_employee: employeeId,
              },
            },
          },
        });
      }

      res.status(HttpStatus.CREATED).json({
        data: null,
        message: 'Carpeta creada exitosamente',
      });

      registerChange({
        changedTable: 'document_folder',
        changedField: 'document_folder',
        changedFieldLabel: 'Creación de Carpeta',
        previousValue: null,
        newValue: name,
        modifyingUser: loggedUserId,
        employeeId,
      });
    } catch (e) {
      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear la carpeta. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async createEmployeeAbsence(req, res) {
    const {
      params: { employeeId },
      body: { date, reason },
      user: { id: loggedUserId },
    } = req;

    try {
      await prisma.absence.create({
        data: {
          date_absence: date,
          reason_absence: reason,
          employee: {
            connect: {
              id_employee: employeeId,
            },
          },
          user: {
            connect: {
              id_user: loggedUserId,
            },
          },
        },
      });

      res.status(HttpStatus.CREATED).json({
        data: null,
        message: 'Ausencia creada exitosamente',
      });
    } catch (e) {
      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear la ausencia. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async createEmployeeLicense(req, res) {
    const {
      params: { employeeId },
      body: { typeId, fromDate, toDate, observations },
      user: { id: loggedUserId },
    } = req;

    try {
      await prisma.license.create({
        data: {
          start_date_license: fromDate,
          end_date_license: toDate,
          observation_license: observations,
          employee: {
            connect: {
              id_employee: employeeId,
            },
          },
          license_type: {
            connect: {
              id_license_type: typeId,
            },
          },
          user: {
            connect: {
              id_user: loggedUserId,
            },
          },
        },
      });

      res.status(HttpStatus.CREATED).json({
        data: null,
        message: 'Licencia creada exitosamente',
      });
    } catch (e) {
      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear la licencia. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async createEmployeeVacation(req, res) {
    const {
      params: { employeeId },
      body: { fromDate, toDate, observations },
      user: { id: loggedUserId },
    } = req;

    try {
      await prisma.vacation.create({
        data: {
          start_date_vacation: fromDate,
          end_date_vacation: toDate,
          observation_vacation: observations,
          employee: {
            connect: {
              id_employee: employeeId,
            },
          },
          user: {
            connect: {
              id_user: loggedUserId,
            },
          },
        },
      });

      res.status(HttpStatus.CREATED).json({
        data: null,
        message: 'Vacaciones creadas exitosamente',
      });
    } catch (e) {
      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear las vacaciones. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async createEmployeeTraining(req, res) {
    const {
      params: { employeeId },
      body: { date, reason, typeId, observations },
      user: { id: loggedUserId },
    } = req;

    try {
      await prisma.training.create({
        data: {
          date_training: date,
          reason_training: reason,
          observation_training: observations,
          employee: {
            connect: {
              id_employee: employeeId,
            },
          },
          training_type: {
            connect: {
              id_training_type: typeId,
            },
          },
          user: {
            connect: {
              id_user: loggedUserId,
            },
          },
        },
      });

      res.status(HttpStatus.CREATED).json({
        data: null,
        message: 'Capacitación creada exitosamente',
      });
    } catch (e) {
      if (e.code === 'P2002') {
        if (e.meta.target.includes('date_training')) {
          res.status(HttpStatus.BAD_REQUEST).json({
            data: null,
            message: 'La capacitación ingresada ya existe',
          });
          return;
        }
      }

      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear la capacitación. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async createEmployeeFormalWarning(req, res) {
    const {
      params: { employeeId },
      body: { date, reason },
      user: { id: loggedUserId },
    } = req;

    try {
      await prisma.formal_warning.create({
        data: {
          date_formal_warning: date,
          reason_formal_warning: reason,
          employee: {
            connect: {
              id_employee: employeeId,
            },
          },
          user: {
            connect: {
              id_user: loggedUserId,
            },
          },
        },
      });

      res.status(HttpStatus.CREATED).json({
        data: null,
        message: 'Amonestación formal creada exitosamente',
      });
    } catch (e) {
      if (e.code === 'P2002') {
        if (e.meta.target.includes('date_formal_warning')) {
          res.status(HttpStatus.BAD_REQUEST).json({
            data: null,
            message: 'La amonestación formal ingresada ya existe',
          });
          return;
        }
      }

      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear la amonestación formal. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async createEmployeeLateArrival(req, res) {
    const {
      params: { employeeId },
      body: { date, hour, observations },
      user: { id: loggedUserId },
    } = req;

    try {
      await prisma.late_arrival.create({
        data: {
          date_late_arrival: date,
          time_late_arrival: hour,
          observation_late_arrival: observations,
          employee: {
            connect: {
              id_employee: employeeId,
            },
          },
          user: {
            connect: {
              id_user: loggedUserId,
            },
          },
        },
      });

      res.status(HttpStatus.CREATED).json({
        data: null,
        message: 'Llegada tarde creada exitosamente',
      });
    } catch (e) {
      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear la llegada tarde. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async createEmployeeExtraHour(req, res) {
    const {
      params: { employeeId },
      body: { date, hours, observations },
      user: { id: loggedUserId },
    } = req;

    try {
      await prisma.extra_hours.create({
        data: {
          date_extra_hours: date,
          qty_extra_hours: hours,
          observation_extra_hours: observations,
          employee: {
            connect: {
              id_employee: employeeId,
            },
          },
          user: {
            connect: {
              id_user: loggedUserId,
            },
          },
        },
      });

      res.status(HttpStatus.CREATED).json({
        data: null,
        message: 'Hora extra creada exitosamente',
      });
    } catch (e) {
      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear la hora extra. Intente de nuevo más tarde.',
      });
    }
  }

  static async createLicenseType(req, res) {
    const { title, description } = req.body;

    try {
      await prisma.license_type.create({
        data: {
          title_license: title,
          description_license: description,
        },
      });

      res.status(HttpStatus.CREATED).json({
        data: null,
        message: 'Tipo de licencia creado exitosamente',
      });
    } catch (e) {
      if (e.code === 'P2002') {
        if (e.meta.target.includes('title_license')) {
          res.status(HttpStatus.BAD_REQUEST).json({
            data: null,
            message: 'El tipo de licencia ingresado ya existe',
          });
          return;
        }
      }

      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el tipo de licencia. Intente de nuevo más tarde.',
      });
    }
  }

  static async createTrainingType(req, res) {
    const { title, description } = req.body;

    try {
      await prisma.training_type.create({
        data: {
          title_training_type: title,
          description_training_type: description,
        },
      });

      res.status(HttpStatus.CREATED).json({
        data: null,
        message: 'Tipo de capacitación creado exitosamente',
      });
    } catch (e) {
      if (e.code === 'P2002') {
        if (e.meta.target.includes('title_training')) {
          res.status(HttpStatus.BAD_REQUEST).json({
            data: null,
            message: 'El tipo de capacitación ingresado ya existe',
          });
          return;
        }
      }

      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el tipo de capacitación. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async createFamilyMember(req, res) {
    const {
      params: { employeeId },
      body: {
        name,
        lastname,
        cuil,
        birthdate,
        relationshipId,
        genderId,
        street,
        streetNumber,
        apt,
        addressObservations,
        phone,
        locality,
        state,
        force = false,
      },
      user: { id: loggedUserId },
    } = req;

    let doesPersonExist = false;
    let person = null;

    try {
      person = await prisma.person.findUnique({
        where: {
          identification_number: cuil,
        },
        include: {
          phone: true,
          address: {
            include: {
              street: {
                include: {
                  locality: {
                    include: {
                      province: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (person) {
        doesPersonExist = true;
        if (!force) {
          res.json({
            data: {
              name: person.name,
              lastname: person.surname,
              cuil: person.identification_number,
              phone: person?.phone?.phone_no || null,
              address: person.address
                ? formatAddressAsString(person.address)
                : null,
            },
            message: 'Duplicate',
          });
          return;
        }
      }
    } catch (e) {
      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el familiar. Intente de nuevo más tarde.',
      });
    }

    try {
      let streetId = null;
      let localityId = null;
      let provinceId = null;

      // 1. Find or create province
      let newProvince = await prisma.province.findFirst({
        where: {
          province_api_id: state.id,
        },
      });

      if (!newProvince) {
        newProvince = await prisma.province.create({
          data: {
            province_api_id: state.id,
            province: state.description,
          },
        });
      }

      provinceId = newProvince.id_province;

      // 2. Find or create locality
      let newLocality = await prisma.locality.findFirst({
        where: {
          locality_api_id: locality.id,
        },
      });

      if (!newLocality) {
        newLocality = await prisma.locality.create({
          data: {
            locality_api_id: locality.id,
            locality: locality.description,
            province: {
              connect: {
                id_province: provinceId,
              },
            },
          },
        });
      }

      localityId = newLocality.id_locality;

      // 3. Find or create street
      let newStreet = await prisma.street.findFirst({
        where: {
          street_api_id: street.id,
        },
      });

      if (!newStreet) {
        newStreet = await prisma.street.create({
          data: {
            street_api_id: street.id,
            street: street.description,
            locality: {
              connect: {
                id_locality: localityId,
              },
            },
          },
        });
      }

      streetId = newStreet.id_street;

      if (doesPersonExist) {
        const shouldUpdatePhone = !person.id_phone;
        const shouldUpdateAddress = !person.id_address;
        const shouldUpdateGender = !person.id_gender;

        const formattedPhone = formatPhone(phone);

        person = await prisma.person.update({
          where: {
            id_person: person.id_person,
          },
          data: {
            ...(shouldUpdatePhone
              ? { phone: { create: { phone_no: formattedPhone } } }
              : {}),
            ...(shouldUpdateGender
              ? { gender: { connect: { id_gender: genderId } } }
              : {}),
            ...(shouldUpdateAddress
              ? {
                  address: {
                    create: {
                      street: {
                        connect: {
                          id_street: streetId,
                        },
                      },
                      street_number: +streetNumber,
                      door: apt,
                      observations: addressObservations,
                    },
                  },
                }
              : {}),
          },
        });
      } else {
        const formattedPhone = formatPhone(phone);

        person = await prisma.person.create({
          data: {
            name,
            surname: lastname,
            identification_number: cuil,
            birth_date: birthdate,
            gender: {
              connect: {
                id_gender: genderId,
              },
            },
            phone: {
              create: {
                phone_no: formattedPhone,
              },
            },
            address: {
              create: {
                street: {
                  connect: {
                    id_street: streetId,
                  },
                },
                street_number: streetNumber,
                door: apt,
                observations: addressObservations,
              },
            },
          },
        });
      }

      const creationPromise = prisma.family_member.create({
        data: {
          family_relationship_type: {
            connect: {
              id_family_relationship_type: relationshipId,
            },
          },
          employee: {
            connect: {
              id_employee: employeeId,
            },
          },
          person: {
            connect: {
              id_person: person.id_person,
            },
          },
        },
      });

      const relationshipPromise = prisma.family_relationship_type.findFirst({
        where: {
          id_family_relationship_type: relationshipId,
        },
      });

      const [, relationshipType] = await Promise.all([
        creationPromise,
        relationshipPromise,
      ]);

      res.status(HttpStatus.CREATED).json({
        data: null,
        message: 'Familiar creado exitosamente',
      });

      registerChange({
        changedTable: 'family_member',
        changedField: 'family_member',
        changedFieldLabel: 'Creación de Familiar',
        previousValue: null,
        newValue: `${name} ${lastname} (${relationshipType.family_relationship_type})`,
        modifyingUser: loggedUserId,
        employeeId,
      });
    } catch (e) {
      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el familiar. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async createEmployeeLifeInsurance(req, res) {
    const {
      params: { employeeId },
      body: { name, policyNumber },
      user: { id: loggedUserId },
    } = req;

    try {
      await prisma.life_insurance.create({
        data: {
          life_insurance_name: name,
          policy_number: policyNumber,
          employee: {
            connect: {
              id_employee: employeeId,
            },
          },
        },
      });

      res.status(HttpStatus.CREATED).json({
        data: null,
        message: 'Seguro de vida creado exitosamente',
      });

      registerChange({
        changedTable: 'life_insurance',
        changedField: 'life_insurance',
        changedFieldLabel: 'Creación de Seguro de Vida',
        previousValue: null,
        newValue: `${name} - Nro. ${policyNumber}`,
        modifyingUser: loggedUserId,
        employeeId,
      });
    } catch (e) {
      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el seguro de vida. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  // @param - lifeInsuranceId
  static async createLifeInsuranceBeneficiary(req, res) {
    const {
      params: { employeeId, lifeInsuranceId },
      body: {
        name,
        lastname,
        cuil,
        birthdate,
        genderId,
        relationshipId,
        state,
        locality,
        street,
        streetNumber,
        apt,
        addressObservations,
        percentage,
        force = false,
      },
      user: { id: loggedUserId },
    } = req;

    let person = null;
    let doesPersonExist = false;
    try {
      person = await prisma.person.findUnique({
        where: {
          identification_number: cuil,
        },
        include: {
          address: {
            include: {
              street: {
                include: {
                  locality: {
                    include: {
                      province: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (person) {
        doesPersonExist = true;
        if (!force) {
          res.json({
            data: {
              name: person.name,
              lastname: person.surname,
              cuil: person.identification_number,
              address: person.address
                ? formatAddressAsString(person.address)
                : null,
            },
            message: 'Duplicate',
          });
          return;
        }
      }
    } catch (e) {
      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el beneficiario. Intente de nuevo más tarde.',
      });
    }

    try {
      let streetId = null;
      let localityId = null;
      let provinceId = null;

      // 1. Find or create province
      let newProvince = await prisma.province.findFirst({
        where: {
          province_api_id: state.id,
        },
      });

      if (!newProvince) {
        newProvince = await prisma.province.create({
          data: {
            province_api_id: state.id,
            province: state.description,
          },
        });
      }

      provinceId = newProvince.id_province;

      // 2. Find or create locality
      let newLocality = await prisma.locality.findFirst({
        where: {
          locality_api_id: locality.id,
        },
      });

      if (!newLocality) {
        newLocality = await prisma.locality.create({
          data: {
            locality_api_id: locality.id,
            locality: locality.description,
            province: {
              connect: {
                id_province: provinceId,
              },
            },
          },
        });
      }

      localityId = newLocality.id_locality;

      // 3. Find or create street
      let newStreet = await prisma.street.findFirst({
        where: {
          street_api_id: street.id,
        },
      });

      if (!newStreet) {
        newStreet = await prisma.street.create({
          data: {
            street_api_id: street.id,
            street: street.description,
            locality: {
              connect: {
                id_locality: localityId,
              },
            },
          },
        });
      }

      streetId = newStreet.id_street;

      if (doesPersonExist) {
        const shouldUpdateAddress = !person.id_address;
        const shouldUpdateGender = !person.id_gender;

        person = await prisma.person.update({
          where: {
            id_person: person.id_person,
          },
          data: {
            person_isactive: true,
            ...(shouldUpdateGender
              ? { gender: { connect: { id_gender: genderId } } }
              : {}),
            ...(shouldUpdateAddress
              ? {
                  address: {
                    create: {
                      street: {
                        connect: {
                          id_street: streetId,
                        },
                      },
                      street_number: +streetNumber,
                      door: apt,
                      observations: addressObservations,
                    },
                  },
                }
              : {}),
          },
        });
      } else {
        person = await prisma.person.create({
          data: {
            name,
            surname: lastname,
            identification_number: cuil,
            birth_date: birthdate,
            gender: {
              connect: {
                id_gender: genderId,
              },
            },
            address: {
              create: {
                street: {
                  connect: {
                    id_street: streetId,
                  },
                },
                street_number: streetNumber,
                door: apt,
                observations: addressObservations,
              },
            },
          },
        });
      }

      const creation = await prisma.employee_life_insurance_beneficiary.create({
        data: {
          family_relationship_type: {
            connect: {
              id_family_relationship_type: relationshipId,
            },
          },
          life_insurance: {
            connect: {
              id_life_insurance: lifeInsuranceId,
            },
          },
          person: {
            connect: {
              id_person: person.id_person,
            },
          },
          beneficiary_percentage: percentage,
        },
        include: {
          life_insurance: true,
        },
      });

      res.status(HttpStatus.CREATED).json({
        data: null,
        message: 'Beneficiario creado exitosamente',
      });

      registerChange({
        changedTable: 'employee_life_insurance_beneficiary',
        changedField: 'employee_life_insurance_beneficiary',
        changedFieldLabel: 'Creación de Beneficiario',
        previousValue: null,
        newValue: `${name} ${lastname} - ${creation.life_insurance.life_insurance_name}`,
        modifyingUser: loggedUserId,
        employeeId,
      });
    } catch (e) {
      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el beneficiario. Intente de nuevo más tarde.',
      });
    }
  }
}
