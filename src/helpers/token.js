import jwt from 'jsonwebtoken';
import { envs } from './envs.js';

const { JWT_SECRET_KEY } = envs;

export const generateToken = (user) => {
  // 3- Generate JWT
  const userInfo = {
    user: {
      id: user.id_user,
      name: user.id_employee
        ? user.employee.person.name
        : user.third_party.person.name,
      hasChangedPass: user.has_changed_def_pass,
      role: user.user_type.user_type.toUpperCase(),
    },
  };

  // (payload, secretKey, options)
  const accessToken = jwt.sign(userInfo, JWT_SECRET_KEY, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign(userInfo, JWT_SECRET_KEY, {
    expiresIn: '2h',
  });

  return { accessToken, refreshToken };
};
