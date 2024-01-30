import HttpStatus from 'http-status-codes';
import bcrypt from 'bcryptjs';

import { prisma } from '../../../helpers/prisma.js';
import { generateFirstPassword } from '../../../helpers/helpers.js';
import { sendNewUserMail } from '../../../helpers/mailing/newUserMail.js';

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

      res.status(HttpStatus.CREATED).json({ username, password });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al crear el usuario',
      });
      return;
    }

    const name = `${userInDB.employee.person.name} ${userInDB.employee.person.surname}`;
    const { email } = userInDB.employee;
    sendNewUserMail({ name, email, username, password });
  }

  static async createReadOnlyUser(req, res) {
    const {
      body: { name, lastname, dni, description, email },
    } = req;

    const username = dni;
    const password = generateFirstPassword();
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
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
                  identification_number: dni,
                  birth_date: new Date(),
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

      res.status(HttpStatus.CREATED).json({ username, password });
    } catch (error) {
      console.log('🟥', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al crear el usuario',
      });
      return;
    }

    const fullname = `${name} ${lastname}`;
    sendNewUserMail({ name: fullname, email, username, password });
  }
}
