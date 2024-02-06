CREATE SCHEMA IF NOT EXISTS public;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pg_uuidv7";

CREATE TABLE public.area (
    id_area         UUID DEFAULT uuid_generate_v7() NOT NULL,
    area            varchar(20) NOT NULL UNIQUE,
    is_assignable    boolean DEFAULT true NOT NULL,
    area_isactive   boolean DEFAULT true NOT NULL,
    CONSTRAINT pk_area PRIMARY KEY (id_area)
);

CREATE TABLE public.employee_status (
    id_status            UUID DEFAULT uuid_generate_v7() NOT NULL,
    "status"             varchar(10) NOT NULL UNIQUE,
    status_isactive      boolean DEFAULT true NOT NULL,
    CONSTRAINT pk_employee_status PRIMARY KEY (id_status)
);

CREATE TABLE public.gender (
    id_gender            UUID DEFAULT uuid_generate_v7() NOT NULL,
    gender               varchar(15) NOT NULL UNIQUE,
    gender_isactive      boolean DEFAULT true NOT NULL,
    CONSTRAINT pk_gender PRIMARY KEY (id_gender)
);

CREATE TABLE public.province (
    id_province       UUID DEFAULT uuid_generate_v7() NOT NULL,
    province_api_id   varchar(20) NOT NULL UNIQUE,
    province          varchar(50) NOT NULL UNIQUE,
    CONSTRAINT pk_province PRIMARY KEY (id_province)
);

CREATE TABLE public.locality (
    id_locality          UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_province          UUID NOT NULL,
    locality_api_id      varchar(20) NOT NULL UNIQUE,
    locality             varchar(30) NOT NULL UNIQUE,
    CONSTRAINT pk_localidad PRIMARY KEY (id_locality),
    CONSTRAINT fk_locality_province FOREIGN KEY (id_province) REFERENCES public.province(id_province)
);


CREATE TABLE public.street (
    id_street          UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_locality        UUID NOT NULL,
    street_api_id      varchar(20) NOT NULL UNIQUE,
    street             varchar(75) NOT NULL UNIQUE,
    CONSTRAINT pk_street PRIMARY KEY (id_street),
    CONSTRAINT fk_street_locality FOREIGN KEY (id_locality) REFERENCES public.locality(id_locality)
);

CREATE TABLE public."address" (
    id_address              UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_street               UUID NOT NULL,
    street_number           integer NOT NULL,
    door                    varchar(4),
    address_isactive        boolean DEFAULT true NOT NULL,
    address_created_at      timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    address_updated_at      timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_address PRIMARY KEY (id_address),
    CONSTRAINT fk_address_street FOREIGN KEY (id_street) REFERENCES public.street(id_street)
);

CREATE TABLE public.phone (
    id_phone          UUID DEFAULT uuid_generate_v7() NOT NULL,
    phone_no          varchar(13) NOT NULL,
    phone_isactive    boolean DEFAULT true NOT NULL,
    phone_created_at  timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    phone_updated_at  timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_phone PRIMARY KEY (id_phone)
);

CREATE TABLE public.civil_status_type (
    id_civil_status_type        UUID DEFAULT uuid_generate_v7() NOT NULL,
    civil_status_type           varchar(20) NOT NULL UNIQUE,
    civil_status_type_isactive  boolean DEFAULT true NOT NULL,
    CONSTRAINT pk_civil_status_type PRIMARY KEY (id_civil_status_type)
);

CREATE TABLE public.health_insurance (
    id_health_insurance UUID DEFAULT uuid_generate_v7() NOT NULL,
    health_insurance varchar(50),
    affiliate_number varchar(20),
    health_insurance_isactive boolean DEFAULT true NOT NULL,
    CONSTRAINT pk_health_insurance PRIMARY KEY (id_health_insurance)
);

CREATE TABLE public.person (
    id_person            UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_gender            UUID ,
    id_address           UUID ,
    id_phone             UUID ,
    id_civil_status      UUID ,
    id_health_insurance  UUID ,
    name                 varchar(50) NOT NULL,
    surname              varchar(50) NOT NULL,
    birth_date           timestamp NOT NULL,
    identification_number varchar(8) NOT NULL UNIQUE,
    person_isactive      boolean DEFAULT true NOT NULL,
    person_created_at    timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    person_updated_at    timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_person PRIMARY KEY (id_person),
    CONSTRAINT fk_person_gender FOREIGN KEY (id_gender) REFERENCES public.gender(id_gender),
    CONSTRAINT fk_person_address FOREIGN KEY (id_address) REFERENCES public."address"(id_address),
    CONSTRAINT fk_person_phone FOREIGN KEY (id_phone) REFERENCES public.phone(id_phone),
    CONSTRAINT fk_person_civil_status FOREIGN KEY (id_civil_status) REFERENCES public.civil_status_type(id_civil_status_type),
    CONSTRAINT fk_person_health_insurance FOREIGN KEY (id_health_insurance) REFERENCES public.health_insurance(id_health_insurance)
);

