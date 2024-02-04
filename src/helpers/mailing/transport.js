import nodemailer from 'nodemailer';

import { envs } from '../envs.js';

export const transporter = nodemailer.createTransport({
  host: envs.MAIL.HOST,
  port: envs.MAIL.PORT,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: envs.MAIL.USER,
    pass: envs.MAIL.PASS,
  },
});
