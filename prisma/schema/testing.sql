TRUNCATE TABLE public.error_logs;
TRUNCATE TABLE public.employee_doc;
TRUNCATE TABLE public.document_folder;
TRUNCATE TABLE public.login;
TRUNCATE TABLE public.training;
TRUNCATE TABLE public.license;
TRUNCATE TABLE public.absence;
TRUNCATE TABLE public.vacation;
TRUNCATE TABLE public.training_type;
TRUNCATE TABLE public.license_type;
TRUNCATE TABLE public.late_arrival;
TRUNCATE TABLE public.formal_warning;
TRUNCATE TABLE public.extra_hours;
TRUNCATE TABLE public.employee_history;
TRUNCATE TABLE public."user";
TRUNCATE TABLE public.employee;
TRUNCATE TABLE public.third_party;
TRUNCATE TABLE public.user_type;
TRUNCATE TABLE public.person;
TRUNCATE TABLE public.street;
TRUNCATE TABLE public.address;
TRUNCATE TABLE public.province;
TRUNCATE TABLE public.phone;
TRUNCATE TABLE public.locality;
TRUNCATE TABLE public.gender;
TRUNCATE TABLE public.family;
TRUNCATE TABLE public.family_relationship_type;
TRUNCATE TABLE public.area;
TRUNCATE TABLE public.notification_receiver;
TRUNCATE TABLE public.notification_doc;
TRUNCATE TABLE public.notification;
TRUNCATE TABLE public.notification_type;
TRUNCATE TABLE public.receiver_type;

INSERT INTO public.gender (id_gender,gender)
VALUES
    ('018d3b85-ad41-71c2-a317-95f3fa1a632d','Masculino'),
    ('018d3b85-ad41-7211-91f3-c9c1a59d7d75','Femenino'),
    ('018d3b85-ad41-7604-be77-b3668698a7da','Otro');

INSERT INTO public.area (id_area,area,is_assignable)
VALUES
    ('018d3b85-ad41-77e2-aaa7-4fcc12ba0132','Mantenimiento',TRUE),
    ('018d3b85-ad41-7ebf-b39d-2f042aeef39b','Administración',TRUE),
    ('018d3b85-ad41-7b89-a115-53129e20a558','Almacenamiento',TRUE),
    ('018d3b85-ad41-752d-96dc-550186aafccd','Ventas',TRUE),
    ('018d3b85-ad41-7ce6-a177-930a835ca677','Compras',TRUE),
    ('018d3b85-ad41-752f-972c-30102846b42c','Producción',TRUE),
    ('018d3b85-ad41-7d49-b328-b71e34a42396','Recursos Humanos',TRUE),
    ('018d3b85-ad41-74d4-a5b5-8c08718dbce8','Contabilidad',TRUE),
    ('018d3b85-ad41-76b0-a0bb-f4ee8a8f0f0a','Sistemas',TRUE),
    ('018d3b85-ad41-789e-b615-cd610c5c131f','Gerencia',TRUE),
    ('018d3b85-ad41-789e-b615-cd610c5c12ef','Todos los empleados',FALSE);

INSERT INTO public.employee_status (id_status, "status") VALUES
  ('018d3b85-ad41-70bf-a4b3-b248a73b7bf8','active'),
  ('018d3b85-ad41-7c07-8ac9-00c4a6d0f4f8','suspended'),
  ('018d3b85-ad41-705d-b6ac-eff17a2cbb63','inactive'),
  ('018d3b85-ad41-74b8-9bd4-9f7b27b02176','deleted');

INSERT INTO public.user_type (id_user_type, user_type) VALUES
  ('32deb906-6292-4908-9cfc-02394fd4ab28','admin'),
  ('62ffb154-64a6-4b87-9486-3bb7b14a77f3','employee'),
  ('5fc9c68b-34f3-45aa-ba54-9305515b8bcb','third_party');

