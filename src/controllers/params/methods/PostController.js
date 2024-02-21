import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';

export class PostController {
  static async createArea(req, res) {
    const {
      body: { title },
    } = req;

    try {
      const existingArea = await prisma.area.findFirst({
        where: {
          area: title,
          is_assignable: true,
        },
      });

      if (existingArea && existingArea.area_isactive) {
        res.status(HttpStatus.CONFLICT).json({
          data: null,
          message: 'El área ya existe',
        });
        return;
      }

      if (existingArea && !existingArea.area_isactive) {
        await prisma.area.update({
          where: {
            id_area: existingArea.id_area,
            is_assignable: true,
          },
          data: {
            area_isactive: true,
          },
        });
      } else {
        await prisma.area.create({
          data: {
            area: title,
          },
        });
      }

      res.status(HttpStatus.CREATED).json({
        data: null,
        message: 'Área creada exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error creando el área',
      });
    }
  }
}
