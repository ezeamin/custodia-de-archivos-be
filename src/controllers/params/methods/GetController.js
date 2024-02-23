import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';

export class GetController {
  static async relationships(_, res) {
    try {
      const data = await prisma.family_relationship_type.findMany({
        where: {
          family_relationship_type_isactive: true,
        },
      });

      const formattedData = data.map((item) => ({
        id: item.id_family_relationship_type,
        description: item.family_relationship_type,
      }));

      res.json({
        data: formattedData,
        message: 'Data retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error trayendo la información de los parentescos',
      });
    }
  }

  static async status(_, res) {
    try {
      const data = await prisma.employee_status.findMany({
        where: {
          status_isactive: true,
        },
      });

      const formattedData = data.map((item) => ({
        id: item.id_status,
        description: item.status,
      }));

      res.json({
        data: formattedData,
        message: 'Data retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message:
          'Error trayendo la información de los estados de los empleados',
      });
    }
  }

  static async roles(req, res) {
    const {
      query: { notifications = false },
    } = req;

    try {
      let data = await prisma.user_type.findMany({
        where: {
          user_type_isactive: true,
        },
      });

      // Filter out "third_party" user type for allowed roles in notifications form
      if (notifications) {
        data = data.filter((item) => item.user_type !== 'third_party');
      }

      const formattedData = data.map((item) => ({
        id: item.id_user_type,
        description: item.user_type_label,
      }));

      res.json({
        data: formattedData,
        message: 'Data retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error trayendo la información de los roles de los usuarios',
      });
    }
  }

  static async genders(_, res) {
    try {
      const data = await prisma.gender.findMany({
        where: {
          gender_isactive: true,
        },
      });

      const formattedData = data.map((item) => ({
        id: item.id_gender,
        description: item.gender,
      }));

      res.json({
        data: formattedData,
        message: 'Data retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error trayendo la información de los géneros',
      });
    }
  }

  static async areas(req, res) {
    const {
      query: { filterAssignable = false },
    } = req;

    try {
      const data = await prisma.area.findMany({
        where: {
          area_isactive: true,
          ...(filterAssignable ? { is_assignable: true } : {}),
        },
        orderBy: {
          area: 'asc',
        },
      });

      const formattedData = data.map((item) => ({
        id: item.id_area,
        description: item.area,
        responsibleEmail: item.responsible_email,
      }));

      res.json({
        data: formattedData,
        message: 'Data retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error trayendo la información de las áreas',
      });
    }
  }

  // @param - areaId
  static async area(req, res) {
    const {
      params: { areaId },
    } = req;

    try {
      const data = await prisma.area.findUnique({
        where: {
          id_area: areaId,
          area_isactive: true,
        },
      });

      if (!data) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'Área no encontrada',
        });
        return;
      }

      res.json({
        data: {
          id: data.id_area,
          description: data.area,
          responsibleEmail: data.responsible_email,
        },
        message: 'Data retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error trayendo la información del área',
      });
    }
  }

  static async civilStatus(_, res) {
    try {
      const data = await prisma.civil_status_type.findMany({
        where: {
          civil_status_type_isactive: true,
        },
      });

      const formattedData = data.map((item) => ({
        id: item.id_civil_status_type,
        description: item.civil_status_type,
      }));

      res.json({
        data: formattedData,
        message: 'Data retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error trayendo la información de los estados civiles',
      });
    }
  }
}
