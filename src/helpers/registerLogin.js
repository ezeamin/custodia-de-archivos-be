import { prisma } from './prisma.js';

export const registerLogin = async (req, id_user) => {
  const {
    ip,
    headers: { 'user-agent': userAgent },
  } = req;

  try {
    await prisma.login.create({
      data: {
        ip_address: ip,
        user_agent: userAgent,
        id_user,
      },
    });
  } catch (e) {
    console.error('🟥', e);
  }
};
