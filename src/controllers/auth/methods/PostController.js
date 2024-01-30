import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import HttpStatus from 'http-status-codes';

import { envs } from '../../../helpers/envs.js';
import { prisma } from '../../../helpers/prisma.js';

import { sendNewUserMail } from '../../../helpers/mailing/recoverMail.js';
import { registerLogin } from '../../../helpers/registering/registerLogin.js';
import { generateToken } from '../../../helpers/token.js';

const { JWT_SECRET_KEY } = envs;

export class PostController {
  static async login(req, res) {
    const {
      body: { username, password },
    } = req;

    try {
      // 1- Search user in DB
      const userInDB = await prisma.user.findUnique({
        where: {
          username,
        },
        include: {
          employee: {
            include: {
              person: true,
            },
          },
          third_party: {
            include: { person: true },
          },
          user_type: true,
        },
      });

      // 2- Validate credentials
      // Cases:
      // a. incorrect username (no user found)
      // b. incorrect password (we compare them using bcrypt)
      if (
        !userInDB ||
        !bcrypt.compareSync(password, userInDB.password.trim())
      ) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          data: null,
          message: 'Usuario o contraseña no valida(s)',
        });
        return;
      }

      if (!userInDB.user_isactive) {
        res.status(HttpStatus.BAD_REQUEST).json({
          data: null,
          message:
            'El usuario ya no se encuentra activo. Contacte con el administrador',
        });
        return;
      }

      const { accessToken, refreshToken } = generateToken(userInDB);

      // 4- Send JWT to FE
      res.cookie('refresh_token', refreshToken, {
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
      });
      res.json({
        data: {
          token: accessToken,
          shouldChangePass: !userInDB.has_changed_def_pass,
        },
        message: 'Login exitoso',
      });

      registerLogin(req, userInDB.id_user);
    } catch (err) {
      console.error('🟥', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: `Ocurrió un error al iniciar sesión`,
      });
    }
  }

  static async refreshToken(req, res) {
    const {
      cookies: { refresh_token: refreshToken },
    } = req;

    try {
      if (!refreshToken) {
        res.status(HttpStatus.BAD_REQUEST).json({
          data: null,
          message: 'No se encontró una sesión activa',
        });
        return;
      }

      // 1- Validate JWT
      const {
        user: { id },
      } = jwt.verify(refreshToken, JWT_SECRET_KEY);

      // 2- Renew data
      const userInDB = await prisma.user.findUnique({
        where: {
          id_user: id,
        },
        include: {
          employee: {
            include: {
              person: true,
            },
          },
          third_party: {
            include: { person: true },
          },
          user_type: true,
        },
      });

      if (!userInDB.has_changed_def_pass)
        throw new Error('Usuario no activado');

      // 3- Generate tokens
      const { accessToken, refreshToken: newRefreshToken } =
        generateToken(userInDB);

      // 4- Send JWT to FE
      res.cookie('refresh_token', newRefreshToken, {
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
      });
      res.json({
        data: { token: accessToken },
        message: 'Refresh token exitoso',
      });
    } catch (err) {
      console.error('🟥', err);
      // delete refreshToken cookie
      res.clearCookie('refresh_token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
      });
      res.status(HttpStatus.UNAUTHORIZED).json({
        data: null,
        message: null,
      });
    }
  }

  static async recoverPassword(req, res) {
    const {
      body: { username },
    } = req;

    try {
      // 1- Search user in DB
      const userInDB = await prisma.user.findUnique({
        where: {
          username,
        },
        include: {
          employee: {
            include: {
              person: true,
            },
          },
          third_party: true,
          user_type: true,
        },
      });

      if (userInDB && !userInDB.user_isactive) {
        res.status(HttpStatus.BAD_REQUEST).json({
          data: null,
          message:
            'El usuario ya no se encuentra activo. Contacte con el administrador',
        });
        return;
      }

      // 2- Validate credentials
      // Cases:
      // a. incorrect username (no user found)
      if (!userInDB) {
        res.status(HttpStatus.BAD_REQUEST).json({
          data: null,
          message: 'Usuario no encontrado',
        });
        return;
      }

      const userEmail = userInDB.employee.email || userInDB.third_party.email;
      const hiddenEmail = `${userEmail.slice(0, 3)}***${userEmail.slice(
        userEmail.indexOf('@') - 2,
      )}`;

      // 3- Generate JWT
      const userInfo = {
        user: {
          id: userInDB.id_user,
          name: userInDB.id_employee
            ? userInDB.employee.person.name
            : userInDB.third_party.person.name,
          role: userInDB.user_type.user_type.toUpperCase(),
        },
      };

      // (payload, secretKey, options)
      const token = jwt.sign(userInfo, JWT_SECRET_KEY, {
        expiresIn: '30m',
      });

      // Avoid sending mails in test environment
      if (process.env.NODE_ENV === 'test') {
        res.json({
          data: { email: hiddenEmail },
          message: 'Usuario encontrado',
        });
        return;
      }

      sendNewUserMail({
        user: userInDB,
        email: userEmail,
        hiddenEmail,
        token,
        res,
      });
    } catch (err) {
      console.error('🟥', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: `Ocurrió un error al intentar recuperar la contraseña`,
      });
    }
  }

  static logout(req, res) {
    try {
      if (!req.cookies.refresh_token) {
        res.status(HttpStatus.BAD_REQUEST).json({
          data: null,
          message: 'No se encontró una sesión activa',
        });
        return;
      }

      // delete refreshToken cookie
      res.clearCookie('refresh_token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
      });
      res.json({
        data: null,
        message: 'Logout exitoso',
      });
    } catch (err) {
      console.error('🟥', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: `Ocurrió un error al cerrar sesión. Intente refrescar la pantalla`,
      });
    }
  }
}
