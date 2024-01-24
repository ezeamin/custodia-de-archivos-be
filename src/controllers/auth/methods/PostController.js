import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import HttpStatus from 'http-status-codes';
import nodemailer from 'nodemailer';

// import UsersModel from '../models/UserSchema.js';
import { envs } from '../../../helpers/envs.js';
import { prisma } from '../../../helpers/prisma.js';

import { recoverMailOptions } from '../../../helpers/recoverMail.js';
import { registerLogin } from '../../../helpers/registerLogin.js';

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
          username: +username,
        },
        include: {
          employee: {
            include: {
              person: true,
            },
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

      // 3- Generate JWT
      const userInfo = {
        user: {
          id: userInDB.id_user,
          name: userInDB.id_employee
            ? userInDB.employee.person.name
            : 'Solo lectura',
          role: userInDB.user_type.user_type.toUpperCase(),
        },
      };

      // (payload, secretKey, options)
      const accessToken = jwt.sign(userInfo, JWT_SECRET_KEY, {
        expiresIn: '1h',
      });
      const refreshToken = jwt.sign(userInfo, JWT_SECRET_KEY, {
        expiresIn: '2h',
      });

      // 4- Send JWT to FE
      res.cookie('refresh_token', refreshToken, {
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      res.json({
        data: { token: accessToken },
        message: 'Login exitoso',
      });

      registerLogin(req, userInDB.id_user);
    } catch (err) {
      console.error('🟥', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: {
          data: null,
          message: `ERROR: ${err}`,
        },
      });
    }
  }

  static async refreshToken(req, res) {
    const {
      cookies: { refresh_token: refreshToken },
    } = req;

    try {
      if (!refreshToken) throw new Error('No refresh token found');

      // 1- Validate JWT
      // (payload, secretKey, options)
      const { user } = jwt.verify(refreshToken, JWT_SECRET_KEY);

      // 2- Generate new JWT
      const userInfo = {
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
        },
      };

      // (payload, secretKey, options)
      const accessToken = jwt.sign(userInfo, JWT_SECRET_KEY, {
        expiresIn: '1h',
      });
      const newRefreshToken = jwt.sign(userInfo, JWT_SECRET_KEY, {
        expiresIn: '2h',
      });

      // 3- Send JWT to FE
      res.cookie('refresh_token', newRefreshToken, {
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      res.json({
        data: { token: accessToken },
        message: 'Refresh token exitoso',
      });
    } catch (err) {
      console.error('🟥', err);
      // delete refreshToken cookie
      res.clearCookie('refresh_token');
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
      // 1- (Try to) Search user in DB
      // const userInDB = await UsersModel.findOne({
      //   //! Change to EmployeesModel
      //   username: username.trim(),
      //   isActive: true,
      // });
      const userInDB = null;

      // 2- Validate credentials
      // Cases:
      // a. incorrect username (no user found)
      if (!userInDB) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          data: null,
          message: 'Usuario no encontrado',
        });
        return;
      }

      const userEmail = userInDB.email;
      const hiddenEmail = userEmail.replace(/.{3}(?=@)/g, '***');

      // 3- Send email to FE
      res.json({
        data: { email: hiddenEmail },
        message: 'Usuario encontrado',
      });

      // 4- Generate JWT
      const userInfo = {
        user: {
          id: userInDB._doc._id,
          firstname: userInDB._doc.firstname,
          lastname: userInDB._doc.lastname,
          username: userInDB._doc.username,
          email: userInDB._doc.email,
          role: userInDB._doc.role,
        },
      };

      // (payload, secretKey, options)
      const token = jwt.sign(userInfo, JWT_SECRET_KEY, {
        expiresIn: '30m',
      });

      // 5- Send email to user
      const mailOptions = recoverMailOptions({ user: userInDB._doc, token });

      const transporter = nodemailer.createTransport({
        service: envs.MAIL.HOST,
        auth: {
          user: envs.MAIL.USER,
          pass: envs.MAIL.PASS,
        },
      });

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(
            `🟥 RECOVER MAIL FAILED FOR ${userEmail} - ${userInDB._doc.username}:`,
            err,
          );
          return;
        }
        console.log(
          `🟩 RECOVER MAIL SENT TO ${userEmail} - ${userInDB._doc.username}:`,
          info,
        );
      });
    } catch (err) {
      console.error('🟥', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: {
          data: null,
          message: `ERROR: ${err}`,
        },
      });
    }
  }

  static logout(_, res) {
    try {
      // delete refreshToken cookie
      res.clearCookie('refresh_token', {
        sameSite: 'none',
        secure: true,
      });
      res.json({
        data: null,
        message: 'Logout exitoso',
      });
    } catch (err) {
      console.error('🟥', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: {
          data: null,
          message: `ERROR: ${err}`,
        },
      });
    }
  }
}
