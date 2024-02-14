import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';
import { registerChange } from '../../../helpers/registering/registerChange.js';
import { handleUpload } from '../../../helpers/cloudinary.js';
import { formatEmployeeData } from '../../../helpers/formatters/formatEmployeeData.js';
import { registerEmployeeUpdateChanges } from '../../../helpers/registering/registerEmployeeUpdateChanges.js';
import { formatFamilyMemberData } from '../../../helpers/formatters/formatFamilyMemberData.js';

export class PutController {
  // @param - employeeId
  static async updateEmployee(req, res) {
    const {
      params: { employeeId },
    } = req;

    try {
      const employeeOriginalData = await prisma.employee.findUnique({
        where: {
          id_employee: employeeId,
        },
        include: {
          person: {
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
              gender: true,
              phone: true,
            },
          },
          health_insurance: true,
          preoccupational_checkup: true,
        },
      });

      if (!employeeOriginalData) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El empleado no existe',
        });
        return;
      }

      let formattedData = formatEmployeeData(req.body);

      // -------------------------
      // A - Address changes
      // -------------------------

      let provinceId = null;
      let localityId = null;
      let streetId = null;

      if (formattedData.province && formattedData.locality) {
        // 1. Check if province exists
        // 2. If it doesn't, create it
        let province = await prisma.province.findUnique({
          where: {
            province_api_id: formattedData.province.province_api_id,
          },
        });

        if (!province) {
          province = await prisma.province.create({
            data: {
              province: formattedData.province.province,
              province_api_id: formattedData.province.province_api_id,
            },
          });
        }

        provinceId = province.id_province;

        // 3. Check if locality exists
        // 4. If it doesn't, create it
        let locality = await prisma.locality.findUnique({
          where: {
            locality_api_id: formattedData.locality.locality_api_id,
          },
        });

        if (!locality) {
          locality = await prisma.locality.create({
            data: {
              locality: formattedData.locality.locality,
              locality_api_id: formattedData.locality.locality_api_id,
              id_province: provinceId,
            },
          });
        }

        localityId = locality.id_locality;

        // 5. Check if street exists
        // 6. If it doesn't, create it
        let street = await prisma.street.findUnique({
          where: {
            street_api_id: formattedData.street.street_api_id,
          },
        });

        if (!street) {
          street = await prisma.street.create({
            data: {
              street: formattedData.street.street,
              street_api_id: formattedData.street.street_api_id,
              id_locality: localityId,
            },
          });
        }

        streetId = street.id_street;

        // If person doesn't yet have an address, create it
        if (!employeeOriginalData.person.id_address) {
          const address = await prisma.address.create({
            data: {
              ...formattedData.address,
              id_street: streetId,
            },
          });

          await prisma.person.update({
            where: {
              id_person: employeeOriginalData.id_person,
            },
            data: {
              id_address: address.id_address,
            },
          });
        } else {
          // Update address
          await prisma.address.update({
            where: {
              id_address: employeeOriginalData.person.id_address,
            },
            data: {
              ...formattedData.address,
              id_street: streetId,
            },
          });
        }

        // Update origin
        formattedData = {
          ...formattedData,
          street: {
            ...formattedData.street,
            id: streetId,
          },
          locality: {
            ...formattedData.locality,
            id: localityId,
          },
          province: {
            ...formattedData.province,
            id: provinceId,
          },
        };
      }

      // -------------------------
      // B - Phone changes
      // -------------------------

      if (formattedData.phone) {
        // 1. Check if it has phone
        const hasPhone = !!employeeOriginalData.person.id_phone;
        let phone = null;

        // 2. If it doesn't, create it
        if (!hasPhone) {
          phone = await prisma.phone.create({
            data: {
              phone_no: formattedData.phone.phone_no,
            },
          });

          // 3. Update person with new phone
          await prisma.person.update({
            where: {
              id_person: employeeOriginalData.id_person,
            },
            data: {
              id_phone: phone.id_phone,
            },
          });
        } else {
          // Has phone
          phone = await prisma.phone.update({
            where: {
              id_phone: employeeOriginalData.person.id_phone,
            },
            data: {
              ...formattedData.phone,
            },
          });
        }

        formattedData = {
          ...formattedData,
          phone: {
            ...formattedData.phone,
            id: phone.id_phone,
          },
        };
      }

      // -------------------------
      // C - Employee changes
      // -------------------------

      if (formattedData.employee) {
        await prisma.employee.update({
          where: {
            id_employee: employeeId,
          },
          data: {
            ...formattedData.employee,
          },
        });
      }

      // -------------------------
      // D - Person changes
      // -------------------------

      if (formattedData.person) {
        await prisma.person.update({
          where: {
            id_person: employeeOriginalData.id_person,
          },
          data: {
            ...formattedData.person,
          },
        });

        // Also change username from users' table if identification_number changed
        if (formattedData.person.identification_number) {
          await prisma.user.update({
            where: {
              username: employeeOriginalData.person.identification_number,
            },
            data: {
              username: formattedData.person.identification_number,
            },
          });
        }
      }

      // -------------------------
      // E - Health insurance changes
      // -------------------------

      if (formattedData.health_insurance) {
        if (employeeOriginalData.id_health_insurance) {
          await prisma.health_insurance.update({
            where: {
              id_health_insurance: employeeOriginalData.id_health_insurance,
            },
            data: formattedData.health_insurance,
          });
        } else {
          const newHealthInsurance = await prisma.health_insurance.create({
            data: formattedData.health_insurance,
          });

          await prisma.employee.update({
            where: {
              id_employee: employeeId,
            },
            data: {
              id_health_insurance: newHealthInsurance.id_health_insurance,
            },
          });
        }
      }

      // -------------------------
      // E - Preoccupational Checkup changes
      // -------------------------

      if (formattedData.preoccupational_checkup) {
        if (employeeOriginalData.id_preoccupational_checkup) {
          await prisma.preoccupational_checkup.update({
            where: {
              id_preoccupational_checkup:
                employeeOriginalData.id_preoccupational_checkup,
            },
            data: formattedData.preoccupational_checkup,
          });
        } else {
          const newPreoccupationalCheckup =
            await prisma.preoccupational_checkup.create({
              data: formattedData.preoccupational_checkup,
            });

          await prisma.employee.update({
            where: {
              id_employee: employeeId,
            },
            data: {
              id_preoccupational_checkup:
                newPreoccupationalCheckup.id_preoccupational_checkup,
            },
          });
        }
      }

      res.json({
        data: null,
        message: 'Empleado actualizado exitosamente',
      });

      registerEmployeeUpdateChanges(
        employeeOriginalData,
        formattedData,
        req.user.id,
      );
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al actualizar el empleado. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async updateEmployeeImage(req, res) {
    const {
      params: { employeeId },
    } = req;

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

    // Update employee image
    try {
      const employee = await prisma.employee.findUnique({
        where: {
          id_employee: employeeId,
        },
      });

      if (!employee) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El empleado no existe',
        });
        return;
      }

      const previousImageUrl = employee.picture_url;

      await prisma.employee.update({
        where: {
          id_employee: employeeId,
        },
        data: {
          picture_url: imageUrl,
        },
      });

      res.json({
        data: null,
        message: 'Imagen actualizada exitosamente',
      });

      // Won't delete previous image to save the history of changes

      registerChange({
        changedField: 'employee_img_url',
        changedFieldLabel: 'Imagen de Empleado',
        changedTable: 'employee',
        previousValue: previousImageUrl,
        newValue: imageUrl,
        modifyingUser: req.user.id,
        employeeId,
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al actualizar la imagen. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  // @param - docId
  static async updateEmployeeDoc(req, res) {
    const {
      params: { docId },
    } = req;

    try {
      const doc = await prisma.employee_doc.findUnique({
        where: {
          id_employee_doc: docId,
          employee_doc_isactive: true,
        },
      });

      if (!doc) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El documento no existe',
        });
        return;
      }

      const previousNameExtension = doc.employee_doc_name.split('.');
      const newName = `${req.body.name}.${previousNameExtension.pop()}`;

      await prisma.employee_doc.update({
        where: {
          id_employee_doc: docId,
        },
        data: {
          employee_doc_name: newName,
        },
      });

      res.json({
        data: null,
        message: 'Documento actualizado exitosamente',
      });

      registerChange({
        changedField: 'employee_doc_name',
        changedFieldLabel: 'Nombre de Documento',
        changedTable: 'employee_doc',
        previousValue: doc.employee_doc_name,
        newValue: newName,
        modifyingUser: req.user.id,
        employeeId: doc.id_employee,
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al actualizar el documento. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - licenseTypeId
  static async updateLicenseType(req, res) {
    const {
      params: { licenseTypeId },
      body: { title, description },
    } = req;

    try {
      const licenseType = await prisma.license_type.findUnique({
        where: {
          id_license_type: licenseTypeId,
          license_type_isactive: true,
        },
      });

      if (!licenseType) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El tipo de licencia no existe',
        });
        return;
      }

      await prisma.license_type.update({
        where: {
          id_license_type: licenseTypeId,
        },
        data: {
          title_license: title,
          description_license: description,
        },
      });

      res.json({
        data: null,
        message: 'Tipo de licencia actualizado exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al actualizar el tipo de licencia. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - trainingTypeId
  static async updateTrainingType(req, res) {
    const {
      params: { trainingTypeId },
      body: { title, description },
    } = req;

    try {
      const trainingType = await prisma.training_type.findUnique({
        where: {
          id_training_type: trainingTypeId,
          training_type_isactive: true,
        },
      });

      if (!trainingType) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El tipo de capacitación no existe',
        });
        return;
      }

      await prisma.training_type.update({
        where: {
          id_training_type: trainingTypeId,
        },
        data: {
          title_training_type: title,
          description_training_type: description,
        },
      });

      res.json({
        data: null,
        message: 'Tipo de capacitación actualizado exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al actualizar el tipo de capacitación. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  // @param - familyMemberId
  static async updateEmployeeFamilyMember(req, res) {
    const {
      params: { familyMemberId },
      user: { id: loggedInUser },
    } = req;

    try {
      const familyMemberOriginalData = await prisma.family_member.findUnique({
        where: {
          id_family_member: familyMemberId,
        },
        include: {
          person: {
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
              gender: true,
              phone: true,
            },
          },
          family_relationship_type: true,
        },
      });

      if (!familyMemberOriginalData) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El familiar no existe',
        });
        return;
      }

      const formattedData = formatFamilyMemberData(req.body);

      // -------------------------
      // A - Address changes
      // -------------------------

      let provinceId = null;
      let localityId = null;
      let streetId = null;

      if (formattedData.province && formattedData.locality) {
        // 1. Check if province exists
        // 2. If it doesn't, create it
        let province = await prisma.province.findUnique({
          where: {
            province_api_id: formattedData.province.province_api_id,
          },
        });

        if (!province) {
          province = await prisma.province.create({
            data: {
              province: formattedData.province.province,
              province_api_id: formattedData.province.province_api_id,
            },
          });
        }

        provinceId = province.id_province;

        // 3. Check if locality exists
        // 4. If it doesn't, create it
        let locality = await prisma.locality.findUnique({
          where: {
            locality_api_id: formattedData.locality.locality_api_id,
          },
        });

        if (!locality) {
          locality = await prisma.locality.create({
            data: {
              locality: formattedData.locality.locality,
              locality_api_id: formattedData.locality.locality_api_id,
              id_province: provinceId,
            },
          });
        }

        localityId = locality.id_locality;

        // 5. Check if street exists
        // 6. If it doesn't, create it
        let street = await prisma.street.findUnique({
          where: {
            street_api_id: formattedData.street.street_api_id,
          },
        });

        if (!street) {
          street = await prisma.street.create({
            data: {
              street: formattedData.street.street,
              street_api_id: formattedData.street.street_api_id,
              id_locality: localityId,
            },
          });
        }

        streetId = street.id_street;
      }

      // Update address
      const addressPromise = prisma.address.update({
        where: {
          id_address: familyMemberOriginalData.person.id_address,
          address_isactive: true,
        },
        data: {
          ...formattedData.address,
          id_street: streetId ?? undefined,
        },
      });

      // -------------------------
      // B - Phone changes
      // -------------------------

      const phonePromise = prisma.phone.update({
        where: {
          id_phone: familyMemberOriginalData.person.id_phone,
        },
        data: {
          phone_no: formattedData.phone.phone_no,
        },
      });

      // -------------------------
      // C - Person changes
      // -------------------------

      const personPromise = prisma.person.update({
        where: {
          id_person: familyMemberOriginalData.id_person,
        },
        data: {
          ...formattedData.person,
        },
      });

      // -------------------------
      // D - Relationship changes
      // -------------------------

      const familyMemberPromise = prisma.family_member.update({
        where: {
          id_family_member: familyMemberOriginalData.id_family_member,
        },
        data: {
          id_relationship_type: formattedData.id_relationship_type,
        },
      });

      await Promise.all([
        addressPromise,
        phonePromise,
        personPromise,
        familyMemberPromise,
      ]);

      res.json({
        data: null,
        message: 'Familiar actualizado exitosamente',
      });

      registerChange({
        changedTable: 'family_member',
        changedField: 'family_member',
        changedFieldLabel: 'Actualización de Familiar - JSON',
        previousValue: JSON.stringify(familyMemberOriginalData),
        newValue: JSON.stringify(formattedData),
        modifyingUser: loggedInUser,
        employeeId: familyMemberOriginalData.id_employee,
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al actualizar el familiar. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  // @param - lifeInsuranceId
  static async updateEmployeeLifeInsurance(req, res) {
    const {
      params: { employeeId, lifeInsuranceId },
      body: { name, policyNumber },
      user: { id: loggedInUser },
    } = req;

    try {
      const lifeInsurance = await prisma.life_insurance.findUnique({
        where: {
          id_life_insurance: lifeInsuranceId,
        },
      });

      if (!lifeInsurance) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El seguro de vida no existe',
        });
        return;
      }

      const previousData = lifeInsurance;

      await prisma.life_insurance.update({
        where: {
          id_life_insurance: lifeInsuranceId,
        },
        data: {
          life_insurance_name: name,
          policy_number: policyNumber.toString(),
        },
      });

      res.json({
        data: null,
        message: 'Seguro de vida actualizado exitosamente',
      });

      registerChange({
        changedTable: 'life_insurance',
        changedField: 'life_insurance',
        changedFieldLabel: 'Actualización de Seguro de Vida',
        previousValue: `${previousData.life_insurance_name} - Nro. ${previousData.policy_number}`,
        newValue: `${name} - Nro. ${policyNumber}`,
        modifyingUser: loggedInUser,
        employeeId,
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al actualizar el seguro de vida. Intente de nuevo más tarde.',
      });
    }
  }
}
