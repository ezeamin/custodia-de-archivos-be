import { prisma } from '../prisma.js';
import { registerError } from './registerError.js';

export const registerLogin = async (req, id_user) => {
  const {
    ip,
    headers: { 'user-agent': userAgent, 'true-client-ip': trueClientIp },
  } = req;

  try {
    await prisma.login.create({
      data: {
        ip_address: ip === '::1' && trueClientIp ? trueClientIp : 'Desconocido',
        user_agent: userAgent || '',
        id_user,
      },
    });
  } catch (e) {
    registerError(e);
  }
};
