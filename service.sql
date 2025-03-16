--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 17.0

-- Started on 2025-03-16 12:34:39

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: Admin
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO "Admin";

--
-- TOC entry 7 (class 2615 OID 57583)
-- Name: service; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA service;


ALTER SCHEMA service OWNER TO postgres;

--
-- TOC entry 6 (class 2615 OID 49456)
-- Name: user_vamtech20250120; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA user_vamtech20250120;


ALTER SCHEMA user_vamtech20250120 OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 212 (class 1259 OID 49393)
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    id integer NOT NULL,
    client_id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    organization character varying(255) NOT NULL,
    mobile character varying(15) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    logo character varying(255),
    db_name character varying(255) NOT NULL,
    db_user character varying(255) NOT NULL,
    db_password character varying(255) NOT NULL,
    db_host character varying(255) NOT NULL,
    db_port integer NOT NULL,
    registration_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    validity_till date,
    status integer,
    schema character varying(255),
    number_of_users integer
);


ALTER TABLE public.clients OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 49392)
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clients_id_seq OWNER TO postgres;

--
-- TOC entry 3524 (class 0 OID 0)
-- Dependencies: 211
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;


--
-- TOC entry 237 (class 1259 OID 57743)
-- Name: company; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company (
    company_id integer NOT NULL,
    company_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone_no character varying(20) NOT NULL,
    address character varying(255) NOT NULL,
    city character varying(50) NOT NULL,
    state character varying(50) NOT NULL,
    country character varying(50) NOT NULL,
    postal_code character varying(20) NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.company OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 57742)
-- Name: company_company_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.company_company_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.company_company_id_seq OWNER TO postgres;

--
-- TOC entry 3525 (class 0 OID 0)
-- Dependencies: 236
-- Name: company_company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.company_company_id_seq OWNED BY public.company.company_id;


--
-- TOC entry 214 (class 1259 OID 49419)
-- Name: reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reset_tokens (
    id bigint NOT NULL,
    user_id integer,
    token integer,
    dateadded timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    createdby integer
);


ALTER TABLE public.reset_tokens OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 49418)
-- Name: reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reset_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reset_tokens_id_seq OWNER TO postgres;

--
-- TOC entry 3526 (class 0 OID 0)
-- Dependencies: 213
-- Name: reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reset_tokens_id_seq OWNED BY public.reset_tokens.id;


--
-- TOC entry 215 (class 1259 OID 49426)
-- Name: schedules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedules (
    id bigint NOT NULL,
    schedule time without time zone
);


ALTER TABLE public.schedules OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 49432)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    userid integer NOT NULL,
    username character varying(255),
    email character varying(255),
    mobile character varying(20),
    role character varying(20),
    validityyn character(1),
    validtill date,
    password character varying(255),
    active character(1),
    datecreated timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    datemodified timestamp with time zone,
    datedeleted timestamp with time zone,
    createdby integer,
    updatedby integer,
    deletedby integer,
    email_verify_at timestamp without time zone,
    client_id character varying,
    company_id integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 49431)
-- Name: users_userid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_userid_seq OWNER TO postgres;

--
-- TOC entry 3527 (class 0 OID 0)
-- Dependencies: 216
-- Name: users_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_userid_seq OWNED BY public.users.userid;


--
-- TOC entry 243 (class 1259 OID 74040)
-- Name: expenses; Type: TABLE; Schema: service; Owner: postgres
--

CREATE TABLE service.expenses (
    expense_id integer NOT NULL,
    sr_id integer NOT NULL,
    expense_type character varying(1) NOT NULL,
    amount integer NOT NULL,
    attachments json,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer
);


ALTER TABLE service.expenses OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 74039)
-- Name: expenses_expense_id_seq; Type: SEQUENCE; Schema: service; Owner: postgres
--

CREATE SEQUENCE service.expenses_expense_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE service.expenses_expense_id_seq OWNER TO postgres;

--
-- TOC entry 3528 (class 0 OID 0)
-- Dependencies: 242
-- Name: expenses_expense_id_seq; Type: SEQUENCE OWNED BY; Schema: service; Owner: postgres
--

ALTER SEQUENCE service.expenses_expense_id_seq OWNED BY service.expenses.expense_id;


--
-- TOC entry 241 (class 1259 OID 65780)
-- Name: solution; Type: TABLE; Schema: service; Owner: postgres
--

CREATE TABLE service.solution (
    solution_id integer NOT NULL,
    sr_id integer NOT NULL,
    problem text,
    before_attachments json,
    after_attachments json,
    actions text,
    service_status character varying(1),
    status_remark text,
    responsibility integer,
    status_date timestamp with time zone,
    customer_acceptance boolean,
    customer_feedback text,
    created_by integer
);


ALTER TABLE service.solution OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 65779)
-- Name: solution_solution_id_seq; Type: SEQUENCE; Schema: service; Owner: postgres
--

CREATE SEQUENCE service.solution_solution_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE service.solution_solution_id_seq OWNER TO postgres;

--
-- TOC entry 3529 (class 0 OID 0)
-- Dependencies: 240
-- Name: solution_solution_id_seq; Type: SEQUENCE OWNED BY; Schema: service; Owner: postgres
--

ALTER SEQUENCE service.solution_solution_id_seq OWNED BY service.solution.solution_id;


--
-- TOC entry 239 (class 1259 OID 57758)
-- Name: ticket; Type: TABLE; Schema: service; Owner: postgres
--

CREATE TABLE service.ticket (
    sr_id integer NOT NULL,
    sr_date timestamp with time zone NOT NULL,
    sr_desc character varying(100) NOT NULL,
    machine character varying(100) NOT NULL,
    sr_status character varying(1) NOT NULL,
    priority character varying(1) NOT NULL,
    service_type character varying(1) NOT NULL,
    company_id integer NOT NULL,
    contact_person integer NOT NULL,
    mode_of_communication character varying(1) NOT NULL,
    reported_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by integer NOT NULL,
    assigned_to integer,
    assigned_by integer,
    assigned_date timestamp with time zone,
    plan_in_time timestamp with time zone,
    act_in_time timestamp with time zone,
    act_out_time timestamp with time zone,
    customer_in_time timestamp with time zone,
    customer_out_time timestamp with time zone,
    customer_comment text,
    customer_rating integer,
    expected_date timestamp with time zone
);


ALTER TABLE service.ticket OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 57757)
-- Name: ticket_sr_id_seq; Type: SEQUENCE; Schema: service; Owner: postgres
--

CREATE SEQUENCE service.ticket_sr_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE service.ticket_sr_id_seq OWNER TO postgres;

--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 238
-- Name: ticket_sr_id_seq; Type: SEQUENCE OWNED BY; Schema: service; Owner: postgres
--

ALTER SEQUENCE service.ticket_sr_id_seq OWNED BY service.ticket.sr_id;


