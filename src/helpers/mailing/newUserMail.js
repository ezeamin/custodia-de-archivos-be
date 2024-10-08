import { envs } from '../envs.js';
import { registerError } from '../registering/registerError.js';
import { transporter } from './transport.js';

const frontendUrl = envs.CLIENT_URL;
const user = envs.MAIL.USER;

const newUserMail = ({ name, email, username, password }) => ({
  from: user,
  to: email,
  subject: 'Creación de usuario - Custodia de Archivos',
  html: `
    <main style="font-size: 16px; font-family: Arial;">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKVsleoz5dKEcoHobs-CFh8hnLYaUilXbcfJBMpf8Oo0LXXldeQBaSg8uRIPkObtqCIAs&usqp=CAU" alt="Custodia de archivos" width="100px" />
        <h1 style="font-size: 20px; font-weight: bold; margin-top: 2rem;">Nuevo usuario</h1>
        <p style="margin-top: 2rem;">Hola <b>${name}</b>,</p>
        <p>Se generó un nuevo usuario para usted en el 
            <a href=${frontendUrl}>Portal de Empleados de Custodia de Archivos.</a>
        </p>
        <p style="margin-top: 1rem;">Sus credenciales temporales son:</p>
        <ul>
            <li> Usuario: <b>${username}</b>
            <li> Contraseña: <b>${password}</b>
        </ul>
        <p style="margin-top: 1rem;">Esta contraseña deberá ser cambiada tras el primer inicio de sesión. </p>
        <p style="margin-top: 1rem;">Si tiene dudas de por qué recibe este mail, contacte con el administrador de la empresa.</p>
        <p style="margin-top: 3rem;">Saludos,</p>
        <p>Equipo de Custodia de Archivos.</p>
    </main>
      `,
});

export const sendNewUserMail = async ({ name, email, username, password }) => {
  try {
    // 4- Send email to user
    const mailOptions = newUserMail({ name, email, username, password });

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error(
          `🟥 USER CREATION MAIL FAILED FOR ${email} - ${username}:`,
          err,
        );
        registerError(err);
        return;
      }

      console.log(`🟩 USER CREATION MAIL SENT TO ${email} - ${username}`);
    });
  } catch (err) {
    registerError(err);
  }
};
