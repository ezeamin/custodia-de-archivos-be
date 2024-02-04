import HttpStatus from 'http-status-codes';

import { envs } from '../envs.js';
import { transporter } from './transport.js';

const recoverMailOptions = ({ user, token }) => {
  const isEmployee = !!user.id_employee;
  const name = isEmployee
    ? `${user.employee.person.name} ${user.employee.person.surname}`
    : `${user.third_party.person.name} ${user.third_party.person.surname}`;

  const email = isEmployee ? user.employee.email : user.third_party.email;

  return {
    from: envs.MAIL.USER,
    to: email,
    subject: 'Recuperación de contraseña - Custodia de Archivos',
    html: `
      <main style="font-size: 16px; font-family: Arial;">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKVsleoz5dKEcoHobs-CFh8hnLYaUilXbcfJBMpf8Oo0LXXldeQBaSg8uRIPkObtqCIAs&usqp=CAU" alt="Custodia de archivos" width="100px" />
        <h1 style="font-size: 20px; font-weight: bold; margin-top: 2rem;">Recuperación de contraseña</h1>
        <p style="margin-top: 2rem;">Hola <b>${name}</b>,</p>
        <p>Para recuperar su contraseña, haga click en el siguiente enlace:
          <a href="${envs.CLIENT_URL}${envs.CLIENT_RESET_PASS_PATH}?token=${token}">Recuperar contraseña</a>
        </p>
        <p style="margin-top: 1rem;">Si no funciona, puede copiar y pegar el siguiente enlace en su navegador: ${envs.CLIENT_URL}${envs.CLIENT_RESET_PASS_PATH}?token=${token}</p>
        <p style="margin-top: 1rem;">Este enlace expirará en media hora, y deberá generar uno nuevo desde el sistema. Si no ha solicitado recuperar su contraseña, puede ignorar este mensaje.</p>
        <p style="margin-top: 3rem;">Saludos,</p>
        <p>Equipo de Custodia de Archivos.</p>
      </main>
      `,
  };
};

export const sendNewUserMail = async ({
  user,
  email,
  hiddenEmail,
  token,
  res,
}) => {
  try {
    // 4- Send email to user
    const mailOptions = recoverMailOptions({ user, token });

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error(
          `🟥 RECOVER MAIL FAILED FOR ${email} - ${user.username}:`,
          err,
        );
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          errors: {
            data: null,
            message: `Error generando mail`,
          },
        });
        return;
      }

      // 5- Send email to FE
      res.json({
        data: { email: hiddenEmail },
        message: 'Usuario encontrado',
      });
      console.log(`🟩 RECOVER MAIL SENT TO ${email} - ${user.username}`);
    });
  } catch (err) {
    console.error('🟥', err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: {
        data: null,
        message: `Ocurrió un error al intentar recuperar la contraseña`,
      },
    });
  }
};