--
-- TOC entry 219 (class 1259 OID 49458)
-- Name: campaigns; Type: TABLE; Schema: user_vamtech20250120; Owner: postgres
--

CREATE TABLE user_vamtech20250120.campaigns (
    id bigint NOT NULL,
    title character varying(255),
    type character varying(255),
    remarks text,
    message text,
    start_date date,
    end_date date,
    last_notify_date date,
    next_notify_date date,
    status integer,
    frequency character varying(100),
    year_num integer,
    month_num bigint[],
    week_num bigint[],
    day_name character varying(255)[],
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    date_modified timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_trigger timestamp without time zone,
    trigger_count integer DEFAULT 0,
    date_deleted timestamp with time zone,
    created_by bigint,
    updated_by bigint,
    deleted_by bigint,
    recurring character varying(50) NOT NULL,
    "time" time without time zone,
    contact_type character varying(100),
    contacts character varying[],
    cc character varying[],
    bcc character varying[],
    subject character varying(100),
    is_group smallint,
    is_resume smallint,
    day_num integer
);


ALTER TABLE user_vamtech20250120.campaigns OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 49457)
-- Name: campaigns_id_seq; Type: SEQUENCE; Schema: user_vamtech20250120; Owner: postgres
--

CREATE SEQUENCE user_vamtech20250120.campaigns_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE user_vamtech20250120.campaigns_id_seq OWNER TO postgres;

--
-- TOC entry 3531 (class 0 OID 0)
-- Dependencies: 218
-- Name: campaigns_id_seq; Type: SEQUENCE OWNED BY; Schema: user_vamtech20250120; Owner: postgres
--

ALTER SEQUENCE user_vamtech20250120.campaigns_id_seq OWNED BY user_vamtech20250120.campaigns.id;


--
-- TOC entry 221 (class 1259 OID 49470)
-- Name: campaigns_import_failures; Type: TABLE; Schema: user_vamtech20250120; Owner: postgres
--

CREATE TABLE user_vamtech20250120.campaigns_import_failures (
    id integer NOT NULL,
    created_by bigint NOT NULL,
    title character varying(255),
    type character varying(255),
    remarks text,
    message text,
    start_date date,
    status integer,
    frequency character varying(100),
    year_num integer,
    month_num bigint[],
    week_num bigint[],
    day_num bigint[],
    day_name character varying(255)[],
    recurring character varying(50) NOT NULL,
    contact_type character varying(100),
    contacts character varying[],
    cc character varying[],
    bcc character varying[],
    subject character varying(100),
    is_group smallint,
    validation_errors text NOT NULL,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE user_vamtech20250120.campaigns_import_failures OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 49469)
-- Name: campaigns_import_failures_id_seq; Type: SEQUENCE; Schema: user_vamtech20250120; Owner: postgres
--

CREATE SEQUENCE user_vamtech20250120.campaigns_import_failures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE user_vamtech20250120.campaigns_import_failures_id_seq OWNER TO postgres;

--
-- TOC entry 3532 (class 0 OID 0)
-- Dependencies: 220
-- Name: campaigns_import_failures_id_seq; Type: SEQUENCE OWNED BY; Schema: user_vamtech20250120; Owner: postgres
--

ALTER SEQUENCE user_vamtech20250120.campaigns_import_failures_id_seq OWNED BY user_vamtech20250120.campaigns_import_failures.id;


--
-- TOC entry 223 (class 1259 OID 49480)
-- Name: campaignstatuslogs; Type: TABLE; Schema: user_vamtech20250120; Owner: postgres
--

CREATE TABLE user_vamtech20250120.campaignstatuslogs (
    logid integer NOT NULL,
    campaignid integer,
    actiondate timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    actionstatus character varying(20),
    comment text
);


ALTER TABLE user_vamtech20250120.campaignstatuslogs OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 49479)
-- Name: campaignstatuslogs_logid_seq; Type: SEQUENCE; Schema: user_vamtech20250120; Owner: postgres
--

CREATE SEQUENCE user_vamtech20250120.campaignstatuslogs_logid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE user_vamtech20250120.campaignstatuslogs_logid_seq OWNER TO postgres;

--
-- TOC entry 3533 (class 0 OID 0)
-- Dependencies: 222
-- Name: campaignstatuslogs_logid_seq; Type: SEQUENCE OWNED BY; Schema: user_vamtech20250120; Owner: postgres
--

ALTER SEQUENCE user_vamtech20250120.campaignstatuslogs_logid_seq OWNED BY user_vamtech20250120.campaignstatuslogs.logid;


--
-- TOC entry 225 (class 1259 OID 49490)
-- Name: contacts; Type: TABLE; Schema: user_vamtech20250120; Owner: postgres
--

CREATE TABLE user_vamtech20250120.contacts (
    id integer NOT NULL,
    name character varying(255),
    type character varying(50),
    salutation character varying(255),
    organization character varying(255),
    job_title character varying(255),
    mobile1 character varying(20),
    mobile2 character varying(20),
    mobile3 character varying(20),
    sendmessages1 character(1),
    sendmessages2 character(1),
    sendmessages3 character(1),
    email1 character varying(255),
    email2 character varying(255),
    email3 character varying(255),
    status character(1),
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    date_modified timestamp with time zone,
    date_deleted timestamp with time zone,
    created_by integer,
    updated_by integer,
    deleted_by integer
);


ALTER TABLE user_vamtech20250120.contacts OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 49489)
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: user_vamtech20250120; Owner: postgres
--

CREATE SEQUENCE user_vamtech20250120.contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE user_vamtech20250120.contacts_id_seq OWNER TO postgres;

--
-- TOC entry 3534 (class 0 OID 0)
-- Dependencies: 224
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: user_vamtech20250120; Owner: postgres
--

ALTER SEQUENCE user_vamtech20250120.contacts_id_seq OWNED BY user_vamtech20250120.contacts.id;


--
-- TOC entry 227 (class 1259 OID 49500)
-- Name: contacts_import_failures; Type: TABLE; Schema: user_vamtech20250120; Owner: postgres
--

CREATE TABLE user_vamtech20250120.contacts_import_failures (
    id integer NOT NULL,
    name character varying(255),
    type character varying(50),
    salutation character varying(255),
    organization character varying(255),
    job_title character varying(255),
    mobile1 character varying(20),
    mobile2 character varying(20),
    mobile3 character varying(20),
    sendmessages1 character(1),
    sendmessages2 character(1),
    sendmessages3 character(1),
    email1 character varying(255),
    email2 character varying(255),
    email3 character varying(255),
    status character(1),
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    date_modified timestamp with time zone,
    date_deleted timestamp with time zone,
    created_by integer,
    updated_by integer,
    deleted_by integer,
    validation_errors text
);


ALTER TABLE user_vamtech20250120.contacts_import_failures OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 49499)
-- Name: contacts_import_failures_id_seq; Type: SEQUENCE; Schema: user_vamtech20250120; Owner: postgres
--

