import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status-codes';

// import UsersModel from '../models/UserSchema.js';
import { envs } from '../../../helpers/envs.js';

const { JWT_SECRET_KEY } = envs;

export class GetController {
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
}
