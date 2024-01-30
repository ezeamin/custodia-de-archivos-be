import { prisma } from '../helpers/prisma.js';

async function truncateTables() {
  await prisma.notification_doc.deleteMany();
  await prisma.employee_doc.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.login.deleteMany();
  await prisma.training.deleteMany();
  await prisma.license.deleteMany();
  await prisma.absence.deleteMany();
  await prisma.vacation.deleteMany();
  await prisma.training_type.deleteMany();
  await prisma.notification_type.deleteMany();
  await prisma.license_type.deleteMany();
  await prisma.late_arrival.deleteMany();
  await prisma.formal_warning.deleteMany();
  await prisma.extra_hours.deleteMany();
  await prisma.employee_history.deleteMany();
  await prisma.family_member.deleteMany();
  await prisma.user.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.employee_status.deleteMany();
  await prisma.third_party.deleteMany();
  await prisma.user_type.deleteMany();
  await prisma.person.deleteMany();
  await prisma.address.deleteMany();
  await prisma.street.deleteMany();
  await prisma.locality.deleteMany();
  await prisma.province.deleteMany();
  await prisma.phone.deleteMany();
  await prisma.gender.deleteMany();
  await prisma.family_relationship_type.deleteMany();
  await prisma.area.deleteMany();
  await prisma.civil_status_type.deleteMany();
}