CREATE UNIQUE INDEX unq_id_person ON public.person (id_person);

CREATE TABLE public.user_type (
    id_user_type        UUID DEFAULT uuid_generate_v7() NOT NULL,
    user_type           varchar(20) NOT NULL UNIQUE,
    user_type_label     varchar(30) NOT NULL,
    user_type_isactive  boolean DEFAULT true NOT NULL,
    CONSTRAINT pk_user_type PRIMARY KEY (id_user_type)
);

CREATE TABLE public.third_party (
    id_third_party       UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_person            UUID NOT NULL UNIQUE,
    "description"        varchar(100),
    email                varchar(75) NOT NULL UNIQUE,
    third_party_isactive boolean DEFAULT true NOT NULL,
    CONSTRAINT pk PRIMARY KEY (id_third_party),
    CONSTRAINT fk_third_party_person FOREIGN KEY (id_person) REFERENCES public.person(id_person)
);

CREATE TABLE public.preoccupational_checkup (
    id_preoccupational_checkup                  UUID DEFAULT uuid_generate_v7() NOT NULL,
    is_fit                                      boolean NOT NULL,   
    observations_preoccupational_checkup        varchar(200),
    preoccupational_checkup_isactive            boolean DEFAULT true NOT NULL,
    preoccupational_checkup_created_at          timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    preoccupational_checkup_updated_at          timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_preoccupational_checkup PRIMARY KEY (id_preoccupational_checkup)
);

CREATE TABLE public.employee (
    id_employee                         UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_person                           UUID NOT NULL UNIQUE,
    id_status                           UUID NOT NULL,
    id_area                             UUID NOT NULL,
    id_preoccupational_checkup          UUID,
    no_file                             integer NOT NULL UNIQUE,
    email                               varchar(75) NOT NULL UNIQUE,
    employment_date                     timestamp NOT NULL,
    termination_date                    timestamp,
    position                            varchar(100) NOT NULL,
    working_hours                       integer DEFAULT 0,
    picture_url                         varchar(300) NOT NULL,
    drivers_license_expiration_date     timestamp,
    employee_isactive                   boolean DEFAULT true NOT NULL,
    employee_created_at                 timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    employee_updated_at                 timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_employee PRIMARY KEY (id_employee),
    CONSTRAINT fk_employee_status FOREIGN KEY (id_status) REFERENCES public.employee_status(id_status),
    CONSTRAINT fk_employee_area FOREIGN KEY (id_area) REFERENCES public.area(id_area),
    CONSTRAINT fk_employee_person FOREIGN KEY (id_person) REFERENCES public.person(id_person),
    CONSTRAINT fk_employee_preoccupational_checkup FOREIGN KEY (id_preoccupational_checkup) REFERENCES public.preoccupational_checkup(id_preoccupational_checkup)
);

CREATE UNIQUE INDEX unq_id_employee ON public.employee (id_employee);

CREATE TABLE public.life_insurance (
    id_life_insurance UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_employee UUID NOT NULL,
    life_insurance_name varchar(50) NOT NULL,
    policy_number varchar(20) NOT NULL,
    life_insurance_isactive boolean DEFAULT true NOT NULL,
    life_insurance_created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    life_insurance_updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_life_insurance PRIMARY KEY (id_life_insurance),
    CONSTRAINT fk_life_insurance_employee FOREIGN KEY (id_employee) REFERENCES public.employee(id_employee)
);

CREATE TABLE public.employee_beneficiary_life_insurance (
    id_beneficiary_life_insurance UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_life_insurance UUID NOT NULL,
    id_person UUID NOT NULL,
    beneficiary_percentage integer DEFAULT 100 NOT NULL,
    beneficiary_life_insurance_isactive boolean DEFAULT true NOT NULL,
    beneficiary_life_insurance_created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    beneficiary_life_insurance_updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_beneficiary_life_insurance PRIMARY KEY (id_beneficiary_life_insurance),
    CONSTRAINT fk_beneficiary_life_insurance_person FOREIGN KEY (id_person) REFERENCES public.person(id_person)
);

