import { envs } from './envs.js';

const frontendUrl = envs.CLIENT_URL;

export const newUserMail = ({ user, username, password }) => {
  console.log(user);
  const isEmployee = !!user.id_employee;
  const name = isEmployee
    ? `${user.employee.person.name} ${user.employee.person.surname}`
    : `${user.third_party.person.name} ${user.third_party.person.surname}`;

  const email = isEmployee ? user.employee.email : user.third_party.email;

  return {
    from: envs.MAIL.USER,
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
        <p style="margin-top: 1rem;">Esta contraseña deberá ser cambiada tras el primer inicio. </p>
        <p style="margin-top: 1rem;">Si tiene dudas de por qué recibe este mail, contacte con el administrador de la empresa.</p>
        <p style="margin-top: 3rem;">Saludos,</p>
        <p>Equipo de Custodia de Archivos.</p>
    </main>
      `,
  };
};
