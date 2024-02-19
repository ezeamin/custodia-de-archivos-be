import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';
import { getDownloadLink } from '../../../helpers/cloudinary.js';
import { formatHistoryData } from '../../../helpers/formatters/formatHistoryData.js';
import { formatEmployeeResponseData } from '../../../helpers/formatters/formatEmployeeResponseData.js';
import { formatEmployeesData } from '../../../helpers/formatters/formatEmployeesData.js';
import { formatBeneficiaryData } from '../../../helpers/formatters/formatBeneficiaryData.js';

export class GetController {
  static async employees(req, res) {
    const {
      query: { page = 0, entries = 10, query = '' },
    } = req;

    // query searches by name or surname or identification_number of person associated to employee
    const searchFilters = {
      OR: [
        {
          person: {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
        },
        {
          person: {
            surname: {
              contains: query,
              mode: 'insensitive',
            },
          },
        },
        {
          person: {
            identification_number: {
              contains: query,
              mode: 'insensitive',
            },
          },
        },
      ],
    };

    try {
      const countPromise = prisma.employee.count({
        where: searchFilters,
      });
      const dataPromise = prisma.employee.findMany({
        skip: page * entries,
        take: +entries,
        include: {
          area: true,
          person: true,
          employee_status: true,
        },
        orderBy: {
          person: {
            surname: 'asc',
          },
        },
        where: searchFilters,
      });

      const [count, data] = await Promise.all([countPromise, dataPromise]);

      const formattedData = formatEmployeesData(data);

      res.json({
        data: formattedData,
        totalElements: count,
        message: 'Empleados recuperados exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Error al intentar obtener los empleados. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async employeeById(req, res) {
    const {
      params: { employeeId },
    } = req;

    try {
      const employee = await prisma.employee.findUnique({
        where: {
          id_employee: employeeId,
        },
        include: {
          area: true,
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
              phone: true,
              gender: true,
              civil_status_type: true,
            },
          },
          employee_status: true,
          life_insurance: {
            where: {
              life_insurance_isactive: true,
            },
            include: {
              employee_life_insurance_beneficiary: {
                where: {
                  life_insurance_beneficiary_isactive: true,
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
                      phone: true,
                    },
                  },
                  family_relationship_type: true,
                },
              },
            },
          },
          health_insurance: true,
          preoccupational_checkup: true,
        },
      });

      if (!employee) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El empleado no existe',
        });
        return;
      }

      const family = await prisma.family_member.findMany({
        where: {
          id_employee: employeeId,
          family_member_isactive: true,
        },
        include: {
          person: true,
          family_relationship_type: true,
        },
      });

      const user = await prisma.user.findUnique({
        where: {
          username: employee.person.identification_number,
        },
      });

      const formattedData = formatEmployeeResponseData({
        employee,
        family,
        user,
      });

      res.json({
        data: formattedData,
        message: 'Employee retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Error al intentar obtener el empleado. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async employeeDocs(req, res) {
    const {
      params: { employeeId },
    } = req;

    try {
      const existingEmployee = await prisma.employee.count({
        where: {
          id_employee: employeeId,
        },
      });

      if (!existingEmployee) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El empleado no existe',
        });
        return;
      }

      const docs = await prisma.employee_doc.findMany({
        where: {
          id_employee: employeeId,
          employee_doc_isactive: true,
        },
      });

      const formattedData = docs.map((doc) => ({
        id: doc.id_employee_doc,
        name: doc.employee_doc_name,
        url: getDownloadLink(doc.employee_doc_url),
      }));

      res.json({
        data: formattedData,
        message: 'Employee documents retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Error al intentar obtener los documentos del empleado. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async employeeHistory(req, res) {
    const {
      query: { page = 0, entries = 10, query = '' },
      params: { employeeId },
    } = req;

    try {
      const existingEmployee = await prisma.employee.count({
        where: {
          id_employee: employeeId,
        },
      });

      if (!existingEmployee) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El empleado no existe',
        });
        return;
      }

      const countPromise = prisma.employee_history.count({
        where: {
          id_employee: employeeId,
        },
      });

      const historyPromise = prisma.employee_history.findMany({
        skip: page * entries,
        take: +entries,
        where: {
          id_employee: employeeId,
          modified_field_label: {
            contains: query,
            mode: 'insensitive',
          },
        },
        orderBy: {
          modification_date: 'desc',
        },
        include: {
          user: true,
        },
      });

      const [count, history] = await Promise.all([
        countPromise,
        historyPromise,
      ]);

      const formattedData = await formatHistoryData(history);

      res.json({
        data: formattedData,
        totalElements: count,
        message: 'Employee history retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Error al intentar obtener el historial del empleado. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async employeeAbsences(req, res) {
    const {
      params: { employeeId },
    } = req;

    try {
      const existingEmployee = await prisma.employee.count({
        where: {
          id_employee: employeeId,
        },
      });

      if (!existingEmployee) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El empleado no existe',
        });
        return;
      }

      const absences = await prisma.absence.findMany({
        where: {
          id_employee: employeeId,
          absence_isactive: true,
        },
      });

      const formattedData = absences.map((absence) => ({
        id: absence.id_absence,
        date: absence.date_absence,
        reason: absence.reason_absence,
      }));

      res.json({
        data: formattedData,
        message: 'Employee absences retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Error al intentar obtener las ausencias del empleado. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async employeeLicenses(req, res) {
    const {
      params: { employeeId },
    } = req;

    try {
      const existingEmployee = await prisma.employee.count({
        where: {
          id_employee: employeeId,
        },
      });

      if (!existingEmployee) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El empleado no existe',
        });
        return;
      }

      const licenses = await prisma.license.findMany({
        where: {
          id_employee: employeeId,
          license_isactive: true,
        },
        include: {
          license_type: true,
        },
      });

      const formattedData = licenses.map((license) => ({
        id: license.id_license,
        startDate: license.start_date_license,
        endDate: license.end_date_license,
        type: {
          id: license.license_type.id_license_type,
          description: license.license_type.title_license,
        },
        observations: license.observation_license,
      }));

      res.json({
        data: formattedData,
        message: 'Employee licenses retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Error al intentar obtener las licencias del empleado. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async employeeVacations(req, res) {
    const {
      params: { employeeId },
    } = req;

    try {
      const existingEmployee = await prisma.employee.count({
        where: {
          id_employee: employeeId,
        },
      });

      if (!existingEmployee) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El empleado no existe',
        });
        return;
      }

      const vacations = await prisma.vacation.findMany({
        where: {
          id_employee: employeeId,
          vacation_isactive: true,
        },
      });

      const formattedData = vacations.map((vacation) => ({
        id: vacation.id_vacation,
        startDate: vacation.start_date_vacation,
        endDate: vacation.end_date_vacation,
        observations: vacation.observation_vacation,
      }));

      res.json({
        data: formattedData,
        message: 'Employee vacations retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al intentar obtener las vacaciones del empleado',
      });
    }
  }

  // @param - employeeId
  static async employeeTrainings(req, res) {
    const {
      params: { employeeId },
    } = req;

    try {
      const existingEmployee = await prisma.employee.count({
        where: {
          id_employee: employeeId,
        },
      });

      if (!existingEmployee) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El empleado no existe',
        });
        return;
      }

      const trainings = await prisma.training.findMany({
        where: {
          id_employee: employeeId,
          training_isactive: true,
        },
        include: {
          training_type: true,
        },
      });

      const formattedData = trainings.map((training) => ({
        id: training.id_training,
        date: training.date_training,
        reason: training.reason_training,
        type: {
          id: training.training_type.id_training_type,
          description: training.training_type.title_training_type,
        },
        observations: training.observation_training,
      }));

      res.json({
        data: formattedData,
        message: 'Employee trainings retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al intentar obtener los entrenamientos del empleado',
      });
    }
  }

  // @param - employeeId
  static async employeeFormalWarnings(req, res) {
    const {
      params: { employeeId },
    } = req;

    try {
      const existingEmployee = await prisma.employee.count({
        where: {
          id_employee: employeeId,
        },
      });

      if (!existingEmployee) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El empleado no existe',
        });
        return;
      }

      const formalWarnings = await prisma.formal_warning.findMany({
        where: {
          id_employee: employeeId,
          formal_warning_isactive: true,
        },
      });

      const formattedData = formalWarnings.map((formalWarning) => ({
        id: formalWarning.id_formal_warning,
        date: formalWarning.date_formal_warning,
        reason: formalWarning.reason_formal_warning,
      }));

      res.json({
        data: formattedData,
        message: 'Employee formal warnings retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Error al intentar obtener las advertencias formales del empleado',
      });
    }
  }

  // @param - employeeId
  static async employeeLateArrivals(req, res) {
    const {
      params: { employeeId },
    } = req;

    try {
      const existingEmployee = await prisma.employee.count({
        where: {
          id_employee: employeeId,
        },
      });

      if (!existingEmployee) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El empleado no existe',
        });
        return;
      }

      const lateArrivals = await prisma.late_arrival.findMany({
        where: {
          id_employee: employeeId,
          late_arrival_isactive: true,
        },
      });

      const formattedData = lateArrivals.map((lateArrival) => ({
        id: lateArrival.id_late_arrival,
        date: lateArrival.date_late_arrival,
        time: lateArrival.time_late_arrival,
        observations: lateArrival.observation_late_arrival,
      }));

      res.json({
        data: formattedData,
        message: 'Employee late arrivals retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Error al intentar obtener las llegadas tarde del empleado. Intente de nuevo más tarde.',
      });
    }
  }

  // @param - employeeId
  static async employeeExtraHours(req, res) {
    const {
      params: { employeeId },
    } = req;

    try {
      const existingEmployee = await prisma.employee.count({
        where: {
          id_employee: employeeId,
        },
      });

      if (!existingEmployee) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El empleado no existe',
        });
        return;
      }

      const extraHours = await prisma.extra_hours.findMany({
        where: {
          id_employee: employeeId,
          extra_hours_isactive: true,
        },
      });

      const formattedData = extraHours.map((extraHour) => ({
        id: extraHour.id_extra_hours,
        date: extraHour.date_extra_hours,
        hours: extraHour.qty_extra_hours,
        observations: extraHour.observation_extra_hours,
      }));

      res.json({
        data: formattedData,
        message: 'Employee extra hours retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Error al intentar obtener las horas extras del empleado. Intente de nuevo más tarde.',
      });
    }
  }

  static async licensesTypes(_, res) {
    try {
      const types = await prisma.license_type.findMany({
        where: {
          license_type_isactive: true,
        },
      });

      const formattedData = types.map((type) => ({
        id: type.id_license_type,
        title: type.title_license,
        description: type.description_license,
      }));

      res.json({
        data: formattedData,
        message: 'License types retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al intentar obtener los tipos de licencia',
      });
    }
  }

  // @param - licenseTypeId
  static async licensesTypesById(req, res) {
    const {
      params: { licenseTypeId },
    } = req;

    try {
      const type = await prisma.license_type.findUnique({
        where: {
          id_license_type: licenseTypeId,
          license_type_isactive: true,
        },
      });

      if (!type) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El tipo de licencia no existe',
        });
        return;
      }

      const formattedData = {
        id: type.id_license_type,
        title: type.title_license,
        description: type.description_license,
      };

      res.json({
        data: formattedData,
        message: 'License type retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al intentar obtener el tipo de licencia',
      });
    }
  }

  static async trainingsTypes(_, res) {
    try {
      const types = await prisma.training_type.findMany({
        where: {
          training_type_isactive: true,
        },
      });

      const formattedData = types.map((type) => ({
        id: type.id_training_type,
        title: type.title_training_type,
        description: type.description_training_type,
      }));

      res.json({
        data: formattedData,
        message: 'Training types retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al intentar obtener los tipos de entrenamiento',
      });
    }
  }

  // @param - trainingTypeId
  static async trainingsTypesById(req, res) {
    const {
      params: { trainingTypeId },
    } = req;

    try {
      const type = await prisma.training_type.findUnique({
        where: {
          id_training_type: trainingTypeId,
          training_type_isactive: true,
        },
      });

      if (!type) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El tipo de capacitación no existe',
        });
        return;
      }

      const formattedData = {
        id: type.id_training_type,
        title: type.title_training_type,
        description: type.description_training_type,
      };

      res.json({
        data: formattedData,
        message: 'Training type retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al intentar obtener el tipo de capacitación',
      });
    }
  }

  // @param - employeeId
  // @param - familyMemberId
  static async employeeFamilyMember(req, res) {
    const {
      params: { employeeId, familyMemberId },
    } = req;

    try {
      const familyMember = await prisma.family_member.findUnique({
        where: {
          id_family_member: familyMemberId,
          id_employee: employeeId,
          family_member_isactive: true,
        },
        include: {
          person: {
            include: {
              gender: true,
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
          },
          family_relationship_type: true,
        },
      });

      if (!familyMember) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El familiar no existe',
        });
        return;
      }

      const formattedData = {
        id: familyMember.id_family_member,
        name: familyMember.person.name,
        lastname: familyMember.person.surname,
        dni: familyMember.person.identification_number,
        gender: familyMember.person.gender
          ? {
              id: familyMember.person.gender.id_gender,
              description: familyMember.person.gender.gender,
            }
          : null,
        phone: familyMember.person.phone?.phone_no || null,
        relationship: {
          id: familyMember.family_relationship_type.id_family_relationship_type,
          description:
            familyMember.family_relationship_type.family_relationship_type,
        },
        address: familyMember.address
          ? {
              street: {
                id: familyMember.person.address.street.street_api_id,
                description: familyMember.person.address.street.street,
              },
              streetNumber: familyMember.person.address.street_number,
              apt: familyMember.person.address.door,
              locality: {
                id: familyMember.person.address.street.locality.locality_api_id,
                description:
                  familyMember.person.address.street.locality.locality,
              },
              state: {
                id: familyMember.person.address.street.locality.province
                  .province_api_id,
                description:
                  familyMember.person.address.street.locality.province.province,
              },
            }
          : null,
      };

      res.json({
        data: formattedData,
        message: 'Employee family member retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error al intentar obtener el familiar del empleado',
      });
    }
  }

  // @param - employeeId
  // @param - lifeInsuranceId
  // @param - beneficiaryId
  static async lifeInsuranceBeneficiaryById(req, res) {
    const {
      params: { beneficiaryId },
    } = req;

    try {
      const beneficiary =
        await prisma.employee_life_insurance_beneficiary.findUnique({
          where: {
            id_life_insurance_beneficiary: beneficiaryId,
            life_insurance_beneficiary_isactive: true,
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
              },
            },
            family_relationship_type: true,
          },
        });

      if (!beneficiary) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'El beneficiario no existe',
        });
        return;
      }

      const formattedData = formatBeneficiaryData(beneficiary);

      res.json({
        data: formattedData,
        message: 'Beneficiario recuperado exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error al intentar obtener el beneficiario del seguro de vida',
      });
    }
  }
}
