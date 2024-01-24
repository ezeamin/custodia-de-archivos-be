import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';
import { registerChange } from '../../../helpers/registerChange.js';
import { handleUpload } from '../../../helpers/cloudinary.js';
import { formatEmployeeData } from '../../../helpers/formatEmployeeData.js';
import { registerEmployeeUpdateChanges } from '../../../helpers/registerEmployeeUpdateChanges.js';

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
              family: true,
              phone: true,
            },
          },
        },
      });

      if (!employeeOriginalData) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El empleado no existe',
        });
        return;
      }

      const formattedData = formatEmployeeData(req.body);

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
      }

      // -------------------------
      // B - Phone changes
      // -------------------------

      if (formattedData.phone) {
        // 1. Check if phone exists

        let phone = await prisma.phone.findUnique({
          where: {
            phone_no: formattedData.phone.phone_no,
          },
        });

        // 2. If it doesn't, create it
        if (!phone) {
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
          // Phone already exists
          await prisma.phone.update({
            where: {
              id_phone: employeeOriginalData.person.id_phone,
            },
            data: {
              ...formattedData.phone,
            },
          });
        }
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
      const { url } = await handleUpload(req);

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
}
