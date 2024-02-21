import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';

export class PutController {
  // @param - areaId
  static async updateArea(req, res) {
    const {
      params: { areaId },
      body: { title },
    } = req;

    try {
      const area = await prisma.area.findUnique({
        where: {
          id_area: areaId,
          area_isactive: true,
          is_assignable: true,
        },
      });

      const areaWithSameName = await prisma.area.findFirst({
        where: {
          area: title,
          is_assignable: true,
        },
      });

      if (!area) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'Área no encontrada',
        });
        return;
      }

      if (areaWithSameName && areaWithSameName.id_area !== areaId) {
        res.status(HttpStatus.CONFLICT).json({
          data: null,
          message: 'Un área con el mismo nombre ya existe',
        });
        return;
      }

      await prisma.area.update({
        where: {
          id_area: areaId,
          is_assignable: true,
        },
        data: {
          area: title,
        },
      });

      res.json({
        data: null,
        message: 'Área actualizada exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error actualizando el área',
      });
    }
  }
}