CREATE TABLE public.family_relationship_type (
    id_family_relationship_type             UUID DEFAULT uuid_generate_v7() NOT NULL,
    family_relationship_type                varchar(20) NOT NULL,
    family_relationship_type_isactive       boolean DEFAULT true NOT NULL,
    CONSTRAINT pk_family_relationship_type PRIMARY KEY (id_family_relationship_type)
);

CREATE TABLE public.family_member (
    id_family_member                UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_person                       UUID NOT NULL,
    id_employee                     UUID NOT NULL,
    id_relationship_type            UUID DEFAULT uuid_generate_v7() NOT NULL,
    family_member_isactive          boolean DEFAULT true NOT NULL,
    family_member_created_at        timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    family_member_updated_at        timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_family_member PRIMARY KEY (id_family_member),
    CONSTRAINT fk_family_member_relationship_type FOREIGN KEY (id_relationship_type) REFERENCES public.family_relationship_type(id_family_relationship_type),
    CONSTRAINT fk_family_member_employee FOREIGN KEY (id_employee) REFERENCES public.employee(id_employee),
    CONSTRAINT fk_family_member_person FOREIGN KEY (id_person) REFERENCES public.person(id_person)
);

CREATE TABLE public."user" (
    id_user              UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_user_type         UUID NOT NULL,
    id_employee          UUID ,
    id_third_party       UUID ,
    username             varchar(8) NOT NULL UNIQUE,
    "password"           varchar(100) NOT NULL,
    has_changed_def_pass boolean DEFAULT false NOT NULL,
    user_isactive        boolean DEFAULT true NOT NULL,
    user_created_at      timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_updated_at      timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_user PRIMARY KEY (id_user),
    CONSTRAINT fk_user_type FOREIGN KEY (id_user_type) REFERENCES public.user_type(id_user_type),
    CONSTRAINT fk_user_employee FOREIGN KEY (id_employee) REFERENCES public.employee(id_employee),
    CONSTRAINT fk_user_third_party FOREIGN KEY (id_third_party) REFERENCES public.third_party(id_third_party)
);

CREATE UNIQUE INDEX unq_id_user ON public."user" (id_user);

CREATE TABLE public.employee_history (
    id_history           UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_employee          UUID NOT NULL,
    id_submitted_by      UUID NOT NULL,
    modified_table       varchar(50) NOT NULL,
    modified_field       varchar(30) NOT NULL,
    modified_field_label varchar(50) NOT NULL,
    previous_value       jsonb,
    current_value        jsonb,
    modification_date    timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_employee_history PRIMARY KEY (id_history),
    CONSTRAINT fk_employee_history_employee FOREIGN KEY (id_employee) REFERENCES public.employee(id_employee),
    CONSTRAINT fk_employee_history_user FOREIGN KEY (id_submitted_by) REFERENCES public."user"(id_user)
);

CREATE TABLE public.extra_hours (
    id_extra_hours           UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_employee              UUID NOT NULL,
    id_submitted_by          UUID NOT NULL,
    date_extra_hours         date NOT NULL,
    qty_extra_hours          integer NOT NULL,
    observation_extra_hours  varchar(200),
    extra_hours_isactive     boolean DEFAULT true NOT NULL,
    extra_hours_created_at   timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    extra_hours_updated_at   timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_extra_hours PRIMARY KEY (id_extra_hours),
    CONSTRAINT fk_extra_hours_employee FOREIGN KEY (id_employee) REFERENCES public.employee(id_employee),
    CONSTRAINT fk_extra_hours_submitted_by FOREIGN KEY (id_submitted_by) REFERENCES public."user"(id_user)
);

CREATE TABLE public.formal_warning (
    id_formal_warning           UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_employee                 UUID NOT NULL,
    id_submitted_by             UUID NOT NULL,
    reason_formal_warning       varchar(200) NOT NULL,
    date_formal_warning         timestamp NOT NULL,
    formal_warning_isactive     boolean DEFAULT true NOT NULL,
    formal_warning_created_at   timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    formal_warning_updated_at   timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_formal_warning PRIMARY KEY (id_formal_warning),
    CONSTRAINT fk_formal_warning_employee FOREIGN KEY (id_employee) REFERENCES public.employee(id_employee),
    CONSTRAINT fk_formal_warning_submitted_by FOREIGN KEY (id_submitted_by) REFERENCES public."user"(id_user)
);

