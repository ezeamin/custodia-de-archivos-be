import HttpStatus from 'http-status-codes';
import dayjs from 'dayjs';

import { prisma } from '../../../helpers/prisma.js';
import { handleUpload } from '../../../helpers/cloudinary.js';
import { registerChange } from '../../../helpers/registering/registerChange.js';
import { formatAddress } from '../../../helpers/formatters/formatAddress.js';

export class PostController {
  static async createEmployee(req, res) {
    let imageUrl = '';

    // Check if image was sent
    if (!req.file) {
      res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        message: 'No se ha enviado una imagen',
      });
      return;
    }

    // Check image size
    const FIVE_MB = 5000000;
    if (req.file.size > FIVE_MB) {
      res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        message:
          'El tamaño de la imagen es demasiado grande. El máximo permitido es de 5MB',
      });
      return;
    }

    // Upload image to cloudinary
    try {
      const { url } = await handleUpload(req.file);

      const splitUrl = url.split('/upload/');
      imageUrl = `${splitUrl[0]}/upload/w_300,h_300,c_fill,g_face/${splitUrl[1]}`;
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el empleado. Intente de nuevo más tarde.',
      });
      return;
    }

    let person = null;

    // Supposing that the body has been validated and sanitized
    try {
      // Check for existing (inactive) person
      const existingPerson = await prisma.person.findUnique({
        where: {
          identification_number: req.body.dni,
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

      const isAnEmployee = !!(existingPerson && existingPerson.employee > 0);
      const isAThirdParty = !!(
        existingPerson && existingPerson.third_party.length > 0
      );

      if (existingPerson && activePerson && isAnEmployee) {
        res.status(HttpStatus.BAD_REQUEST).json({
          data: null,
          message:
            'Esta persona ya está registrada como empleado activo bajo el mismo DNI.',
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

      if (existingPerson && activePerson && !isAnEmployee && !req.body.force) {
        res.json({
          data: {
            body: req.body,
            name: existingPerson.name,
            lastname: existingPerson.surname,
            dni: existingPerson.identification_number,
            phone: existingPerson?.phone?.phone_no || null,
            address: existingPerson.address
              ? formatAddress(existingPerson.address)
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
        req.body.force;

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
            name: req.body.name,
            surname: req.body.lastname,
            birth_date: req.body.birthdate,
            id_gender: req.body.genderId,
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
            name: req.body.name,
            surname: req.body.lastname,
            identification_number: req.body.dni,
            birth_date: req.body.birthdate,
            id_gender: req.body.genderId,
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
        email: req.body.email,
        employment_date: req.body.startDate,
        position: req.body.position,
        no_file: +req.body.fileNumber,
        picture_url: imageUrl,
        person: {
          connect: {
            id_person: person.id_person,
          },
        },
        area: {
          connect: {
            id_area: req.body.areaId,
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
        modifyingUser: req.user.id,
        employeeId: employee.id_employee,
      });
    } catch (e) {
      if (e.code === 'P2002') {
        if (e.meta.target.includes('identification_number')) {
          res.status(HttpStatus.BAD_REQUEST).json({
            data: null,
            message: 'El DNI ingresado ya existe',
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

      console.error('🟥', e);
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
      user: { id: loggedUserId },
    } = req;

    let docUrl = '';

    // Check if file was sent
    if (!req.file) {
      res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        message: 'No se ha enviado un archivo',
      });
      return;
    }

    // Check file size
    const FIVE_MB = 5000000;
    if (req.file.size > FIVE_MB) {
      res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        message:
          'El tamaño del archivo es demasiado grande. El máximo permitido es de 5MB',
      });
      return;
    }

    // Upload file to cloudinary
    try {
      const { url } = await handleUpload(req.file, true);
      docUrl = url;
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el documento. Intente de nuevo más tarde.',
      });
      return;
    }

    const fileExt = req.file.originalname.split('.').pop();
    const filename = `${req.body.name}.${fileExt}`;

    // Supposing that the body has been validated and sanitized
    try {
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
        },
      });

      res.json({
        data: null,
        message: 'Documento creado exitosamente',
      });

      registerChange({
        changedTable: 'employee_doc',
        changedField: 'employee_doc',
        changedFieldLabel: 'Carga de Documento',
        previousValue: null,
        newValue: `${filename} - ${dayjs().format('DD/MM/YYYY - HH:mm:ss')}`,
        modifyingUser: req.user.id,
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el documento. Intente de nuevo más tarde.',
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

      res.json({
        data: null,
        message: 'Ausencia creada exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
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

      res.json({
        data: null,
        message: 'Licencia creada exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
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

      res.json({
        data: null,
        message: 'Vacaciones creadas exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
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

      res.json({
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

      console.error('🟥', e);
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

      res.json({
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

      console.error('🟥', e);
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

      res.json({
        data: null,
        message: 'Llegada tarde creada exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
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

      res.json({
        data: null,
        message: 'Hora extra creada exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
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

      res.json({
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

      console.error('🟥', e);
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

      res.json({
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

      console.error('🟥', e);
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
        dni,
        birthdate,
        relationshipId,
        genderId,
        street,
        streetNumber,
        apt,
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
          identification_number: dni,
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
              dni: person.identification_number,
              phone: person?.phone?.phone_no || null,
              address: person.address ? formatAddress(person.address) : null,
            },
            message: 'Duplicate',
          });
          return;
        }
      }
    } catch (e) {
      console.error('🟥', e);
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

        person = await prisma.person.update({
          where: {
            id_person: person.id_person,
          },
          data: {
            ...(shouldUpdatePhone
              ? { phone: { create: { phone_no: phone } } }
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
            identification_number: dni,
            birth_date: birthdate,
            gender: {
              connect: {
                id_gender: genderId,
              },
            },
            phone: {
              create: {
                phone_no: phone,
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

      res.json({
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
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al crear el familiar. Intente de nuevo más tarde.',
      });
    }
  }
}
