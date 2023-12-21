import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import HttpStatus from 'http-status-codes';

import UsersModel from '../models/UserSchema.js';

const { JWT_SECRET_KEY } = process.env;

// ----------------------------
// POST
// ----------------------------

export const postLogin = async (req, res) => {
  const {
    body: { username, password },
  } = req;

  try {
    // 1- (Try to) Search user in DB
    const userInDB = await UsersModel.findOne({
      username: username.trim(),
      isActive: true,
    });

    // 2- Validate credentials
    // Cases:
    // a. incorrect username (no user found)
    // b. incorrect password (we compare them using bcrypt)
    if (!userInDB || !bcrypt.compareSync(password, userInDB.password.trim())) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        data: null,
        message: 'Usuario o contraseña no valida(s)',
      });
      return;
    }

    // 3- Generate JWT
    // Everything is correct, generate JWT
    // We remove the password and isActive from the user object,
    // so that it doesn´t get sent to the FE
    const userInfo = {
      user: {
        id: userInDB._doc._id,
        firstname: userInDB._doc.firstname,
        lastname: userInDB._doc.lastname,
        username: userInDB._doc.username,
        isAdmin: userInDB._doc.isAdmin,
      },
    };

    // (payload, secretKey, options)
    const token = jwt.sign(userInfo, JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    // 4- Send JWT to FE
    res.json({
      data: token,
      message: 'Login exitoso',
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
};