CREATE SEQUENCE user_vamtech20250120.contacts_import_failures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE user_vamtech20250120.contacts_import_failures_id_seq OWNER TO postgres;

--
-- TOC entry 3535 (class 0 OID 0)
-- Dependencies: 226
-- Name: contacts_import_failures_id_seq; Type: SEQUENCE OWNED BY; Schema: user_vamtech20250120; Owner: postgres
--

ALTER SEQUENCE user_vamtech20250120.contacts_import_failures_id_seq OWNED BY user_vamtech20250120.contacts_import_failures.id;


--
-- TOC entry 229 (class 1259 OID 49510)
-- Name: fileattachments; Type: TABLE; Schema: user_vamtech20250120; Owner: postgres
--

CREATE TABLE user_vamtech20250120.fileattachments (
    fileid integer NOT NULL,
    campaignid integer,
    filename character varying(255),
    filepath character varying(255),
    datecreated timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    datemodified timestamp with time zone,
    datedeleted timestamp with time zone,
    createdby integer,
    modifiedby integer,
    deletedby integer
);


ALTER TABLE user_vamtech20250120.fileattachments OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 49509)
-- Name: fileattachments_fileid_seq; Type: SEQUENCE; Schema: user_vamtech20250120; Owner: postgres
--

CREATE SEQUENCE user_vamtech20250120.fileattachments_fileid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE user_vamtech20250120.fileattachments_fileid_seq OWNER TO postgres;

--
-- TOC entry 3536 (class 0 OID 0)
-- Dependencies: 228
-- Name: fileattachments_fileid_seq; Type: SEQUENCE OWNED BY; Schema: user_vamtech20250120; Owner: postgres
--

ALTER SEQUENCE user_vamtech20250120.fileattachments_fileid_seq OWNED BY user_vamtech20250120.fileattachments.fileid;


--
-- TOC entry 231 (class 1259 OID 49520)
-- Name: files; Type: TABLE; Schema: user_vamtech20250120; Owner: postgres
--

CREATE TABLE user_vamtech20250120.files (
    id bigint NOT NULL,
    filename character varying(255),
    filepath character varying(255),
    filetype character varying(50),
    size bigint,
    datecreated timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    datemodified timestamp with time zone,
    datedeleted timestamp with time zone,
    createdby integer,
    modifiedby integer,
    deletedby integer
);


ALTER TABLE user_vamtech20250120.files OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 49519)
-- Name: files_id_seq; Type: SEQUENCE; Schema: user_vamtech20250120; Owner: postgres
--

CREATE SEQUENCE user_vamtech20250120.files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE user_vamtech20250120.files_id_seq OWNER TO postgres;

--
-- TOC entry 3537 (class 0 OID 0)
-- Dependencies: 230
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: user_vamtech20250120; Owner: postgres
--

ALTER SEQUENCE user_vamtech20250120.files_id_seq OWNED BY user_vamtech20250120.files.id;


--
-- TOC entry 235 (class 1259 OID 49549)
-- Name: mail_services; Type: TABLE; Schema: user_vamtech20250120; Owner: postgres
--

CREATE TABLE user_vamtech20250120.mail_services (
    id integer NOT NULL,
    user_id bigint,
    service text,
    host text,
    username text,
    password text,
    port text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    email_verified_at timestamp without time zone
);


ALTER TABLE user_vamtech20250120.mail_services OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 49548)
-- Name: mail_services_id_seq; Type: SEQUENCE; Schema: user_vamtech20250120; Owner: postgres
--

CREATE SEQUENCE user_vamtech20250120.mail_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE user_vamtech20250120.mail_services_id_seq OWNER TO postgres;

--
-- TOC entry 3538 (class 0 OID 0)
-- Dependencies: 234
-- Name: mail_services_id_seq; Type: SEQUENCE OWNED BY; Schema: user_vamtech20250120; Owner: postgres
--

ALTER SEQUENCE user_vamtech20250120.mail_services_id_seq OWNED BY user_vamtech20250120.mail_services.id;


--
-- TOC entry 233 (class 1259 OID 49530)
-- Name: user_salutation; Type: TABLE; Schema: user_vamtech20250120; Owner: postgres
--

CREATE TABLE user_vamtech20250120.user_salutation (
    id integer NOT NULL,
    salutation character varying(100),
    contact_id bigint,
    user_id bigint,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE user_vamtech20250120.user_salutation OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 49529)
-- Name: user_salutation_id_seq; Type: SEQUENCE; Schema: user_vamtech20250120; Owner: postgres
--

CREATE SEQUENCE user_vamtech20250120.user_salutation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE user_vamtech20250120.user_salutation_id_seq OWNER TO postgres;

--
-- TOC entry 3539 (class 0 OID 0)
-- Dependencies: 232
-- Name: user_salutation_id_seq; Type: SEQUENCE OWNED BY; Schema: user_vamtech20250120; Owner: postgres
--

ALTER SEQUENCE user_vamtech20250120.user_salutation_id_seq OWNED BY user_vamtech20250120.user_salutation.id;


--
-- TOC entry 3245 (class 2604 OID 49396)
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);


--
-- TOC entry 3273 (class 2604 OID 57746)
-- Name: company company_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company ALTER COLUMN company_id SET DEFAULT nextval('public.company_company_id_seq'::regclass);


--
-- TOC entry 3247 (class 2604 OID 49422)
-- Name: reset_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.reset_tokens_id_seq'::regclass);


--
-- TOC entry 3249 (class 2604 OID 49435)
-- Name: users userid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN userid SET DEFAULT nextval('public.users_userid_seq'::regclass);


--
-- TOC entry 3278 (class 2604 OID 74043)
-- Name: expenses expense_id; Type: DEFAULT; Schema: service; Owner: postgres
--

ALTER TABLE ONLY service.expenses ALTER COLUMN expense_id SET DEFAULT nextval('service.expenses_expense_id_seq'::regclass);


--
-- TOC entry 3277 (class 2604 OID 65783)
-- Name: solution solution_id; Type: DEFAULT; Schema: service; Owner: postgres
--

ALTER TABLE ONLY service.solution ALTER COLUMN solution_id SET DEFAULT nextval('service.solution_solution_id_seq'::regclass);


--
-- TOC entry 3275 (class 2604 OID 57761)
-- Name: ticket sr_id; Type: DEFAULT; Schema: service; Owner: postgres
--

ALTER TABLE ONLY service.ticket ALTER COLUMN sr_id SET DEFAULT nextval('service.ticket_sr_id_seq'::regclass);


--
-- TOC entry 3251 (class 2604 OID 49461)
-- Name: campaigns id; Type: DEFAULT; Schema: user_vamtech20250120; Owner: postgres
--

