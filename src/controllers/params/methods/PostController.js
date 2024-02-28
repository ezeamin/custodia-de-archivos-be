import HttpStatus from 'http-status-codes';
import bcrypt from 'bcryptjs';

import { prisma } from '../../../helpers/prisma.js';

import {
  generateFirstPassword,
  generateRandomUsername,
} from '../../../helpers/helpers.js';
import { sendNewUserMail } from '../../../helpers/mailing/newUserMail.js';
import { registerError } from '../../../helpers/registering/registerError.js';

export class PostController {
  static async createArea(req, res) {
    const {
      body: { title, responsibleEmail },
    } = req;

    try {
      // ! Temporary disable checking mail in use
      // const emailInUseAreaPromise = prisma.area.findFirst({
      //   where: {
      //     responsible_email: responsibleEmail,
      //     area_isactive: true,
      //     is_assignable: true,
      //   },
      // });

      // const emailInUseEmployeePromise = prisma.employee.findFirst({
      //   where: {
      //     email: responsibleEmail,
      //     employee_isactive: true,
      //   },
      // });

      // const emailInUseThirdPartyPromise = prisma.third_party.findFirst({
      //   where: {
      //     email: responsibleEmail,
      //     third_party_isactive: true,
      //   },
      // });

      // const [emailInUseArea, emailInUseEmployee, emailInUseThirdParty] =
      //   await Promise.all([
      //     emailInUseAreaPromise,
      //     emailInUseEmployeePromise,
      //     emailInUseThirdPartyPromise,
      //   ]);

      // const emailInUse =
      //   emailInUseArea || emailInUseEmployee || emailInUseThirdParty;

      // if (emailInUse) {
      //   res.status(HttpStatus.CONFLICT).json({
      //     data: null,
      //     message: 'El correo ya está en uso',
      //   });
      //   return;
      // }

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

      let newArea;
      if (existingArea && !existingArea.area_isactive) {
        newArea = await prisma.area.update({
          where: {
            id_area: existingArea.id_area,
            is_assignable: true,
          },
          data: {
            area_isactive: true,
            responsible_email: responsibleEmail,
          },
        });
      } else {
        newArea = await prisma.area.create({
          data: {
            area: title,
            responsible_email: responsibleEmail,
          },
        });
      }

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
              id_area: newArea.id_area,
            },
          },
        },
      });

      res.status(HttpStatus.CREATED).json({
        data: {
          username,
          password,
        },
        message: 'Área creada exitosamente',
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
    } catch (e) {
      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error creando el área',
      });
    }
  }
}
