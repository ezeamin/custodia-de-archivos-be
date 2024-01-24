import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';

export class GetController {
  static async status(_, res) {
    try {
      const data = await prisma.employee_status.findMany();

      const formattedData = data.map((item) => ({
        id: item.id_status,
        description: item.title_status,
      }));

      res.json({
        data: formattedData,
        message: 'Data retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error retrieving data',
      });
    }
  }

  static async roles(_, res) {
    try {
      const data = await prisma.user_type.findMany();

      const formattedData = data.map((item) => ({
        id: item.id_user_type,
        description: item.user_type,
      }));

      res.json({
        data: formattedData,
        message: 'Data retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error retrieving data',
      });
    }
  }

  static async genders(_, res) {
    try {
      const data = await prisma.gender.findMany();

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
        message: 'Error retrieving data',
      });
    }
  }

  static async areas(_, res) {
    try {
      const data = await prisma.area.findMany();

      const formattedData = data.map((item) => ({
        id: item.id_area,
        description: item.area,
      }));

      res.json({
        data: formattedData,
        message: 'Data retrieved successfully',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error retrieving data',
      });
    }
  }
}