ALTER TABLE ONLY user_vamtech20250120.campaigns ALTER COLUMN id SET DEFAULT nextval('user_vamtech20250120.campaigns_id_seq'::regclass);


--
-- TOC entry 3255 (class 2604 OID 49473)
-- Name: campaigns_import_failures id; Type: DEFAULT; Schema: user_vamtech20250120; Owner: postgres
--

ALTER TABLE ONLY user_vamtech20250120.campaigns_import_failures ALTER COLUMN id SET DEFAULT nextval('user_vamtech20250120.campaigns_import_failures_id_seq'::regclass);


--
-- TOC entry 3257 (class 2604 OID 49483)
-- Name: campaignstatuslogs logid; Type: DEFAULT; Schema: user_vamtech20250120; Owner: postgres
--

ALTER TABLE ONLY user_vamtech20250120.campaignstatuslogs ALTER COLUMN logid SET DEFAULT nextval('user_vamtech20250120.campaignstatuslogs_logid_seq'::regclass);


--
-- TOC entry 3259 (class 2604 OID 49493)
-- Name: contacts id; Type: DEFAULT; Schema: user_vamtech20250120; Owner: postgres
--

ALTER TABLE ONLY user_vamtech20250120.contacts ALTER COLUMN id SET DEFAULT nextval('user_vamtech20250120.contacts_id_seq'::regclass);


--
-- TOC entry 3261 (class 2604 OID 49503)
-- Name: contacts_import_failures id; Type: DEFAULT; Schema: user_vamtech20250120; Owner: postgres
--

ALTER TABLE ONLY user_vamtech20250120.contacts_import_failures ALTER COLUMN id SET DEFAULT nextval('user_vamtech20250120.contacts_import_failures_id_seq'::regclass);


--
-- TOC entry 3263 (class 2604 OID 49513)
-- Name: fileattachments fileid; Type: DEFAULT; Schema: user_vamtech20250120; Owner: postgres
--

ALTER TABLE ONLY user_vamtech20250120.fileattachments ALTER COLUMN fileid SET DEFAULT nextval('user_vamtech20250120.fileattachments_fileid_seq'::regclass);


--
-- TOC entry 3265 (class 2604 OID 49523)
-- Name: files id; Type: DEFAULT; Schema: user_vamtech20250120; Owner: postgres
--

ALTER TABLE ONLY user_vamtech20250120.files ALTER COLUMN id SET DEFAULT nextval('user_vamtech20250120.files_id_seq'::regclass);


--
-- TOC entry 3270 (class 2604 OID 49552)
-- Name: mail_services id; Type: DEFAULT; Schema: user_vamtech20250120; Owner: postgres
--

ALTER TABLE ONLY user_vamtech20250120.mail_services ALTER COLUMN id SET DEFAULT nextval('user_vamtech20250120.mail_services_id_seq'::regclass);


--
-- TOC entry 3267 (class 2604 OID 49533)
-- Name: user_salutation id; Type: DEFAULT; Schema: user_vamtech20250120; Owner: postgres
--

ALTER TABLE ONLY user_vamtech20250120.user_salutation ALTER COLUMN id SET DEFAULT nextval('user_vamtech20250120.user_salutation_id_seq'::regclass);


--
-- TOC entry 3486 (class 0 OID 49393)
-- Dependencies: 212
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clients (id, client_id, name, organization, mobile, email, password, logo, db_name, db_user, db_password, db_host, db_port, registration_date, created_at, validity_till, status, schema, number_of_users) FROM stdin;
1	vamtech20250120	MADHANKUMAR	Vamtech	8838309848	madhanperumal1908@gmail.com	$2b$05$nTI9sgaktRREynNIvAnt1u34XfqKRyPiWS3sccRV3I4U4Rsbkl9J6	\N	user_vamtech20250120	user_vamtech20250120	user_vamtech20250120	localhost	5432	\N	2025-01-20 11:14:30.992581	\N	1	user_vamtech20250120	20
\.


--
-- TOC entry 3511 (class 0 OID 57743)
-- Dependencies: 237
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company (company_id, company_name, email, phone_no, address, city, state, country, postal_code, created_by, created_at) FROM stdin;
1	Nova Tech	novatech@gmail.com	9876012345	No:123,12th street ,SS nagar	Chennai	TamilNadu	India	600047	2	2025-02-06 14:57:28.865871
2	AvaSoft	avasoft@gmail.com	9876543210	No: 34, 13th street, SRK Nagar	Chennai	Tamil Nadu	India	600049	2	2025-02-06 15:00:37.661845
\.


--
-- TOC entry 3488 (class 0 OID 49419)
-- Dependencies: 214
-- Data for Name: reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reset_tokens (id, user_id, token, dateadded, createdby) FROM stdin;
\.


--
-- TOC entry 3489 (class 0 OID 49426)
-- Dependencies: 215
-- Data for Name: schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedules (id, schedule) FROM stdin;
\.


