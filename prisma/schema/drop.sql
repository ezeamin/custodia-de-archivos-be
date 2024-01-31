-- Drop tables
DROP TABLE IF EXISTS public.employee_doc CASCADE;
DROP TABLE IF EXISTS public.login CASCADE;
DROP TABLE IF EXISTS public.training CASCADE;
DROP TABLE IF EXISTS public.license CASCADE;
DROP TABLE IF EXISTS public.absence CASCADE;
DROP TABLE IF EXISTS public.vacations CASCADE;
DROP TABLE IF EXISTS public.training_type CASCADE;
DROP TABLE IF EXISTS public.license_type CASCADE;
DROP TABLE IF EXISTS public.late_arrival CASCADE;
DROP TABLE IF EXISTS public.formal_warning CASCADE;
DROP TABLE IF EXISTS public.extra_hours CASCADE;
DROP TABLE IF EXISTS public.employee_history CASCADE;
DROP TABLE IF EXISTS public."user" CASCADE;
DROP TABLE IF EXISTS public.employee CASCADE;
DROP TABLE IF EXISTS public.third_party CASCADE;
DROP TABLE IF EXISTS public.user_type CASCADE;
DROP TABLE IF EXISTS public.person CASCADE;
DROP TABLE IF EXISTS public.street CASCADE;
DROP TABLE IF EXISTS public.address CASCADE;
DROP TABLE IF EXISTS public.province CASCADE;
DROP TABLE IF EXISTS public.phone CASCADE;
DROP TABLE IF EXISTS public.locality CASCADE;
DROP TABLE IF EXISTS public.gender CASCADE;
DROP TABLE IF EXISTS public.family CASCADE;
DROP TABLE IF EXISTS public.family_relationship_type CASCADE;
DROP TABLE IF EXISTS public.area CASCADE;
DROP TABLE IF EXISTS public.notification_allowed_role CASCADE;
DROP TABLE IF EXISTS public.notification_receiver CASCADE;
DROP TABLE IF EXISTS public.notification_doc CASCADE;
DROP TABLE IF EXISTS public.notification CASCADE;
DROP TABLE IF EXISTS public.notification_type CASCADE;
DROP TABLE IF EXISTS public.receiver_type CASCADE;

-- Drop the schema
DROP SCHEMA IF EXISTS public CASCADE;
