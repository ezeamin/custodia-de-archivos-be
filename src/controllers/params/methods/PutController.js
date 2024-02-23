import HttpStatus from 'http-status-codes';
import bcrypt from 'bcryptjs';

import { prisma } from '../../../helpers/prisma.js';
import {
  generateFirstPassword,
  generateRandomUsername,
} from '../../../helpers/helpers.js';
import { sendNewUserMail } from '../../../helpers/mailing/newUserMail.js';

export class PutController {
  // @param - areaId
  static async updateArea(req, res) {
    const {
      params: { areaId },
      body: { title, responsibleEmail },
    } = req;

    try {
      const emailInUseAreaPromise = prisma.area.findFirst({
        where: {
          responsible_email: responsibleEmail,
          area_isactive: true,
          is_assignable: true,
          NOT: {
            area: title,
          },
        },
      });

      const emailInUseEmployeePromise = prisma.employee.findFirst({
        where: {
          email: responsibleEmail,
          employee_isactive: true,
        },
      });

      const emailInUseThirdPartyPromise = prisma.third_party.findFirst({
        where: {
          email: responsibleEmail,
          third_party_isactive: true,
        },
      });

      const [emailInUseArea, emailInUseEmployee, emailInUseThirdParty] =
        await Promise.all([
          emailInUseAreaPromise,
          emailInUseEmployeePromise,
          emailInUseThirdPartyPromise,
        ]);

      const emailInUse =
        emailInUseArea || emailInUseEmployee || emailInUseThirdParty;

      if (emailInUse) {
        res.status(HttpStatus.CONFLICT).json({
          data: null,
          message: 'El correo ya está en uso',
        });
        return;
      }

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

      const updatedArea = await prisma.area.update({
        where: {
          id_area: areaId,
          is_assignable: true,
        },
        data: {
          area: title,
          responsible_email: responsibleEmail,
        },
        include: {
          user: true,
        },
      });

      // Create user if it doesn't have one

      if (updatedArea.user.length === 0) {
        const username = generateRandomUsername();
        const password = generateFirstPassword();
        const hashedPassword = bcrypt.hashSync(password, 10);

        await prisma.user.create({
          data: {
            username,
            password: hashedPassword,
            user_type: {
              connect: {
                user_type: 'area',
              },
            },
            area: {
              connect: {
                id_area: updatedArea.id_area,
              },
            },
          },
        });

        res.json({
          data: {
            username,
            password,
          },
          message: 'Área actualizada exitosamente',
        });

        // Avoid sending mails in test environment
        if (process.env.NODE_ENV === 'test') return;

        const fullname = `Responsable de ${title}`;
        sendNewUserMail({
          name: fullname,
          email: responsibleEmail,
          username,
          password,
        });
      } else {
        res.json({
          data: null,
          message: 'Área actualizada exitosamente',
        });
      }
    } catch (e) {
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error actualizando el área',
      });
    }
  }
}
