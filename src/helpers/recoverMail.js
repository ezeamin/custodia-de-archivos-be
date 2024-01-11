import { envs } from './envs.js';

export const recoverMailOptions = ({ user, token }) => ({
  from: envs.MAIL.USER,
  to: user.email,
  subject: 'Recuperación de contraseña - Custodia de Archivos',
  html: `
      <main style="font-size: 16px; font-family: Arial;">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKVsleoz5dKEcoHobs-CFh8hnLYaUilXbcfJBMpf8Oo0LXXldeQBaSg8uRIPkObtqCIAs&usqp=CAU" alt="Custodia de archivos" width="100px" />
        <h1 style="font-size: 20px; font-weight: bold; margin-top: 2rem;">Recuperación de contraseña</h1>
        <p style="margin-top: 2rem;">Hola <b>${user.firstname} ${user.lastname}</b>,</p>
        <p>Para recuperar su contraseña, haga click en el siguiente enlace:
          <a href="${envs.CLIENT_URL}/reset-password?token=${token}">Recuperar contraseña</a>
        </p>
        <p style="margin-top: 1rem;">Si no funciona, puede copiar y pegar el siguiente enlace en su navegador: ${envs.CLIENT_URL}/reset-password?token=${token}</p>
        <p style="margin-top: 1rem;">Este enlace expirará en media hora, y deberá generar uno nuevo desde el sistema. Si no ha solicitado recuperar su contraseña, puede ignorar este mensaje.</p>
        <p style="margin-top: 3rem;">Saludos,</p>
        <p>Equipo de Custodia de Archivos.</p>
      </main>
      `,
});
