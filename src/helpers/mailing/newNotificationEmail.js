import { envs } from '../envs.js';
import { transporter } from './transport.js';

const frontendUrl = envs.CLIENT_URL;

const newNotificationMail = ({ name, email, notificationId }) => ({
  from: envs.MAIL.USER,
  to: email,
  subject: 'Nueva notificación - Custodia de Archivos',
  html: `
    <main style="font-size: 16px; font-family: Arial;">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKVsleoz5dKEcoHobs-CFh8hnLYaUilXbcfJBMpf8Oo0LXXldeQBaSg8uRIPkObtqCIAs&usqp=CAU" alt="Custodia de archivos" width="100px" />
        <h1 style="font-size: 20px; font-weight: bold; margin-top: 2rem;">Nueva notificación</h1>
        <p style="margin-top: 2rem;">Hola <b>${name}</b>,</p>
        <p>Le llega este correo por haber recibido una nueva notificación en el  
            <a href=${`${frontendUrl}notifications/${notificationId}`}>Portal de Empleados de Custodia de Archivos.</a>
        </p>
        <p style="margin-top: 1rem;">Es importante que pueda revisarlo, ya que puede estar siendo notificado de alguna comunicación relevante para usted. </p>
        <p style="margin-top: 1rem;">Puede abrirlo haciendo click en el enlace, o bien iniciando sesión en el Portal y luego navegando hasta "Notificaciones".</p>
        <p style="margin-top: 3rem;">Saludos,</p>
        <p>Equipo de Custodia de Archivos.</p>
    </main>
      `,
});

export const sendNewNotificationMail = async ({
  name,
  email,
  notificationId,
  username,
}) => {
  try {
    // 4- Send email to user
    const mailOptions = newNotificationMail({ name, email, notificationId });

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error(
          `🟥 NOTIFICATION MAIL FAILED FOR ${email} - ${username} - Not. ${notificationId}:`,
          err,
        );
        return;
      }

      console.log(
        `🟩 NOTIFICATION MAIL SENT TO ${email} - ${username} - Not. ${notificationId}`,
      );
    });
  } catch (err) {
    console.error('🟥', err);
  }
};