CREATE TABLE public.late_arrival (
    id_late_arrival      UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_employee          UUID NOT NULL,
    id_submitted_by      UUID NOT NULL,
    date_late_arrival    timestamp NOT NULL,
    time_late_arrival    char(5) NOT NULL,
    observation_late_arrival varchar(200),
    late_arrival_isactive   boolean DEFAULT true NOT NULL,
    late_arrival_created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    late_arrival_updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_late_arrival PRIMARY KEY (id_late_arrival),
    CONSTRAINT fk_late_arrival_employee FOREIGN KEY (id_employee) REFERENCES public.employee(id_employee),
    CONSTRAINT fk_late_arrival_submitted_by FOREIGN KEY (id_submitted_by) REFERENCES public."user"(id_user)
);

CREATE TABLE public.license_type (
    id_license_type                 UUID DEFAULT uuid_generate_v7() NOT NULL,
    title_license                   varchar(30) NOT NULL UNIQUE,
    description_license             varchar(100) NOT NULL,
    license_type_isactive           boolean DEFAULT true NOT NULL ,
    CONSTRAINT pk_license_type PRIMARY KEY (id_license_type)
);

CREATE TABLE public.training_type (
    id_training_type                UUID DEFAULT uuid_generate_v7() NOT NULL,
    title_training_type             varchar(30) NOT NULL UNIQUE,
    description_training_type       varchar(100) NOT NULL,
    training_type_isactive          boolean DEFAULT true NOT NULL,
    CONSTRAINT pk_id_training_type PRIMARY KEY (id_training_type)
);

CREATE TABLE public.vacation (
    id_vacation            UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_employee            UUID NOT NULL,
    id_submitted_by        UUID NOT NULL,
    start_date_vacation    timestamp NOT NULL,
    end_date_vacation      timestamp NOT NULL,
    observation_vacation   varchar(200),
    vacation_isactive      boolean DEFAULT true NOT NULL,
    vacation_created_at    timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    vacation_updated_at    timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_vacation PRIMARY KEY (id_vacation),
    CONSTRAINT fk_vacations_employee FOREIGN KEY (id_employee) REFERENCES public.employee(id_employee),
    CONSTRAINT fk_vacations_submitted_by FOREIGN KEY (id_submitted_by) REFERENCES public."user"(id_user)
);

CREATE TABLE public.absence (
    id_absence           UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_employee          UUID NOT NULL,
    id_submitted_by      UUID NOT NULL,
    date_absence         timestamp NOT NULL,
    reason_absence       varchar(50) NOT NULL,
    absence_isactive     boolean DEFAULT true NOT NULL,
    absence_created_at   timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    absence_updated_at   timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_absence PRIMARY KEY (id_absence),
    CONSTRAINT fk_absence_employee FOREIGN KEY (id_employee) REFERENCES public.employee(id_employee),
    CONSTRAINT fk_absence_submitted_by FOREIGN KEY (id_submitted_by) REFERENCES public."user"(id_user)
);

CREATE TABLE public.license (
    id_license           UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_license_type      UUID NOT NULL,
    id_submitted_by      UUID NOT NULL,
    id_employee          UUID NOT NULL,
    start_date_license   timestamp NOT NULL,
    end_date_license     timestamp NOT NULL,
    observation_license  varchar(200),
    license_isactive     boolean DEFAULT true NOT NULL,
    license_created_at   timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    license_updated_at   timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_license PRIMARY KEY (id_license),
    CONSTRAINT fk_license_type FOREIGN KEY (id_license_type) REFERENCES public.license_type(id_license_type),
    CONSTRAINT fk_license_employee FOREIGN KEY (id_employee) REFERENCES public.employee(id_employee),
    CONSTRAINT fk_license_submitted_by FOREIGN KEY (id_submitted_by) REFERENCES public."user"(id_user)
);

CREATE UNIQUE INDEX unq_id_license ON public.license (id_license);