async function insertData() {
  await prisma.gender.createMany({
    data: [
      {
        id_gender: '018d3b85-ad41-71c2-a317-95f3fa1a632d',
        gender: 'Masculino',
      },
      { id_gender: '018d3b85-ad41-7211-91f3-c9c1a59d7d75', gender: 'Femenino' },
      { id_gender: '018d3b85-ad41-7604-be77-b3668698a7da', gender: 'Otro' },
    ],
  });

  await prisma.area.createMany({
    data: [
      {
        id_area: '018d3b85-ad41-77e2-aaa7-4fcc12ba0132',
        area: 'Mantenimiento',
      },
      {
        id_area: '018d3b85-ad41-7ebf-b39d-2f042aeef39b',
        area: 'Administración',
      },
      {
        id_area: '018d3b85-ad41-7b89-a115-53129e20a558',
        area: 'Almacenamiento',
      },
      { id_area: '018d3b85-ad41-752d-96dc-550186aafccd', area: 'Ventas' },
      { id_area: '018d3b85-ad41-7ce6-a177-930a835ca677', area: 'Compras' },
      { id_area: '018d3b85-ad41-752f-972c-30102846b42c', area: 'Producción' },
      {
        id_area: '018d3b85-ad41-7d49-b328-b71e34a42396',
        area: 'Recursos Humanos',
      },
      { id_area: '018d3b85-ad41-74d4-a5b5-8c08718dbce8', area: 'Contabilidad' },
      { id_area: '018d3b85-ad41-76b0-a0bb-f4ee8a8f0f0a', area: 'Sistemas' },
      { id_area: '018d3b85-ad41-789e-b615-cd610c5c131f', area: 'Gerencia' },
    ],
  });

  // Example employee_status
  await prisma.employee_status.createMany({
    data: [
      { id_status: '018d3b85-ad41-70bf-a4b3-b248a73b7bf8', status: 'active' },
      {
        id_status: '018d3b85-ad41-7c07-8ac9-00c4a6d0f4f8',
        status: 'suspended',
      },
      { id_status: '018d3b85-ad41-705d-b6ac-eff17a2cbb63', status: 'inactive' },
      { id_status: '018d3b85-ad41-74b8-9bd4-9f7b27b02176', status: 'deleted' },
    ],
  });

  // Example user_type
  await prisma.user_type.createMany({
    data: [
      {
        id_user_type: '32deb906-6292-4908-9cfc-02394fd4ab28',
        user_type: 'admin',
      },
      {
        id_user_type: '62ffb154-64a6-4b87-9486-3bb7b14a77f3',
        user_type: 'employee',
      },
      {
        id_user_type: '5fc9c68b-34f3-45aa-ba54-9305515b8bcb',
        user_type: 'third_party',
      },
    ],
  });

  // Example family_relationship_type
  await prisma.family_relationship_type.createMany({
    data: [
      {
        id_family_relationship_type: '018d4131-99a7-7301-95f5-f1851f99af92',
        family_relationship_type: 'Padre',
      },
      {
        id_family_relationship_type: '018d4131-99a7-7be7-8806-86232190920d',
        family_relationship_type: 'Madre',
      },
      {
        id_family_relationship_type: '018d4131-99a7-76a7-b028-90262b1ea22f',
        family_relationship_type: 'Hermano/a',
      },
      {
        id_family_relationship_type: '018d4131-99a7-7d97-b802-e7e60c762b37',
        family_relationship_type: 'Hijo/a',
      },
      {
        id_family_relationship_type: '018d4131-99a7-72c1-ae5e-d021667a7739',
        family_relationship_type: 'Abuelo/a',
      },
      {
        id_family_relationship_type: '018d4131-99a7-7a4d-8daf-e03c84bf6708',
        family_relationship_type: 'Tio/a',
      },
      {
        id_family_relationship_type: '018d4131-99a7-7538-b160-ba114ded2ddc',
        family_relationship_type: 'Primo/a',
      },
      {
        id_family_relationship_type: '018d4131-99a7-7e65-81e5-8bb048d0fc31',
        family_relationship_type: 'Sobrino/a',
      },
      {
        id_family_relationship_type: '018d4131-99a7-747d-8861-ea674c345ea0',
        family_relationship_type: 'Suegro/a',
      },
      {
        id_family_relationship_type: '018d4131-99a7-7165-af6f-0b6d7de55694',
        family_relationship_type: 'Cónyuge',
      },
      {
        id_family_relationship_type: '018d4131-99a7-7c4d-9b9f-5b1b8b1b1b1b',
        family_relationship_type: 'Otro',
      },
    ],
  });

  // Example civil_status_type
  await prisma.civil_status_type.createMany({
    data: [
      {
        id_civil_status_type: '018d55f3-fc73-7ee0-b166-bac9c3c4b81f',
        civil_status_type: 'Soltero/a',
      },
      {
        id_civil_status_type: '018d55f4-5cc5-7afe-a15f-62810780270b',
        civil_status_type: 'Casado/a',
      },
      {
        id_civil_status_type: '018d55f4-6c3e-7180-9045-da30c7077cd3',
        civil_status_type: 'Divorciado/a',
      },
      {
        id_civil_status_type: '018d55f4-7aba-72f9-af8e-744af2b9b83f',
        civil_status_type: 'Viudo/a',
      },
    ],
  });

  // Example person
  await prisma.person.create({
    data: {
      id_person: '018d3b85-ad41-7129-b181-0f1fc7c70573',
      id_gender: '018d3b85-ad41-71c2-a317-95f3fa1a632d',
      name: 'Ezequiel',
      surname: 'Amin',
      birth_date: new Date('2002-02-17'),
      identification_number: '43706393',
    },
  });

  await prisma.person.create({
    data: {
      id_person: '018d3b85-ad41-7129-b181-0f1fc7c71234',
      id_gender: '018d3b85-ad41-71c2-a317-95f3fa1a632d',
      name: 'Carlos',
      surname: 'Amin',
      birth_date: new Date('1967-02-07'),
      identification_number: '17860733',
    },
  });

  // Example employee
  await prisma.employee.create({
    data: {
      id_employee: '018d3b85-ad41-7cca-94c9-0cf50325d9a4',
      id_person: '018d3b85-ad41-7129-b181-0f1fc7c70573',
      id_status: '018d3b85-ad41-70bf-a4b3-b248a73b7bf8',
      id_area: '018d3b85-ad41-76b0-a0bb-f4ee8a8f0f0a',
      no_file: 1000,
      email: 'ezequielamin@outlook.com',
      employment_date: new Date('2021-02-17'),
      position: 'Programador',
      working_hours: 8,
      picture_url:
        'https://res.cloudinary.com/dr5ac8e1c/raw/upload/w_300,h_300,c_fill,g_face/v1706054063/img_2267-2.jpg',
    },
  });

  // Example default admin user
  await prisma.user.create({
    data: {
      id_user: '1249cbd7-5184-45d4-bd18-04a3f0769e99',
      id_user_type: '32deb906-6292-4908-9cfc-02394fd4ab28',
      id_employee: '018d3b85-ad41-7cca-94c9-0cf50325d9a4',
      username: '43706393', // Adjust username as needed
      password: '$2a$10$XYaSlV0oGj8XNiiUawT6iu7JF43a4A9nDzA7dl2SQr6co3a/rh4Hy', // 1234Abcd
      has_changed_def_pass: true,
    },
  });

  // Example employee_history
  await prisma.employee_history.create({
    data: {
      id_employee: '018d3b85-ad41-7cca-94c9-0cf50325d9a4',
      id_submitted_by: '1249cbd7-5184-45d4-bd18-04a3f0769e99',
      modified_table: 'employee',
      modified_field: 'employee',
      modified_field_label: 'Creación de Empleado',
      previous_value: null,
      current_value: { someJsonValue: 'Use appropriate JSON value here' }, // Adjust as needed
    },
  });

  // Example family_member
  await prisma.family_member.create({
    data: {
      id_family_member: '018d5a99-9686-7b77-b151-eb3cfaefd72c',
      id_person: '018d3b85-ad41-7129-b181-0f1fc7c71234', // Adjust person ID as needed
      id_employee: '018d3b85-ad41-7cca-94c9-0cf50325d9a4',
      id_relationship_type: '018d4131-99a7-7301-95f5-f1851f99af92', // Adjust relationship type ID as needed
    },
  });
}

const reset = async () => {
  try {
    console.log('🔄 Preparing database...');
    await truncateTables();
    console.log('✅ Truncated tables successfully.');
    await insertData();
    console.log('✅ Data set successfully.\n');
  } catch (error) {
    console.error('\n\n🟥 Error resetting database:\n', error);
    throw error;
  }
};

reset();