--
-- TOC entry 3491 (class 0 OID 49432)
-- Dependencies: 217
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (userid, username, email, mobile, role, validityyn, validtill, password, active, datecreated, datemodified, datedeleted, createdby, updatedby, deletedby, email_verify_at, client_id, company_id) FROM stdin;
1	Madhan	mkmadhan1908@gmail.com	8892822822	Admin	N	\N	$2b$05$MjrxnafFjdyISb66WSqxsOdYLwHT5spDEx0QNg1p6T8RWpXLwJKdK	1	2025-01-20 09:38:57.20458+05:30	\N	\N	\N	\N	\N	\N	\N	\N
2	ADMIN 1	admin1@gmail.com	8838309848	Admin	N	\N	$2b$05$f0S4KOiawpi41r0pJ.3mluCvggbxAc7aJz7zw1H/xpLtsTm89RGzC	1	2025-01-20 11:14:31.108+05:30	\N	\N	\N	\N	\N	\N	vamtech20250120	\N
10	ADMIN 2	admin2@gmail.com	9876543210	Admin	N	\N	$2b$05$qWCCqqKZyS/cVIX/KYmieOIq/r0IECHMj4bi0tBd4K6RizDj7Qv0q	1	2025-02-28 19:11:32.022+05:30	\N	\N	\N	\N	\N	\N	vamtech20250120	0
11	MANAGER 1	manager1@gmail.com	9876543201	Manager	N	\N	$2b$05$RwrQgFqXKimsy.FG03K7weF47mW.2VzFa54xTRQbAjz6Sla7Fo.z.	1	2025-02-28 19:12:36.673+05:30	\N	\N	\N	\N	\N	\N	vamtech20250120	0
12	MANAGER 2	manager2@gmail.com	9876543120	Manager	N	\N	$2b$05$G6LgFX.Ojs0FqVwzlkJcxObfLmypNM7vYhSGaNg6f/hCcNDM42YXK	1	2025-02-28 19:13:31.752+05:30	\N	\N	\N	\N	\N	\N	vamtech20250120	0
13	MANAGER 3	manager3@gmail.com	9876543021	Manager	N	\N	$2b$05$1/gRfg4.t3AOUUIrVZZZYuyWQNWf7o22m2aaCshKrT4X.IHXhR5Ke	1	2025-02-28 19:15:10.081+05:30	\N	\N	\N	\N	\N	\N	vamtech20250120	0
14	EMPLOYEE 1	employee1@gmail.com	9876534210	Employee	N	\N	$2b$05$WDvCoURDmlaSVFYLe2hzF.SNNTlJUx0nH77LPgDanpXItMHvURwp.	1	2025-02-28 19:16:01.446+05:30	\N	\N	\N	\N	\N	\N	vamtech20250120	0
15	EMPLOYEE 2	employee2@gmail.com	9876543102	Employee	N	\N	$2b$05$Ntpn7lO88uvraIWtZvKtb.Z6r4AWyIj5xj8JVpaGl/zOjXmdIzPHu	1	2025-02-28 19:16:47.757+05:30	\N	\N	\N	\N	\N	\N	vamtech20250120	0
16	EMPLOYEE 3	employee3@gmail.com	9876453210	Employee	N	\N	$2b$05$K1fq0gqfOOguCa5KeCz2f.V/ld3vdVbZbErnXwt8NYhhNs.lT6yGa	1	2025-02-28 19:17:35.775+05:30	\N	\N	\N	\N	\N	\N	vamtech20250120	0
17	EMPLOYEE 4	employee4@gmail.com	9876452310	Employee	N	\N	$2b$05$zUwvmzRMKCE9IShGuw7Xwu1XGgxbvV7rJAPagWbOi34OP.D8t7sEy	1	2025-02-28 19:18:49.259+05:30	\N	\N	\N	\N	\N	\N	vamtech20250120	0
18	EMPLOYEE 5	employee5@gmail.com	9875643210	Employee	N	\N	$2b$05$VdY/9wRITZtNaDuHGLZiTueup8FGZiPmUxmHq40ngpvKjsXinlC7O	1	2025-02-28 19:21:09.204+05:30	\N	\N	\N	\N	\N	\N	vamtech20250120	0
20	CUSTOMER 2	customer2@gmail.com	9876534120	Customer	N	\N	$2b$05$1CuZGYKWd5UD5OpA3/y5D.2U/cLrukqij9XHNVOJD3tMlugQJbGTe	1	2025-02-28 19:23:46.545+05:30	\N	\N	\N	\N	\N	\N	vamtech20250120	1
21	CUSTOMER 3	customer3@gmail.com	9087654321	Customer	N	\N	$2b$05$QeWKKMAfGShWW.b.a3vYOu3Ollichhho00SKQrxsvtRqh5rrQXQ/W	1	2025-02-28 19:25:34.013+05:30	\N	\N	\N	\N	\N	\N	vamtech20250120	2
19	CUSTOMER 1	customer1@gmail.com	9867543210	Customer	N	\N	$2b$05$2HcHx4bWFW9ZMEOHFA3Oue2UExNCsl5WhrnAR4pipFzMBdc68CaSa	1	2025-02-28 19:22:44.306+05:30	\N	\N	\N	\N	\N	\N	vamtech20250120	1
22	CUSTOMER 4	customer4@gmail.com	9807654321	Customer	N	\N	$2b$05$d.Y9LCRly5Ds7ALSk0zXJOOAg0.P6zcJu1W774olHQj6mSh5z2XeO	1	2025-02-28 19:26:44.55+05:30	\N	\N	\N	\N	\N	\N	vamtech20250120	2
\.


--
-- TOC entry 3517 (class 0 OID 74040)
-- Dependencies: 243
-- Data for Name: expenses; Type: TABLE DATA; Schema: service; Owner: postgres
--

COPY service.expenses (expense_id, sr_id, expense_type, amount, attachments, created_at, created_by) FROM stdin;
1	75	F	100	["/uploads/1741793820943-Screenshot (7).png"]	2025-03-12 21:07:01.221362	2
\.


--
-- TOC entry 3515 (class 0 OID 65780)
-- Dependencies: 241
-- Data for Name: solution; Type: TABLE DATA; Schema: service; Owner: postgres
--

COPY service.solution (solution_id, sr_id, problem, before_attachments, after_attachments, actions, service_status, status_remark, responsibility, status_date, customer_acceptance, customer_feedback, created_by) FROM stdin;
2	68	Error1	["/uploads/1740752015132-Screenshot (8).png","/uploads/1740752015145-Screenshot (9).png"]	\N	\N	\N	\N	\N	\N	\N	\N	2
3	69	Error 12	["/uploads/1740752119546-Screenshot (8).png"]	\N	\N	\N	\N	\N	\N	\N	\N	2
4	70	Error 25/6	["/uploads/1740752263575-Screenshot (9).png"]	["/uploads/1740752608192-Screenshot (15).png"]	actions taken for solving the error	C	  dg vb fyhyhfc fg	\N	2025-03-01 00:00:00+05:30	t	good	2
5	70	Error 234f4	\N	\N	vcvtthyh	C	vfbgyhyj fggghhy	\N	2025-03-01 00:00:00+05:30	t	all right	15
6	71	Error1	["/uploads/1740811820872-Screenshot (7).png"]	\N	\N	\N	\N	\N	\N	\N	\N	2
8	73	Error innkdjfgg	["/uploads/1740812881379-Screenshot (60).png"]	\N	jhhjhjhj	\N	\N	\N	\N	\N	\N	2
11	73	kjhh	["/uploads/1740826360271-Screenshot (6).png"]	\N	\N	P	\N	\N	\N	\N	\N	2
13	75	problem1	["/uploads/1740842098241-Screenshot (7).png"]	["/uploads/1740842121944-Screenshot (1).png"]	Action taken	C	all are solved	\N	2025-02-25 00:00:00+05:30	t	ok	2
1	67	problem123	["/uploads/1740751484565-Screenshot (67).png"]	\N	jbjsdj	\N	\N	\N	\N	\N	\N	2
\.


--
-- TOC entry 3513 (class 0 OID 57758)
-- Dependencies: 239
-- Data for Name: ticket; Type: TABLE DATA; Schema: service; Owner: postgres
--

