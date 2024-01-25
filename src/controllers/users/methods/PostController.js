import HttpStatus from 'http-status-codes';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

import { prisma } from '../../../helpers/prisma.js';
import { generateFirstPassword } from '../../../helpers/helpers.js';
import { newUserMail } from '../../../helpers/newUserMail.js';
import { envs } from '../../../helpers/envs.js';

export class PostController {
  static async createUser(req, res) {
    const {
      body: { employeeId },
    } = req;

    let username = '';
    let password = '';
    let userInDB = null;

    try {
      const employee = await prisma.employee.findUnique({
        where: {
          id_employee: employeeId,
        },
        include: {
          person: true,
        },
      });

      if (!employee) {
        res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'Empleado no encontrado',
        });
        return;
      }

      const user_type = await prisma.user_type.findUnique({
        where: {
          user_type: 'employee',
        },
      });

      username = employee.person.identification_number;
      password = generateFirstPassword();
      const hashedPassword = bcrypt.hashSync(password, 10);

      userInDB = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          id_employee: employeeId,
          id_user_type: user_type.id_user_type,
        },
        include: {
          employee: {
            include: {
              person: true,
            },
          },
          third_party: {
            include: {
              person: true,
            },
          },
        },
      });

      res.status(HttpStatus.CREATED).json({ username, password });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al crear el usuario',
      });
      return;
    }

    try {
      // 4- Send email to user
      const mailOptions = newUserMail({ user: userInDB, username, password });

      const transporter = nodemailer.createTransport({
        host: envs.MAIL.HOST,
        port: envs.MAIL.PORT,
        tls: {
          rejectUnauthorized: false,
        },
        auth: {
          user: envs.MAIL.USER,
          pass: envs.MAIL.PASS,
        },
      });

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.error(
            `🟥 USER CREATION MAIL FAILED FOR ${userInDB.employee?.email || userInDB.third_party?.email} - ${userInDB.username}:`,
            err,
          );
          return;
        }

        console.log(
          `🟩 USER CREATION MAIL SENT TO ${userInDB.employee?.email || userInDB.third_party?.email} - ${userInDB.username}`,
        );
      });
    } catch (err) {
      console.error('🟥', err);
    }
  }

  static async createReadOnlyUser(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }
}
