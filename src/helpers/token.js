import jwt from 'jsonwebtoken';
import { envs } from './envs.js';

const { JWT_SECRET_KEY } = envs;

export const generateToken = (user) => {
  const isEmployeeOrAdmin = user.id_employee;
  const isArea = user.id_area;
  const isThirdParty = user.id_third_party;

  let name = '';
  if (isEmployeeOrAdmin) {
    name = user.employee.person.name;
  } else if (isArea) {
    name = `Area - ${user.area.area}`;
  } else if (isThirdParty) {
    name = user.third_party.person.name;
  }

  // 3- Generate JWT
  const userInfo = {
    user: {
      id: user.id_user,
      name,
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