COPY service.ticket (sr_id, sr_date, sr_desc, machine, sr_status, priority, service_type, company_id, contact_person, mode_of_communication, reported_date, created_by, assigned_to, assigned_by, assigned_date, plan_in_time, act_in_time, act_out_time, customer_in_time, customer_out_time, customer_comment, customer_rating, expected_date) FROM stdin;
67	2025-02-21 18:30:00+05:30	Problem1	m001	X	M	W	1	20	C	2025-02-28 19:34:44.474	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-28 00:00:00+05:30
68	2025-02-21 18:30:00+05:30	Problem2	m002	X	H	B	1	19	W	2025-02-28 19:43:35.049	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-02-28 00:00:00+05:30
69	2025-02-22 18:30:00+05:30	Problem3	m003	X	H	W	2	21	S	2025-02-28 19:45:19.473	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-01 00:00:00+05:30
70	2025-02-23 18:30:00+05:30	Problem4	mo04	Z	L	M	2	22	E	2025-02-28 19:47:43.507	2	15	11	2025-02-28 19:49:10.797+05:30	2025-02-24 12:30:00+05:30	2025-02-28 19:52:34.271+05:30	2025-02-28 19:58:29.532+05:30	2025-02-28 19:45:00+05:30	2025-02-28 20:45:00+05:30	good service	4	2025-03-04 00:00:00+05:30
71	2025-02-21 18:30:00+05:30	Problem5	m00055	X	M	B	1	20	S	2025-03-01 12:20:20.784	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-04 00:00:00+05:30
72	2025-02-22 00:00:00+05:30	Problem123	m0034	X	L	W	2	21	W	2025-03-01 12:30:18.722	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-27 00:00:00+05:30
73	2025-02-26 00:00:00+05:30	Problem  1234	m01234	W	M	M	2	22	W	2025-03-01 12:38:01.348	2	\N	\N	\N	\N	2025-03-01 15:10:44.525+05:30	\N	\N	\N	\N	\N	2025-03-26 00:00:00+05:30
74	2025-02-27 00:00:00+05:30	sr12	m0987	X	M	M	2	21	W	2025-03-01 17:35:39.689	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-03-20 00:00:00+05:30
75	2025-02-24 00:00:00+05:30	sr123	m0234	Y	H	M	1	20	W	2025-03-01 20:44:16.391	2	16	10	2025-02-24 10:00:00+05:30	2025-02-25 10:00:00+05:30	2025-02-25 10:00:00+05:30	2025-02-25 11:00:00+05:30	2025-02-25 10:00:00+05:30	2025-02-25 11:00:00+05:30	good Service	4	2025-03-03 00:00:00+05:30
\.


--
-- TOC entry 3493 (class 0 OID 49458)
-- Dependencies: 219
-- Data for Name: campaigns; Type: TABLE DATA; Schema: user_vamtech20250120; Owner: postgres
--

COPY user_vamtech20250120.campaigns (id, title, type, remarks, message, start_date, end_date, last_notify_date, next_notify_date, status, frequency, year_num, month_num, week_num, day_name, date_created, date_modified, last_trigger, trigger_count, date_deleted, created_by, updated_by, deleted_by, recurring, "time", contact_type, contacts, cc, bcc, subject, is_group, is_resume, day_num) FROM stdin;
\.


--
-- TOC entry 3495 (class 0 OID 49470)
-- Dependencies: 221
-- Data for Name: campaigns_import_failures; Type: TABLE DATA; Schema: user_vamtech20250120; Owner: postgres
--

COPY user_vamtech20250120.campaigns_import_failures (id, created_by, title, type, remarks, message, start_date, status, frequency, year_num, month_num, week_num, day_num, day_name, recurring, contact_type, contacts, cc, bcc, subject, is_group, validation_errors, date_created) FROM stdin;
\.


--
-- TOC entry 3497 (class 0 OID 49480)
-- Dependencies: 223
-- Data for Name: campaignstatuslogs; Type: TABLE DATA; Schema: user_vamtech20250120; Owner: postgres
--

COPY user_vamtech20250120.campaignstatuslogs (logid, campaignid, actiondate, actionstatus, comment) FROM stdin;
\.


--
-- TOC entry 3499 (class 0 OID 49490)
-- Dependencies: 225
-- Data for Name: contacts; Type: TABLE DATA; Schema: user_vamtech20250120; Owner: postgres
--

COPY user_vamtech20250120.contacts (id, name, type, salutation, organization, job_title, mobile1, mobile2, mobile3, sendmessages1, sendmessages2, sendmessages3, email1, email2, email3, status, date_created, date_modified, date_deleted, created_by, updated_by, deleted_by) FROM stdin;
\.


--
-- TOC entry 3501 (class 0 OID 49500)
-- Dependencies: 227
-- Data for Name: contacts_import_failures; Type: TABLE DATA; Schema: user_vamtech20250120; Owner: postgres
--

COPY user_vamtech20250120.contacts_import_failures (id, name, type, salutation, organization, job_title, mobile1, mobile2, mobile3, sendmessages1, sendmessages2, sendmessages3, email1, email2, email3, status, date_created, date_modified, date_deleted, created_by, updated_by, deleted_by, validation_errors) FROM stdin;
\.


--
-- TOC entry 3503 (class 0 OID 49510)
-- Dependencies: 229
-- Data for Name: fileattachments; Type: TABLE DATA; Schema: user_vamtech20250120; Owner: postgres
--

COPY user_vamtech20250120.fileattachments (fileid, campaignid, filename, filepath, datecreated, datemodified, datedeleted, createdby, modifiedby, deletedby) FROM stdin;
\.


--
-- TOC entry 3505 (class 0 OID 49520)
-- Dependencies: 231
-- Data for Name: files; Type: TABLE DATA; Schema: user_vamtech20250120; Owner: postgres
--

COPY user_vamtech20250120.files (id, filename, filepath, filetype, size, datecreated, datemodified, datedeleted, createdby, modifiedby, deletedby) FROM stdin;
\.


--
-- TOC entry 3509 (class 0 OID 49549)
-- Dependencies: 235
-- Data for Name: mail_services; Type: TABLE DATA; Schema: user_vamtech20250120; Owner: postgres
--

COPY user_vamtech20250120.mail_services (id, user_id, service, host, username, password, port, created_at, updated_at, email_verified_at) FROM stdin;
\.


--
-- TOC entry 3507 (class 0 OID 49530)
-- Dependencies: 233
-- Data for Name: user_salutation; Type: TABLE DATA; Schema: user_vamtech20250120; Owner: postgres
--

