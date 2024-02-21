import HttpStatus from 'http-status-codes';
import dayjs from 'dayjs';

import { prisma } from '../../../helpers/prisma.js';
import { registerChange } from '../../../helpers/registering/registerChange.js';

export class DeleteController {
  // @param - employeeId
  static async deleteEmployee(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }

  // @param - employeeId
  // @param - docId
  static async deleteEmployeeDoc(req, res) {
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

      await prisma.employee_doc.update({
        where: {
          id_employee_doc: docId,
        },
        data: {
          employee_doc_isactive: false,
        },
      });

      res.json({
        data: null,
        message: 'Documento eliminado exitosamente',
      });

      registerChange({
        changedField: 'employee_doc',
        changedFieldLabel: 'Eliminación de Documento',
        changedTable: 'employee_doc',
        previousValue: doc.employee_doc_url,
        newValue: null,
        modifyingUser: req.user.id,
        employeeId: doc.id_employee,
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al eliminar el documento. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  // @param - folderId
  // This will set the folder to inactive, and all documents inside it too
  static async deleteEmployeeFolder(req, res) {
    const {
      params: { employeeId, folderId },
      user: { id: loggedUserId },
    } = req;

    try {
      const folder = await prisma.document_folder.findUnique({
        where: {
          id_document_folder: folderId,
          folder_isactive: true,
        },
        include: {
          employee_doc: true,
        },
      });

      if (!folder) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'La carpeta no existe',
        });
        return;
      }

      await prisma.document_folder.update({
        where: {
          id_document_folder: folderId,
          folder_isactive: true,
        },
        data: {
          folder_isactive: false,
          employee_doc: {
            updateMany: {
              where: {
                employee_doc_isactive: true,
              },
              data: {
                employee_doc_isactive: false,
              },
            },
          },
        },
      });

      res.json({
        data: null,
        message: 'Carpeta eliminada exitosamente',
      });

      registerChange({
        changedField: 'folder',
        changedFieldLabel: 'Eliminación de Carpeta',
        changedTable: 'folder',
        previousValue: folder.folder_name,
        newValue: null,
        modifyingUser: loggedUserId,
        employeeId,
      });

      folder.employee_doc.forEach((doc) => {
        registerChange({
          changedField: 'document',
          changedFieldLabel: 'Eliminación de Documento',
          changedTable: 'employee_docs',
          previousValue: doc.employee_doc_url,
          newValue: null,
          modifyingUser: loggedUserId,
          employeeId,
        });
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al eliminar la carpeta. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  // @param - licenseId
  static async deleteEmployeeLicense(req, res) {
    const {
      params: { licenseId },
    } = req;

    try {
      const license = await prisma.license.findUnique({
        where: {
          id_license: licenseId,
          license_isactive: true,
        },
        include: {
          license_type: true,
        },
      });

      if (!license) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'La licencia no existe',
        });
        return;
      }

      await prisma.license.update({
        where: {
          id_license: licenseId,
          license_isactive: true,
        },
        data: {
          license_isactive: false,
        },
      });

      res.json({
        data: null,
        message: 'Licencia eliminada exitosamente',
      });

      registerChange({
        changedField: 'license',
        changedFieldLabel: 'Eliminación de Licencia',
        changedTable: 'license',
        previousValue: license.license_type.title_license,
        newValue: null,
        modifyingUser: req.user.id,
        employeeId: license.id_employee,
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al eliminar la licencia. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  // @param - vacationId
  static async deleteEmployeeVacation(req, res) {
    const {
      params: { vacationId },
    } = req;

    try {
      const vacation = await prisma.vacation.findUnique({
        where: {
          id_vacation: vacationId,
          vacation_isactive: true,
        },
      });

      if (!vacation) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'Las vacaciones no existen',
        });
        return;
      }

      await prisma.vacation.update({
        where: {
          id_vacation: vacationId,
          vacation_isactive: true,
        },
        data: {
          vacation_isactive: false,
        },
      });

      res.json({
        data: null,
        message: 'Vacaciones eliminadas exitosamente',
      });

      registerChange({
        changedField: 'vacation',
        changedFieldLabel: 'Eliminación de Vacaciones',
        changedTable: 'vacation',
        previousValue: vacation.start_date_vacation,
        newValue: null,
        modifyingUser: req.user.id,
        employeeId: vacation.id_employee,
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al eliminar las vacaciones. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  // @param - absenceId
  static async deleteEmployeeAbsence(req, res) {
    const {
      params: { absenceId },
      user: { id: loggedUserId },
    } = req;

    try {
      const absence = await prisma.absence.findUnique({
        where: {
          id_absence: absenceId,
          absence_isactive: true,
        },
      });

      if (!absence) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'La ausencia no existe',
        });
        return;
      }

      await prisma.absence.update({
        where: {
          id_absence: absenceId,
          absence_isactive: true,
        },
        data: {
          absence_isactive: false,
        },
      });

      res.json({
        data: null,
        message: 'Ausencia eliminada exitosamente',
      });

      registerChange({
        changedField: 'absence',
        changedFieldLabel: 'Eliminación de Ausencia',
        changedTable: 'absence',
        previousValue: `${absence.reason_absence} - ${dayjs(absence.date_absence).format('DD/MM/YYYY')}`,
        newValue: null,
        modifyingUser: loggedUserId,
        employeeId: absence.id_employee,
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al eliminar la ausencia. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  // @param - trainingId
  static async deleteEmployeeTraining(req, res) {
    const {
      params: { trainingId },
      user: { id: loggedUserId },
    } = req;

    try {
      const training = await prisma.training.findUnique({
        where: {
          id_training: trainingId,
          training_isactive: true,
        },
      });

      if (!training) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'La capacitación no existe',
        });
        return;
      }

      await prisma.training.update({
        where: {
          id_training: trainingId,
          training_isactive: true,
        },
        data: {
          training_isactive: false,
        },
      });

      res.json({
        data: null,
        message: 'Capacitación eliminada exitosamente',
      });

      registerChange({
        changedField: 'training',
        changedFieldLabel: 'Eliminación de Capacitación',
        changedTable: 'training',
        previousValue: `${training.reason_training} - ${dayjs(training.date_training).format('DD/MM/YYYY')}`,
        newValue: null,
        modifyingUser: loggedUserId,
        employeeId: training.id_employee,
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al eliminar la capacitación. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  // @param - formalWarningId
  static async deleteEmployeeFormalWarning(req, res) {
    const {
      params: { formalWarningId },
      user: { id: loggedUserId },
    } = req;

    try {
      const formalWarning = await prisma.formal_warning.findUnique({
        where: {
          id_formal_warning: formalWarningId,
          formal_warning_isactive: true,
        },
      });

      if (!formalWarning) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El llamado de atención no existe',
        });
        return;
      }

      await prisma.formal_warning.update({
        where: {
          id_formal_warning: formalWarningId,
          formal_warning_isactive: true,
        },
        data: {
          formal_warning_isactive: false,
        },
      });

      res.json({
        data: null,
        message: 'Llamado de atención eliminado exitosamente',
      });

      registerChange({
        changedField: 'formal_warning',
        changedFieldLabel: 'Eliminación de Llamado de Atención',
        changedTable: 'formal_warning',
        previousValue: formalWarning.reason_formal_warning,
        newValue: null,
        modifyingUser: loggedUserId,
        employeeId: formalWarning.id_employee,
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al eliminar El llamado de atención. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  // @param - extraHourId
  static async deleteEmployeeExtraHour(req, res) {
    const {
      params: { extraHourId },
      user: { id: loggedUserId },
    } = req;

    try {
      const extraHour = await prisma.extra_hours.findUnique({
        where: {
          id_extra_hours: extraHourId,
          extra_hours_isactive: true,
        },
      });

      if (!extraHour) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'La hora extra no existe',
        });
        return;
      }

      await prisma.extra_hours.update({
        where: {
          id_extra_hours: extraHourId,
          extra_hours_isactive: true,
        },
        data: {
          extra_hours_isactive: false,
        },
      });

      res.json({
        data: null,
        message: 'Hora extra eliminada exitosamente',
      });

      registerChange({
        changedField: 'extra_hours',
        changedFieldLabel: 'Eliminación de Hora Extra',
        changedTable: 'extra_hours',
        previousValue: `${dayjs(extraHour.date_extra_hours).format('DD/MM/YYYY')} - ${extraHour.qty_extra_hours} horas`,
        newValue: null,
        modifyingUser: loggedUserId,
        employeeId: extraHour.id_employee,
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al eliminar la hora extra. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  // @param - lateArrivalId
  static async deleteEmployeeLateArrival(req, res) {
    const {
      params: { lateArrivalId },
      user: { id: loggedUserId },
    } = req;

    try {
      const lateArrival = await prisma.late_arrival.findUnique({
        where: {
          id_late_arrival: lateArrivalId,
          late_arrival_isactive: true,
        },
      });

      if (!lateArrival) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'La llegada tarde no existe',
        });
        return;
      }

      await prisma.late_arrival.update({
        where: {
          id_late_arrival: lateArrivalId,
          late_arrival_isactive: true,
        },
        data: {
          late_arrival_isactive: false,
        },
      });

      res.json({
        data: null,
        message: 'Llegada tarde eliminada exitosamente',
      });

      registerChange({
        changedField: 'late_arrival',
        changedFieldLabel: 'Eliminación de Llegada Tarde',
        changedTable: 'late_arrival',
        previousValue: `${dayjs(lateArrival.date_late_arrival).format('DD/MM/YYYY')} - Llegada a las ${lateArrival.time_late_arrival}`,
        newValue: null,
        modifyingUser: loggedUserId,
        employeeId: lateArrival.id_employee,
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al eliminar la llegada tarde. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - licenseTypeId
  static async deleteLicenseType(req, res) {
    // only set licensetype_isactive to false
    const {
      params: { licenseTypeId },
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
          license_type_isactive: true,
        },
        data: {
          license_type_isactive: false,
        },
      });

      res.json({
        data: null,
        message: 'Tipo de licencia eliminada exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al eliminar el tipo de licencia. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - trainingTypeId
  static async deleteTrainingType(req, res) {
    const {
      params: { trainingTypeId },
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
          training_type_isactive: true,
        },
        data: {
          training_type_isactive: false,
        },
      });

      res.json({
        data: null,
        message: 'Tipo de capacitación eliminada exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al eliminar el tipo de capacitación. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  // @param - familyMemberId
  static async deleteEmployeeFamilyMember(req, res) {
    const {
      params: { familyMemberId },
      user: { id: loggedUserId },
    } = req;

    try {
      const familyMember = await prisma.family_member.findUnique({
        where: {
          id_family_member: familyMemberId,
          family_member_isactive: true,
        },
        include: {
          person: true,
        },
      });

      if (!familyMember) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El familiar no existe',
        });
        return;
      }

      // Find if this family member's person id is used in an employee
      // This can happen when the family member also works at the company

      const employeeWithFamilyMember = await prisma.employee.findFirst({
        where: {
          id_person: familyMember.id_person,
          employee_isactive: true,
        },
      });

      // If the person is not used in another employee, set it to inactive
      if (!employeeWithFamilyMember) {
        await prisma.person.update({
          where: {
            id_person: familyMember.id_person,
          },
          data: {
            person_isactive: false,
            address: {
              update: {
                address_isactive: false,
              },
            },
          },
        });
      }

      await prisma.family_member.update({
        where: {
          id_family_member: familyMemberId,
          family_member_isactive: true,
        },
        data: {
          family_member_isactive: false,
        },
      });

      res.json({
        data: null,
        message: 'Familiar eliminado exitosamente',
      });

      registerChange({
        changedField: 'family_member',
        changedFieldLabel: 'Eliminación de Familiar',
        changedTable: 'family_member',
        previousValue: `${familyMember.person.lastname}, ${familyMember.person.name}`,
        newValue: null,
        modifyingUser: loggedUserId,
        employeeId: familyMember.id_employee,
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al eliminar el familiar. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  // @param - lifeInsuranceId
  static async deleteEmployeeLifeInsurance(req, res) {
    const {
      params: { employeeId, lifeInsuranceId },
      user: { id: loggedUserId },
    } = req;

    try {
      const lifeInsurance = await prisma.life_insurance.findUnique({
        where: {
          id_life_insurance: lifeInsuranceId,
          life_insurance_isactive: true,
        },
      });

      if (!lifeInsurance) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El seguro de vida no existe',
        });
        return;
      }

      await prisma.life_insurance.update({
        where: {
          id_life_insurance: lifeInsuranceId,
          life_insurance_isactive: true,
        },
        data: {
          life_insurance_isactive: false,
        },
      });

      res.json({
        data: null,
        message: 'Seguro de vida eliminado exitosamente',
      });

      registerChange({
        changedField: 'life_insurance',
        changedFieldLabel: 'Eliminación de Seguro de Vida',
        changedTable: 'life_insurance',
        previousValue: `${lifeInsurance.life_insurance_name} - Nro. ${lifeInsurance.policy_number}`,
        newValue: null,
        modifyingUser: loggedUserId,
        employeeId,
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al eliminar el seguro de vida. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  // @param - lifeInsuranceId
  // @param - beneficiaryId
  static async deleteEmployeeLifeInsuranceBeneficiary(req, res) {
    const {
      params: { beneficiaryId },
      user: { id: loggedUserId },
    } = req;

    try {
      const beneficiary =
        await prisma.employee_life_insurance_beneficiary.findUnique({
          where: {
            id_life_insurance_beneficiary: beneficiaryId,
            life_insurance_beneficiary_isactive: true,
          },
          include: {
            person: true,
            life_insurance: true,
          },
        });

      if (!beneficiary) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El beneficiario no existe',
        });
        return;
      }

      await prisma.employee_life_insurance_beneficiary.update({
        where: {
          id_life_insurance_beneficiary: beneficiaryId,
          life_insurance_beneficiary_isactive: true,
        },
        data: {
          life_insurance_beneficiary_isactive: false,
        },
      });

      res.json({
        data: null,
        message: 'Beneficiario eliminado exitosamente',
      });

      registerChange({
        changedField: 'employee_life_insurance_beneficiary',
        changedFieldLabel: 'Eliminación de Beneficiario de Seguro de Vida',
        changedTable: 'employee_life_insurance_beneficiary',
        previousValue: `${beneficiary.person.lastname}, ${beneficiary.person.name}`,
        newValue: null,
        modifyingUser: loggedUserId,
        employeeId: beneficiary.life_insurance.id_employee,
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Ocurrió un error al eliminar el beneficiario. Intente de nuevo más tarde.',
      });
    }
  }
}
