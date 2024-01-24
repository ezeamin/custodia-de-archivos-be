import HttpStatus from 'http-status-codes';
import bcrypt from 'bcryptjs';

import { prisma } from '../../../helpers/prisma.js';
import { generateFirstPassword } from '../../../helpers/helpers.js';

export class PostController {
  static async createUser(req, res) {
    const {
      body: { employeeId },
    } = req;

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
        return res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          message: 'Empleado no encontrado',
        });
      }

      const user_type = await prisma.user_type.findUnique({
        where: {
          user_type: 'employee',
        },
      });

      const password = generateFirstPassword();
      const hashedPassword = bcrypt.hashSync(password, 10);

      const user = await prisma.user.create({
        data: {
          username: employee.person.identification_number,
          password: hashedPassword,
          id_employee: employeeId,
          id_user_type: user_type.id_user_type,
        },
      });

      return res
        .status(HttpStatus.CREATED)
        .json({ username: user.username, password });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al crear el usuario',
      });
    }
  }

  static async createReadOnlyUser(req, res) {
    res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
  }
}