CREATE TABLE public.training (
    id_training          UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_training_type     UUID NOT NULL,
    id_employee          UUID NOT NULL,
    id_submitted_by      UUID NOT NULL,
    date_training        timestamp NOT NULL,
    reason_training      varchar(200),
    observation_training varchar(200),
    training_isactive    boolean DEFAULT true NOT NULL,
    training_created_at  timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    training_updated_at  timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_training PRIMARY KEY (id_training),
    CONSTRAINT fk_training_type FOREIGN KEY (id_training_type) REFERENCES public.training_type(id_training_type),
    CONSTRAINT fk_training_employee FOREIGN KEY (id_employee) REFERENCES public.employee(id_employee),
    CONSTRAINT fk_training_submitted_by FOREIGN KEY (id_submitted_by) REFERENCES public."user"(id_user)
);

CREATE UNIQUE INDEX unq_id_training ON public.training (id_training);

CREATE TABLE public.login (
    id_log               UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_user              UUID NOT NULL,
    ip_address           varchar(15) NOT NULL,
    user_agent           varchar(150) NOT NULL,
    log_created_at       timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_login PRIMARY KEY (id_log),
    CONSTRAINT fk_login_user FOREIGN KEY (id_user) REFERENCES public."user"(id_user)
);

CREATE TABLE public.notification_type (
    id_notification_type        UUID DEFAULT uuid_generate_v7() NOT NULL,
    title_notification          varchar(100) NOT NULL,
    start_hour                  char(5) NOT NULL,
    end_hour                    char(5) NOT NULL,
    description_notification    varchar(200) NOT NULL,
    can_modify                  boolean DEFAULT true NOT NULL,
    notification_type_isactive  boolean DEFAULT true NOT NULL ,
    CONSTRAINT pk_notification_type PRIMARY KEY (id_notification_type)
);

CREATE TABLE public.notification_allowed_role (
    id_notification_allowed_role        UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_notification_type                UUID NOT NULL,
    id_user_type                        UUID NOT NULL,
    notification_allowed_role_isactive   boolean DEFAULT true NOT NULL,
    CONSTRAINT pk_notification_allowed_role PRIMARY KEY (id_notification_allowed_role),
    CONSTRAINT fk_notification_type FOREIGN KEY (id_notification_type) REFERENCES public.notification_type(id_notification_type),
    CONSTRAINT fk_user_type FOREIGN KEY (id_user_type) REFERENCES public.user_type(id_user_type)
);

CREATE TABLE public.receiver_type (
    id_receiver_type        UUID DEFAULT uuid_generate_v7() NOT NULL,
    receiver_type           varchar(20) NOT NULL UNIQUE,
    receiver_type_isactive  boolean DEFAULT true NOT NULL,
    CONSTRAINT pk_receiver_type PRIMARY KEY (id_receiver_type)
);

CREATE TABLE public.notification (
    id_notification            UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_notification_type       UUID NOT NULL,
    id_sender                  UUID NOT NULL,
    message                    varchar(500) NOT NULL,
    notification_isactive      boolean DEFAULT true NOT NULL,
    notification_created_at    timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notification_updated_at    timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_notification PRIMARY KEY (id_notification),
    CONSTRAINT fk_notification_type FOREIGN KEY (id_notification_type) REFERENCES public.notification_type(id_notification_type),
    CONSTRAINT fk_sender FOREIGN KEY (id_sender) REFERENCES public."user"(id_user)
);

CREATE TABLE public.notification_receiver (
    id_notification_receiver            UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_notification                     UUID NOT NULL,
    id_receiver_type                    UUID NOT NULL,
    id_receiver                         UUID NOT NULL,
    has_read_notification               boolean DEFAULT false NOT NULL,
    time_read_notification              timestamp,
    notification_receiver_isactive      boolean DEFAULT true NOT NULL,
    CONSTRAINT pk_notification_receiver PRIMARY KEY (id_notification_receiver),
    CONSTRAINT fk_notification_receiver_notification FOREIGN KEY (id_notification) REFERENCES public.notification(id_notification),
    CONSTRAINT fk_notification_receiver_receiver_type FOREIGN KEY (id_receiver_type) REFERENCES public.receiver_type(id_receiver_type)
);

CREATE TABLE public.notification_area_receiver (
    id_notification_area_receiver        UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_notification                      UUID NOT NULL,
    id_area                              UUID NOT NULL,
    id_user                              UUID NOT NULL,
    has_read_notification                boolean DEFAULT false NOT NULL,
    time_read_notification               timestamp,
    notification_area_receiver_isactive  boolean DEFAULT true NOT NULL,
    CONSTRAINT pk_notification_area_receiver PRIMARY KEY (id_notification_area_receiver),
    CONSTRAINT fk_notification_area_receiver_notification FOREIGN KEY (id_notification) REFERENCES public.notification(id_notification),
    CONSTRAINT fk_notification_area_receiver_user FOREIGN KEY (id_user) REFERENCES public."user"(id_user),
    CONSTRAINT fk_notification_area_receiver_area FOREIGN KEY (id_area) REFERENCES public.area(id_area)
);

