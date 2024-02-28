import HttpStatus from 'http-status-codes';
import bcrypt from 'bcryptjs';

import { prisma } from '../../../helpers/prisma.js';

import { generateFirstPassword } from '../../../helpers/helpers.js';
import { sendNewUserMail } from '../../../helpers/mailing/newUserMail.js';
import { registerError } from '../../../helpers/registering/registerError.js';

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

      username = employee.person.identification_number;
      password = generateFirstPassword();
      const hashedPassword = bcrypt.hashSync(password, 10);

      userInDB = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          user_type: {
            connect: {
              user_type: 'employee',
            },
          },
          employee: {
            connect: {
              id_employee: employeeId,
            },
          },
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

      res.status(HttpStatus.CREATED).json({
        data: { username, password },
        message: 'Usuario creado exitosamente',
      });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al crear el usuario',
      });
      return;
    }

    // Avoid sending mails in test environment
    if (process.env.NODE_ENV === 'test') return;

    const name = `${userInDB.employee.person.name} ${userInDB.employee.person.surname}`;
    const { email } = userInDB.employee;
    sendNewUserMail({ name, email, username, password });
  }

  static async createReadOnlyUser(req, res) {
    const {
      body: { name, lastname, cuil, description, email },
    } = req;

    const username = cuil;
    const password = generateFirstPassword();
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
      const genders = await prisma.gender.findMany();

      await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          third_party: {
            create: {
              person: {
                create: {
                  name,
                  surname: lastname,
                  identification_number: cuil,
                  birth_date: new Date(),
                  id_gender: genders[0]?.id_gender || null,
                },
              },
              email,
              description,
            },
          },
          user_type: {
            connect: {
              user_type: 'third_party',
            },
          },
        },
      });

      res.status(HttpStatus.CREATED).json({
        data: { username, password },
        message: 'Usuario creado exitosamente',
      });
    } catch (error) {
      registerError(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al crear el usuario',
      });
      return;
    }

    // Avoid sending mails in test environment
    if (process.env.NODE_ENV === 'test') return;

    const fullname = `${name} ${lastname}`;
    sendNewUserMail({ name: fullname, email, username, password });
  }
}
