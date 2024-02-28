import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';

import { registerError } from '../../../helpers/registering/registerError.js';

export class DeleteController {
  // @param - areaId
  static async deleteArea(req, res) {
    const {
      params: { areaId },
    } = req;

    try {
      const area = await prisma.area.findUnique({
        where: {
          id_area: areaId,
          area_isactive: true,
          is_assignable: true,
        },
        include: {
          user: true,
        },
      });

      if (!area) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'Área no encontrada',
        });
        return;
      }

      await prisma.area.update({
        where: {
          id_area: areaId,
          is_assignable: true,
        },
        data: {
          area_isactive: false,
        },
      });

      if (area.user.length > 0) {
        await prisma.user.update({
          where: {
            id_user: area.user[0].id_user,
          },
          data: {
            user_isactive: false,
          },
        });
      }

      res.json({
        data: null,
        message: 'Área eliminada exitosamente',
      });
    } catch (e) {
      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error eliminando el área',
      });
    }
  }
}