COPY user_vamtech20250120.user_salutation (id, salutation, contact_id, user_id, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3540 (class 0 OID 0)
-- Dependencies: 211
-- Name: clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clients_id_seq', 1, true);


--
-- TOC entry 3541 (class 0 OID 0)
-- Dependencies: 236
-- Name: company_company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.company_company_id_seq', 2, true);


--
-- TOC entry 3542 (class 0 OID 0)
-- Dependencies: 213
-- Name: reset_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reset_tokens_id_seq', 1, false);


--
-- TOC entry 3543 (class 0 OID 0)
-- Dependencies: 216
-- Name: users_userid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_userid_seq', 22, true);


--
-- TOC entry 3544 (class 0 OID 0)
-- Dependencies: 242
-- Name: expenses_expense_id_seq; Type: SEQUENCE SET; Schema: service; Owner: postgres
--

SELECT pg_catalog.setval('service.expenses_expense_id_seq', 1, true);


--
-- TOC entry 3545 (class 0 OID 0)
-- Dependencies: 240
-- Name: solution_solution_id_seq; Type: SEQUENCE SET; Schema: service; Owner: postgres
--

SELECT pg_catalog.setval('service.solution_solution_id_seq', 13, true);


--
-- TOC entry 3546 (class 0 OID 0)
-- Dependencies: 238
-- Name: ticket_sr_id_seq; Type: SEQUENCE SET; Schema: service; Owner: postgres
--

SELECT pg_catalog.setval('service.ticket_sr_id_seq', 76, true);


--
-- TOC entry 3547 (class 0 OID 0)
-- Dependencies: 218
-- Name: campaigns_id_seq; Type: SEQUENCE SET; Schema: user_vamtech20250120; Owner: postgres
--

SELECT pg_catalog.setval('user_vamtech20250120.campaigns_id_seq', 1, false);


--
-- TOC entry 3548 (class 0 OID 0)
-- Dependencies: 220
-- Name: campaigns_import_failures_id_seq; Type: SEQUENCE SET; Schema: user_vamtech20250120; Owner: postgres
--

SELECT pg_catalog.setval('user_vamtech20250120.campaigns_import_failures_id_seq', 1, false);


--
-- TOC entry 3549 (class 0 OID 0)
-- Dependencies: 222
-- Name: campaignstatuslogs_logid_seq; Type: SEQUENCE SET; Schema: user_vamtech20250120; Owner: postgres
--

SELECT pg_catalog.setval('user_vamtech20250120.campaignstatuslogs_logid_seq', 1, false);


--
-- TOC entry 3550 (class 0 OID 0)
-- Dependencies: 224
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: user_vamtech20250120; Owner: postgres
--

SELECT pg_catalog.setval('user_vamtech20250120.contacts_id_seq', 1, false);


--
-- TOC entry 3551 (class 0 OID 0)
-- Dependencies: 226
-- Name: contacts_import_failures_id_seq; Type: SEQUENCE SET; Schema: user_vamtech20250120; Owner: postgres
--

SELECT pg_catalog.setval('user_vamtech20250120.contacts_import_failures_id_seq', 1, false);


--
-- TOC entry 3552 (class 0 OID 0)
-- Dependencies: 228
-- Name: fileattachments_fileid_seq; Type: SEQUENCE SET; Schema: user_vamtech20250120; Owner: postgres
--

SELECT pg_catalog.setval('user_vamtech20250120.fileattachments_fileid_seq', 1, false);


--
-- TOC entry 3553 (class 0 OID 0)
-- Dependencies: 230
-- Name: files_id_seq; Type: SEQUENCE SET; Schema: user_vamtech20250120; Owner: postgres
--

SELECT pg_catalog.setval('user_vamtech20250120.files_id_seq', 1, false);


--
-- TOC entry 3554 (class 0 OID 0)
-- Dependencies: 234
-- Name: mail_services_id_seq; Type: SEQUENCE SET; Schema: user_vamtech20250120; Owner: postgres
--

SELECT pg_catalog.setval('user_vamtech20250120.mail_services_id_seq', 1, false);


--
-- TOC entry 3555 (class 0 OID 0)
-- Dependencies: 232
-- Name: user_salutation_id_seq; Type: SEQUENCE SET; Schema: user_vamtech20250120; Owner: postgres
--

SELECT pg_catalog.setval('user_vamtech20250120.user_salutation_id_seq', 1, false);


--
-- TOC entry 3281 (class 2606 OID 49403)
-- Name: clients clients_client_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_client_id_key UNIQUE (client_id);


--
-- TOC entry 3283 (class 2606 OID 49405)
-- Name: clients clients_db_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_db_name_key UNIQUE (db_name);


--
-- TOC entry 3285 (class 2606 OID 49407)
-- Name: clients clients_db_password_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_db_password_key UNIQUE (db_password);


--
-- TOC entry 3287 (class 2606 OID 49409)
-- Name: clients clients_db_user_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_db_user_key UNIQUE (db_user);


--
-- TOC entry 3289 (class 2606 OID 49411)
-- Name: clients clients_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key UNIQUE (email);


--
-- TOC entry 3291 (class 2606 OID 49413)
-- Name: clients clients_mobile_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_mobile_key UNIQUE (mobile);


--
-- TOC entry 3293 (class 2606 OID 49415)
-- Name: clients clients_name_email_mobile_client_id_db_name_db_user_db_pass_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_name_email_mobile_client_id_db_name_db_user_db_pass_key UNIQUE (name, email, mobile, client_id, db_name, db_user, db_password);


--
-- TOC entry 3295 (class 2606 OID 49417)
-- Name: clients clients_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_name_key UNIQUE (name);


--
-- TOC entry 3297 (class 2606 OID 49401)
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- TOC entry 3323 (class 2606 OID 57751)
-- Name: company company_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_pkey PRIMARY KEY (company_id);


--
-- TOC entry 3299 (class 2606 OID 49425)
-- Name: reset_tokens contactsincampaign_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reset_tokens
    ADD CONSTRAINT contactsincampaign_pkey PRIMARY KEY (id);


--
-- TOC entry 3301 (class 2606 OID 49430)
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- TOC entry 3303 (class 2606 OID 49440)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- TOC entry 3329 (class 2606 OID 74048)
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: service; Owner: postgres
--

ALTER TABLE ONLY service.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (expense_id);


--
-- TOC entry 3327 (class 2606 OID 65787)
-- Name: solution solution_pkey; Type: CONSTRAINT; Schema: service; Owner: postgres
--

ALTER TABLE ONLY service.solution
    ADD CONSTRAINT solution_pkey PRIMARY KEY (solution_id);


--
-- TOC entry 3325 (class 2606 OID 57765)
-- Name: ticket ticket_pkey; Type: CONSTRAINT; Schema: service; Owner: postgres
--

ALTER TABLE ONLY service.ticket
    ADD CONSTRAINT ticket_pkey PRIMARY KEY (sr_id);


--
-- TOC entry 3307 (class 2606 OID 49478)
-- Name: campaigns_import_failures campaigns_import_failures_pkey; Type: CONSTRAINT; Schema: user_vamtech20250120; Owner: postgres
--

ALTER TABLE ONLY user_vamtech20250120.campaigns_import_failures
    ADD CONSTRAINT campaigns_import_failures_pkey PRIMARY KEY (id);


--
-- TOC entry 3305 (class 2606 OID 49468)
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: user_vamtech20250120; Owner: postgres
--

ALTER TABLE ONLY user_vamtech20250120.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- TOC entry 3309 (class 2606 OID 49488)
-- Name: campaignstatuslogs campaignstatuslogs_pkey; Type: CONSTRAINT; Schema: user_vamtech20250120; Owner: postgres
--

ALTER TABLE ONLY user_vamtech20250120.campaignstatuslogs
    ADD CONSTRAINT campaignstatuslogs_pkey PRIMARY KEY (logid);


--
-- TOC entry 3313 (class 2606 OID 49508)
-- Name: contacts_import_failures contacts_import_failures_pkey; Type: CONSTRAINT; Schema: user_vamtech20250120; Owner: postgres
--

ALTER TABLE ONLY user_vamtech20250120.contacts_import_failures
    ADD CONSTRAINT contacts_import_failures_pkey PRIMARY KEY (id);


--
-- TOC entry 3311 (class 2606 OID 49498)
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: user_vamtech20250120; Owner: postgres
--

ALTER TABLE ONLY user_vamtech20250120.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- TOC entry 3315 (class 2606 OID 49518)
-- Name: fileattachments fileattachments_pkey; Type: CONSTRAINT; Schema: user_vamtech20250120; Owner: postgres
--

ALTER TABLE ONLY user_vamtech20250120.fileattachments
    ADD CONSTRAINT fileattachments_pkey PRIMARY KEY (fileid);


--
-- TOC entry 3317 (class 2606 OID 49528)
-- Name: files files_pkey; Type: CONSTRAINT; Schema: user_vamtech20250120; Owner: postgres
--

ALTER TABLE ONLY user_vamtech20250120.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- TOC entry 3321 (class 2606 OID 49558)
-- Name: mail_services mail_services_pkey; Type: CONSTRAINT; Schema: user_vamtech20250120; Owner: postgres
--

ALTER TABLE ONLY user_vamtech20250120.mail_services
    ADD CONSTRAINT mail_services_pkey PRIMARY KEY (id);


--
-- TOC entry 3319 (class 2606 OID 49537)
-- Name: user_salutation user_salutation_pkey; Type: CONSTRAINT; Schema: user_vamtech20250120; Owner: postgres
--

ALTER TABLE ONLY user_vamtech20250120.user_salutation
    ADD CONSTRAINT user_salutation_pkey PRIMARY KEY (id);


--
-- TOC entry 3335 (class 2606 OID 57752)
-- Name: company company_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(userid);


--
-- TOC entry 3330 (class 2606 OID 49441)
-- Name: users users_createdby_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_createdby_fkey FOREIGN KEY (createdby) REFERENCES public.users(userid);


--
-- TOC entry 3331 (class 2606 OID 49446)
-- Name: users users_deletedby_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_deletedby_fkey FOREIGN KEY (deletedby) REFERENCES public.users(userid);


--
-- TOC entry 3332 (class 2606 OID 49451)
-- Name: users users_updatedby_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_updatedby_fkey FOREIGN KEY (updatedby) REFERENCES public.users(userid);


--
-- TOC entry 3344 (class 2606 OID 74054)
-- Name: expenses expenses_created_by_fkey; Type: FK CONSTRAINT; Schema: service; Owner: postgres
--

ALTER TABLE ONLY service.expenses
    ADD CONSTRAINT expenses_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(userid);


--
-- TOC entry 3345 (class 2606 OID 74049)
-- Name: expenses expenses_sr_id_fkey; Type: FK CONSTRAINT; Schema: service; Owner: postgres
--

ALTER TABLE ONLY service.expenses
    ADD CONSTRAINT expenses_sr_id_fkey FOREIGN KEY (sr_id) REFERENCES service.ticket(sr_id);


--
-- TOC entry 3341 (class 2606 OID 65798)
-- Name: solution solution_created_by_fkey; Type: FK CONSTRAINT; Schema: service; Owner: postgres
--

ALTER TABLE ONLY service.solution
    ADD CONSTRAINT solution_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(userid);


--
-- TOC entry 3342 (class 2606 OID 65793)
-- Name: solution solution_responsibility_fkey; Type: FK CONSTRAINT; Schema: service; Owner: postgres
--

ALTER TABLE ONLY service.solution
    ADD CONSTRAINT solution_responsibility_fkey FOREIGN KEY (responsibility) REFERENCES public.users(userid);


--
-- TOC entry 3343 (class 2606 OID 65788)
-- Name: solution solution_sr_id_fkey; Type: FK CONSTRAINT; Schema: service; Owner: postgres
--

ALTER TABLE ONLY service.solution
    ADD CONSTRAINT solution_sr_id_fkey FOREIGN KEY (sr_id) REFERENCES service.ticket(sr_id);


--
-- TOC entry 3336 (class 2606 OID 57786)
-- Name: ticket ticket_assigned_by_fkey; Type: FK CONSTRAINT; Schema: service; Owner: postgres
--

ALTER TABLE ONLY service.ticket
    ADD CONSTRAINT ticket_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(userid);


--
-- TOC entry 3337 (class 2606 OID 57781)
-- Name: ticket ticket_assigned_to_fkey; Type: FK CONSTRAINT; Schema: service; Owner: postgres
--

ALTER TABLE ONLY service.ticket
    ADD CONSTRAINT ticket_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(userid);


--
-- TOC entry 3338 (class 2606 OID 57766)
-- Name: ticket ticket_company_id_fkey; Type: FK CONSTRAINT; Schema: service; Owner: postgres
--

ALTER TABLE ONLY service.ticket
    ADD CONSTRAINT ticket_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(company_id);


--
-- TOC entry 3339 (class 2606 OID 57771)
-- Name: ticket ticket_contact_person_fkey; Type: FK CONSTRAINT; Schema: service; Owner: postgres
--

ALTER TABLE ONLY service.ticket
    ADD CONSTRAINT ticket_contact_person_fkey FOREIGN KEY (contact_person) REFERENCES public.users(userid);


--
-- TOC entry 3340 (class 2606 OID 57776)
-- Name: ticket ticket_created_by_fkey; Type: FK CONSTRAINT; Schema: service; Owner: postgres
--

ALTER TABLE ONLY service.ticket
    ADD CONSTRAINT ticket_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(userid);


--
-- TOC entry 3333 (class 2606 OID 49538)
-- Name: user_salutation fk_contact_id; Type: FK CONSTRAINT; Schema: user_vamtech20250120; Owner: postgres
--

ALTER TABLE ONLY user_vamtech20250120.user_salutation
    ADD CONSTRAINT fk_contact_id FOREIGN KEY (contact_id) REFERENCES user_vamtech20250120.contacts(id) ON DELETE CASCADE;


--
-- TOC entry 3334 (class 2606 OID 49543)
-- Name: user_salutation fk_user_id; Type: FK CONSTRAINT; Schema: user_vamtech20250120; Owner: postgres
--

ALTER TABLE ONLY user_vamtech20250120.user_salutation
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.users(userid) ON DELETE CASCADE;


--
-- TOC entry 3523 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: Admin
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2025-03-16 12:34:39

--
-- PostgreSQL database dump complete
--