INSERT INTO public.family_relationship_type (id_family_relationship_type, family_relationship_type) VALUES
  ('018d4131-99a7-7301-95f5-f1851f99af92','Padre'),
  ('018d4131-99a7-7be7-8806-86232190920d','Madre'),
  ('018d4131-99a7-76a7-b028-90262b1ea22f','Hermano/a'),
  ('018d4131-99a7-7d97-b802-e7e60c762b37','Hijo/a'),
  ('018d4131-99a7-72c1-ae5e-d021667a7739','Abuelo/a'),
  ('018d4131-99a7-7a4d-8daf-e03c84bf6708','Tio/a'),
  ('018d4131-99a7-7538-b160-ba114ded2ddc','Primo/a'),
  ('018d4131-99a7-7e65-81e5-8bb048d0fc31','Sobrino/a'),
  ('018d4131-99a7-747d-8861-ea674c345ea0','Suegro/a'),
  ('018d4131-99a7-7165-af6f-0b6d7de55694','Cónyuge'),
  ('018d4131-99a7-7c4d-9b9f-5b1b8b1b1b1b','Otro');

INSERT INTO public.civil_status_type (id_civil_status_type, civil_status_type) VALUES
  ('018d55f3-fc73-7ee0-b166-bac9c3c4b81f', 'Soltero/a'),
  ('018d55f4-5cc5-7afe-a15f-62810780270b','Casado/a'),
  ('018d55f4-6c3e-7180-9045-da30c7077cd3','Divorciado/a'),
  ('018d55f4-7aba-72f9-af8e-744af2b9b83f','Viudo/a');

INSERT INTO public.receiver_type (id_receiver_type, receiver_type) VALUES
  ('018d3b85-ad41-7c4d-9b9f-5b1b8a1b1b1b','user'),
  ('018d3b85-ad41-7c4d-9b9f-5b1b8b1b1b1d','area');

-- Insert example person
INSERT INTO public.person (id_person,id_gender,name,surname,birth_date,identification_number)
VALUES (
    '018d3b85-ad41-7129-b181-0f1fc7c70573',
    '018d3b85-ad41-71c2-a317-95f3fa1a632d',
    'Ezequiel',
    'Amin',
    '2002-02-17',
    '43706393'
);

INSERT INTO public.person (id_person,id_gender,name,surname,birth_date,identification_number)
VALUES (
    '018d3b85-ad41-7129-b181-0f1fc7c71234',
    '018d3b85-ad41-71c2-a317-95f3fa1a632d',
    'Carlos',
    'Amin',
    '1967-02-07',
    '17860733'
);

-- Insert example employee
INSERT INTO public.employee (id_employee,id_person,id_status,id_area,no_file,email,employment_date,position,working_hours,picture_url)
VALUES (
    '018d3b85-ad41-7cca-94c9-0cf50325d9a4',
    '018d3b85-ad41-7129-b181-0f1fc7c70573',
    '018d3b85-ad41-70bf-a4b3-b248a73b7bf8',
    '018d3b85-ad41-76b0-a0bb-f4ee8a8f0f0a',
    1000,
    'ezequielamin@outlook.com',
    '2021-02-17',
    'Programador',
    8,
    'https://res.cloudinary.com/dr5ac8e1c/raw/upload/w_300,h_300,c_fill,g_face/v1706054063/img_2267-2.jpg'
);

-- Insert default admin user
INSERT INTO public."user" (id_user,id_user_type,id_employee,username,"password")
VALUES (
    '1249cbd7-5184-45d4-bd18-04a3f0769e99',
    '32deb906-6292-4908-9cfc-02394fd4ab28',   -- admin
    '018d3b85-ad41-7cca-94c9-0cf50325d9a4',   -- id_employee (Ezequiel Amin)
    '43706393', -- username
    '$2a$10$pl90EGBF.N/hGh18/KtjBuP4q/M056tDH8LXy2UT8d4PFQ1CD/OFa'  -- Password: "admin"
);

INSERT INTO public.employee_history (id_employee,id_submitted_by,modified_table,modified_field,modified_field_label,previous_value,current_value)
VALUES (
    '018d3b85-ad41-7cca-94c9-0cf50325d9a4',
    '1249cbd7-5184-45d4-bd18-04a3f0769e99',
    'employee',
    'employee',
    'Creación de Empleado',
    NULL,
    to_jsonb(now())
);

INSERT INTO public.family_member (id_family_member,id_person,id_employee,id_relationship_type)
VALUES (
    '018d5a99-9686-7b77-b151-eb3cfaefd72c',
    '018d3b85-ad41-7129-b181-0f1fc7c71234',
    '018d3b85-ad41-7cca-94c9-0cf50325d9a4',
    '018d4131-99a7-7301-95f5-f1851f99af92'
);