CREATE TABLE public.employee_doc (
    id_employee_doc               UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_employee                   UUID NOT NULL,
    id_submitted_by               UUID NOT NULL,
    employee_doc_url              varchar(250) NOT NULL,
    employee_doc_name             varchar(50) NOT NULL,
    employee_doc_isactive         boolean DEFAULT true NOT NULL,
    employee_doc_created_at       timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    employee_doc_updated_at       timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_employee_doc PRIMARY KEY (id_employee_doc),
    CONSTRAINT fk_employee_doc_employee FOREIGN KEY (id_employee) REFERENCES public.employee(id_employee),
    CONSTRAINT fk_user_submitted_by FOREIGN KEY (id_submitted_by) REFERENCES public."user"(id_user)
);

CREATE TABLE public.notification_doc (
    id_notification_doc               UUID DEFAULT uuid_generate_v7() NOT NULL,
    id_notification                   UUID NOT NULL,
    notification_doc_url              varchar(250) NOT NULL,
    notification_doc_name             varchar(250) NOT NULL,
    notification_doc_created_at       timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notification_doc_updated_at       timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_notification_doc PRIMARY KEY (id_notification_doc),
    CONSTRAINT fk_notification_doc_notification FOREIGN KEY (id_notification) REFERENCES public.notification(id_notification)
);

---------------------------------------------------------------
-- TRIGGERS
---------------------------------------------------------------

-- person updated_at trigger
CREATE OR REPLACE FUNCTION update_person_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.person_updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_person_updated_at
BEFORE UPDATE ON public.person
FOR EACH ROW
EXECUTE PROCEDURE update_person_updated_at();

-- employee_doc updated_at trigger
CREATE OR REPLACE FUNCTION update_employee_doc_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.employee_doc_updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employee_doc_updated_at
BEFORE UPDATE ON public.employee_doc
FOR EACH ROW
EXECUTE PROCEDURE update_employee_doc_updated_at();

-- phone updated_at trigger -> Should also update person_updated_at
CREATE OR REPLACE FUNCTION update_phone_updated_at()
RETURNS TRIGGER AS $$
BEGIN
-- Update person_updated_at that is related to this phone
    UPDATE public.person
    SET person_updated_at = now()
    WHERE id_person = (SELECT id_person FROM public.phone WHERE id_phone = NEW.id_phone);

    NEW.phone_updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_phone_updated_at
BEFORE UPDATE ON public.phone
FOR EACH ROW
EXECUTE PROCEDURE update_phone_updated_at();

-- address updated_at trigger
CREATE OR REPLACE FUNCTION update_address_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    -- Update person_updated_at that is related to this address
    UPDATE public.person
    SET person_updated_at = now()
    WHERE id_person = (SELECT id_person FROM public."address" WHERE id_address = NEW.id_address);

    NEW.address_updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_address_updated_at
BEFORE UPDATE ON public."address"
FOR EACH ROW
EXECUTE PROCEDURE update_address_updated_at();

-- family updated_at trigger
CREATE OR REPLACE FUNCTION update_family_member_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.family_member_updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_family_member_updated_at
BEFORE UPDATE ON public.family_member
FOR EACH ROW
EXECUTE PROCEDURE update_family_member_updated_at();

-- employee updated_at trigger
CREATE OR REPLACE FUNCTION update_employee_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.employee_updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employee_updated_at
BEFORE UPDATE ON public.employee
FOR EACH ROW
EXECUTE PROCEDURE update_employee_updated_at();

-- preoccupational_checkup updated_at trigger
CREATE OR REPLACE FUNCTION update_preoccupational_checkup_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.preoccupational_checkup_updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_preoccupational_checkup_updated_at
BEFORE UPDATE ON public.preoccupational_checkup
FOR EACH ROW
EXECUTE PROCEDURE update_preoccupational_checkup_updated_at();

-- user updated_at trigger
CREATE OR REPLACE FUNCTION update_user_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.user_updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_updated_at
BEFORE UPDATE ON public."user"
FOR EACH ROW
EXECUTE PROCEDURE update_user_updated_at();

-- formal_warning updated_at trigger
CREATE OR REPLACE FUNCTION update_formal_warning_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.formal_warning_updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_formal_warning_updated_at
BEFORE UPDATE ON public.formal_warning
FOR EACH ROW
EXECUTE PROCEDURE update_formal_warning_updated_at();

-- late_arrival updated_at trigger
CREATE OR REPLACE FUNCTION update_late_arrival_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.late_arrival_updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_late_arrival_updated_at
BEFORE UPDATE ON public.late_arrival
FOR EACH ROW
EXECUTE PROCEDURE update_late_arrival_updated_at();

-- vacation updated_at trigger
CREATE OR REPLACE FUNCTION update_vacation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.vacation_updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vacation_updated_at
BEFORE UPDATE ON public.vacation
FOR EACH ROW
EXECUTE PROCEDURE update_vacation_updated_at();

-- license updated_at trigger
CREATE OR REPLACE FUNCTION update_license_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.license_updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_license_updated_at
BEFORE UPDATE ON public.license
FOR EACH ROW
EXECUTE PROCEDURE update_license_updated_at();

-- absence updated_at trigger
CREATE OR REPLACE FUNCTION update_absence_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.absence_updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_absence_updated_at
BEFORE UPDATE ON public.absence
FOR EACH ROW
EXECUTE PROCEDURE update_absence_updated_at();

-- training updated_at trigger
CREATE OR REPLACE FUNCTION update_training_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.training_updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_training_updated_at
BEFORE UPDATE ON public.training
FOR EACH ROW
EXECUTE PROCEDURE update_training_updated_at();

-- extra_hours updated_at trigger
CREATE OR REPLACE FUNCTION update_extra_hours_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.extra_hours_updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_extra_hours_updated_at
BEFORE UPDATE ON public.extra_hours
FOR EACH ROW
EXECUTE PROCEDURE update_extra_hours_updated_at();

-- notification updated_at trigger
CREATE OR REPLACE FUNCTION update_notification_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.notification_updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notification_updated_at
BEFORE UPDATE ON public.notification
FOR EACH ROW
EXECUTE PROCEDURE update_notification_updated_at();

-- notification_doc updated_at trigger
CREATE OR REPLACE FUNCTION update_notification_doc_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.notification_doc_updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notification_doc_updated_at
BEFORE UPDATE ON public.notification_doc
FOR EACH ROW
EXECUTE PROCEDURE update_notification_doc_updated_at();

---------------------------------------------------------------
-- INSERT DEFAULT VALUES
---------------------------------------------------------------

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

INSERT INTO public.user_type (id_user_type, user_type, user_type_label) VALUES
  ('32deb906-6292-4908-9cfc-02394fd4ab28','admin', 'Administrador'),
  ('62ffb154-64a6-4b87-9486-3bb7b14a77f3','employee', 'Empleado'),
  ('5fc9c68b-34f3-45aa-ba54-9305515b8bcb','third_party', 'Solo Lectura');

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

INSERT INTO public.notification_type (id_notification_type,title_notification,start_hour,end_hour,description_notification,can_modify)
VALUES (
    '018d6192-a7fd-725a-b5a3-8f667a9a53eb',
    'Respuesta',
    '00:00',
    '23:59',
    'Tipo de notificación que permite responder a otra notificación enviada. Utilizarlo solo como respuesta, y no al crear una notificación desde cero.',
    FALSE
);

INSERT INTO public.notification_allowed_role (id_notification_allowed_role,id_notification_type,id_user_type)
VALUES 
    ('018d61a4-9f1e-7188-8d62-35a1d3399e22','018d6192-a7fd-725a-b5a3-8f667a9a53eb','32deb906-6292-4908-9cfc-02394fd4ab28'),
    ('018d61a4-9f1e-7188-8d62-35a1d3399e23','018d6192-a7fd-725a-b5a3-8f667a9a53eb','62ffb154-64a6-4b87-9486-3bb7b14a77f3');

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

INSERT INTO public.family_member (id_family_member, id_person, id_employee, id_relationship_type)
VALUES (
    '018d644d-08e5-746c-81fb-8d317e387126',
    '018d3b85-ad41-7129-b181-0f1fc7c71234',
    '018d3b85-ad41-7cca-94c9-0cf50325d9a4',
    '018d4131-99a7-7301-95f5-f1851f99af92'
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