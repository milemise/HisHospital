--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.0

-- Started on 2025-06-17 23:45:26

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', 'public', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3567 (class 1262 OID 16389)
-- Name: neondb; Type: DATABASE; Schema: -; Owner: neondb_owner
--

CREATE DATABASE neondb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = builtin LOCALE = 'C.UTF-8' BUILTIN_LOCALE = 'C.UTF-8';


ALTER DATABASE neondb OWNER TO neondb_owner;

\connect neondb

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', 'public', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3569 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 908 (class 1247 OID 24702)
-- Name: enum_admisiones_estado_admision; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.enum_admisiones_estado_admision AS ENUM (
    'Activo',
    'En Proceso',
    'Dada de Alta',
    'Cancelada'
);


ALTER TYPE public.enum_admisiones_estado_admision OWNER TO neondb_owner;

--
-- TOC entry 887 (class 1247 OID 24617)
-- Name: enum_cama_estado; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.enum_cama_estado AS ENUM (
    'Libre',
    'Ocupada',
    'En Limpieza',
    'Fuera de Servicio'
);


ALTER TYPE public.enum_cama_estado OWNER TO neondb_owner;

--
-- TOC entry 890 (class 1247 OID 24626)
-- Name: enum_cama_genero_asignado; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.enum_cama_genero_asignado AS ENUM (
    'M',
    'F'
);


ALTER TYPE public.enum_cama_genero_asignado OWNER TO neondb_owner;

--
-- TOC entry 881 (class 1247 OID 24594)
-- Name: enum_habitaciones_estado; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.enum_habitaciones_estado AS ENUM (
    'Disponible',
    'Ocupada',
    'Mantenimiento',
    'Limpieza'
);


ALTER TYPE public.enum_habitaciones_estado OWNER TO neondb_owner;

--
-- TOC entry 878 (class 1247 OID 24586)
-- Name: enum_habitaciones_tipo; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.enum_habitaciones_tipo AS ENUM (
    'Individual',
    'Compartida',
    'Suite'
);


ALTER TYPE public.enum_habitaciones_tipo OWNER TO neondb_owner;

--
-- TOC entry 899 (class 1247 OID 24656)
-- Name: enum_pacientes_genero; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.enum_pacientes_genero AS ENUM (
    'Masculino',
    'Femenino',
    'Otro',
    'No especificado'
);


ALTER TYPE public.enum_pacientes_genero OWNER TO neondb_owner;

--
-- TOC entry 902 (class 1247 OID 24666)
-- Name: enum_pacientes_grupo_sanguineo; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.enum_pacientes_grupo_sanguineo AS ENUM (
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-'
);


ALTER TYPE public.enum_pacientes_grupo_sanguineo OWNER TO neondb_owner;

--
-- TOC entry 929 (class 1247 OID 24824)
-- Name: enum_turnos_estado; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.enum_turnos_estado AS ENUM (
    'pendiente',
    'confirmado',
    'cancelado',
    'finalizado'
);


ALTER TYPE public.enum_turnos_estado OWNER TO neondb_owner;

--
-- TOC entry 935 (class 1247 OID 24852)
-- Name: enum_usuarios_rol; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.enum_usuarios_rol AS ENUM (
    'admin',
    'medico',
    'enfermero',
    'recepcion'
);


ALTER TYPE public.enum_usuarios_rol OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 230 (class 1259 OID 24712)
-- Name: admisiones; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.admisiones (
    id_admision integer NOT NULL,
    id_paciente integer NOT NULL,
    fecha_ingreso timestamp with time zone NOT NULL,
    fecha_alta timestamp with time zone,
    motivo_internacion text NOT NULL,
    es_emergencia boolean DEFAULT false NOT NULL,
    estado_admision enum_admisiones_estado_admision DEFAULT 'En Proceso'::enum_admisiones_estado_admision NOT NULL,
    id_cama_asignada integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.admisiones OWNER TO neondb_owner;

--
-- TOC entry 229 (class 1259 OID 24711)
-- Name: admisiones_id_admision_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.admisiones_id_admision_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admisiones_id_admision_seq OWNER TO neondb_owner;

--
-- TOC entry 3570 (class 0 OID 0)
-- Dependencies: 229
-- Name: admisiones_id_admision_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.admisiones_id_admision_seq OWNED BY public.admisiones.id_admision;


--
-- TOC entry 220 (class 1259 OID 24577)
-- Name: ala; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.ala (
    id_ala integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.ala OWNER TO neondb_owner;

--
-- TOC entry 219 (class 1259 OID 24576)
-- Name: ala_id_ala_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.ala_id_ala_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ala_id_ala_seq OWNER TO neondb_owner;

--
-- TOC entry 3571 (class 0 OID 0)
-- Dependencies: 219
-- Name: ala_id_ala_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.ala_id_ala_seq OWNED BY public.ala.id_ala;


--
-- TOC entry 240 (class 1259 OID 24803)
-- Name: altas; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.altas (
    id_alta integer NOT NULL,
    id_admision integer NOT NULL,
    id_medico integer NOT NULL,
    fecha_alta_real timestamp with time zone NOT NULL,
    diagnostico_final text NOT NULL,
    tratamiento_indicado text NOT NULL,
    medicamentos_recetados text NOT NULL,
    fecha_control_sugerido date,
    observaciones_alta text
);


ALTER TABLE public.altas OWNER TO neondb_owner;

--
-- TOC entry 239 (class 1259 OID 24802)
-- Name: altas_id_alta_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.altas_id_alta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.altas_id_alta_seq OWNER TO neondb_owner;

--
-- TOC entry 3572 (class 0 OID 0)
-- Dependencies: 239
-- Name: altas_id_alta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.altas_id_alta_seq OWNED BY public.altas.id_alta;


--
-- TOC entry 232 (class 1259 OID 24733)
-- Name: asignacion_cama; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.asignacion_cama (
    id_asignacion_cama integer NOT NULL,
    id_admision integer NOT NULL,
    id_cama integer NOT NULL,
    fecha_asignacion timestamp with time zone NOT NULL,
    fecha_liberacion timestamp with time zone,
    es_actual boolean DEFAULT true NOT NULL
);


ALTER TABLE public.asignacion_cama OWNER TO neondb_owner;

--
-- TOC entry 231 (class 1259 OID 24732)
-- Name: asignacion_cama_id_asignacion_cama_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.asignacion_cama_id_asignacion_cama_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asignacion_cama_id_asignacion_cama_seq OWNER TO neondb_owner;

--
-- TOC entry 3573 (class 0 OID 0)
-- Dependencies: 231
-- Name: asignacion_cama_id_asignacion_cama_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.asignacion_cama_id_asignacion_cama_seq OWNED BY public.asignacion_cama.id_asignacion_cama;


--
-- TOC entry 224 (class 1259 OID 24632)
-- Name: cama; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.cama (
    id_cama integer NOT NULL,
    id_habitacion integer NOT NULL,
    numero character varying(10) NOT NULL,
    estado enum_cama_estado DEFAULT 'Libre'::enum_cama_estado NOT NULL,
    genero_asignado enum_cama_genero_asignado
);


ALTER TABLE public.cama OWNER TO neondb_owner;

--
-- TOC entry 223 (class 1259 OID 24631)
-- Name: cama_id_cama_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.cama_id_cama_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cama_id_cama_seq OWNER TO neondb_owner;

--
-- TOC entry 3574 (class 0 OID 0)
-- Dependencies: 223
-- Name: cama_id_cama_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.cama_id_cama_seq OWNED BY public.cama.id_cama;


--
-- TOC entry 234 (class 1259 OID 24751)
-- Name: especialidad; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.especialidad (
    id_especialidad integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text
);


ALTER TABLE public.especialidad OWNER TO neondb_owner;

--
-- TOC entry 233 (class 1259 OID 24750)
-- Name: especialidad_id_especialidad_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.especialidad_id_especialidad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.especialidad_id_especialidad_seq OWNER TO neondb_owner;

--
-- TOC entry 3575 (class 0 OID 0)
-- Dependencies: 233
-- Name: especialidad_id_especialidad_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.especialidad_id_especialidad_seq OWNED BY public.especialidad.id_especialidad;


--
-- TOC entry 238 (class 1259 OID 24779)
-- Name: evaluaciones; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.evaluaciones (
    id_evaluacion integer NOT NULL,
    id_admision integer NOT NULL,
    id_paciente integer,
    id_medico integer NOT NULL,
    fecha_evaluacion timestamp with time zone NOT NULL,
    diagnostico text,
    observaciones_medicas text,
    signos_vitales json,
    plan_cuidados text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.evaluaciones OWNER TO neondb_owner;

--
-- TOC entry 237 (class 1259 OID 24778)
-- Name: evaluaciones_id_evaluacion_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.evaluaciones_id_evaluacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evaluaciones_id_evaluacion_seq OWNER TO neondb_owner;

--
-- TOC entry 3576 (class 0 OID 0)
-- Dependencies: 237
-- Name: evaluaciones_id_evaluacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.evaluaciones_id_evaluacion_seq OWNED BY public.evaluaciones.id_evaluacion;


--
-- TOC entry 222 (class 1259 OID 24604)
-- Name: habitaciones; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.habitaciones (
    id_habitacion integer NOT NULL,
    numero character varying(10) NOT NULL,
    tipo enum_habitaciones_tipo NOT NULL,
    estado enum_habitaciones_estado DEFAULT 'Disponible'::enum_habitaciones_estado NOT NULL,
    id_ala integer NOT NULL
);


ALTER TABLE public.habitaciones OWNER TO neondb_owner;

--
-- TOC entry 221 (class 1259 OID 24603)
-- Name: habitaciones_id_habitacion_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.habitaciones_id_habitacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.habitaciones_id_habitacion_seq OWNER TO neondb_owner;

--
-- TOC entry 3577 (class 0 OID 0)
-- Dependencies: 221
-- Name: habitaciones_id_habitacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.habitaciones_id_habitacion_seq OWNED BY public.habitaciones.id_habitacion;


--
-- TOC entry 236 (class 1259 OID 24762)
-- Name: medicos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.medicos (
    id_medico integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100),
    id_especialidad integer NOT NULL,
    matricula character varying(50) NOT NULL,
    telefono character varying(20),
    email character varying(100) NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.medicos OWNER TO neondb_owner;

--
-- TOC entry 235 (class 1259 OID 24761)
-- Name: medicos_id_medico_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.medicos_id_medico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medicos_id_medico_seq OWNER TO neondb_owner;

--
-- TOC entry 3578 (class 0 OID 0)
-- Dependencies: 235
-- Name: medicos_id_medico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.medicos_id_medico_seq OWNED BY public.medicos.id_medico;


--
-- TOC entry 226 (class 1259 OID 24645)
-- Name: obras_sociales; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.obras_sociales (
    id_obra_social integer NOT NULL,
    nombre character varying(100) NOT NULL,
    codigo character varying(20) NOT NULL
);


ALTER TABLE public.obras_sociales OWNER TO neondb_owner;

--
-- TOC entry 225 (class 1259 OID 24644)
-- Name: obras_sociales_id_obra_social_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.obras_sociales_id_obra_social_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.obras_sociales_id_obra_social_seq OWNER TO neondb_owner;

--
-- TOC entry 3579 (class 0 OID 0)
-- Dependencies: 225
-- Name: obras_sociales_id_obra_social_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.obras_sociales_id_obra_social_seq OWNED BY public.obras_sociales.id_obra_social;


--
-- TOC entry 228 (class 1259 OID 24684)
-- Name: pacientes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.pacientes (
    id_paciente integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    dni character varying(20) NOT NULL,
    fecha_nacimiento date NOT NULL,
    genero enum_pacientes_genero DEFAULT 'No especificado'::enum_pacientes_genero,
    telefono character varying(20),
    email character varying(100),
    direccion character varying(255),
    grupo_sanguineo enum_pacientes_grupo_sanguineo,
    alergias text,
    medicamentos_actuales text,
    id_obra_social integer,
    numero_afiliado character varying(50),
    activo boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.pacientes OWNER TO neondb_owner;

--
-- TOC entry 227 (class 1259 OID 24683)
-- Name: pacientes_id_paciente_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.pacientes_id_paciente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pacientes_id_paciente_seq OWNER TO neondb_owner;

--
-- TOC entry 3580 (class 0 OID 0)
-- Dependencies: 227
-- Name: pacientes_id_paciente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.pacientes_id_paciente_seq OWNED BY public.pacientes.id_paciente;


--
-- TOC entry 242 (class 1259 OID 24834)
-- Name: turnos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.turnos (
    id_turno integer NOT NULL,
    id_paciente integer,
    id_medico integer,
    fecha_hora timestamp with time zone NOT NULL,
    estado enum_turnos_estado DEFAULT 'pendiente'::enum_turnos_estado NOT NULL
);


ALTER TABLE public.turnos OWNER TO neondb_owner;

--
-- TOC entry 241 (class 1259 OID 24833)
-- Name: turnos_id_turno_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.turnos_id_turno_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.turnos_id_turno_seq OWNER TO neondb_owner;

--
-- TOC entry 3581 (class 0 OID 0)
-- Dependencies: 241
-- Name: turnos_id_turno_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.turnos_id_turno_seq OWNED BY public.turnos.id_turno;


--
-- TOC entry 244 (class 1259 OID 24862)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    nombre_usuario character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    rol enum_usuarios_rol NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.usuarios OWNER TO neondb_owner;

--
-- TOC entry 243 (class 1259 OID 24861)
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_usuario_seq OWNER TO neondb_owner;

--
-- TOC entry 3582 (class 0 OID 0)
-- Dependencies: 243
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- TOC entry 3287 (class 2604 OID 24715)
-- Name: admisiones id_admision; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admisiones ALTER COLUMN id_admision SET DEFAULT nextval('admisiones_id_admision_seq'::regclass);


--
-- TOC entry 3278 (class 2604 OID 24580)
-- Name: ala id_ala; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ala ALTER COLUMN id_ala SET DEFAULT nextval('ala_id_ala_seq'::regclass);


--
-- TOC entry 3296 (class 2604 OID 24806)
-- Name: altas id_alta; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.altas ALTER COLUMN id_alta SET DEFAULT nextval('altas_id_alta_seq'::regclass);


--
-- TOC entry 3290 (class 2604 OID 24736)
-- Name: asignacion_cama id_asignacion_cama; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asignacion_cama ALTER COLUMN id_asignacion_cama SET DEFAULT nextval('asignacion_cama_id_asignacion_cama_seq'::regclass);


--
-- TOC entry 3281 (class 2604 OID 24635)
-- Name: cama id_cama; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cama ALTER COLUMN id_cama SET DEFAULT nextval('cama_id_cama_seq'::regclass);


--
-- TOC entry 3292 (class 2604 OID 24754)
-- Name: especialidad id_especialidad; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.especialidad ALTER COLUMN id_especialidad SET DEFAULT nextval('especialidad_id_especialidad_seq'::regclass);


--
-- TOC entry 3295 (class 2604 OID 24782)
-- Name: evaluaciones id_evaluacion; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.evaluaciones ALTER COLUMN id_evaluacion SET DEFAULT nextval('evaluaciones_id_evaluacion_seq'::regclass);


--
-- TOC entry 3279 (class 2604 OID 24607)
-- Name: habitaciones id_habitacion; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.habitaciones ALTER COLUMN id_habitacion SET DEFAULT nextval('habitaciones_id_habitacion_seq'::regclass);


--
-- TOC entry 3293 (class 2604 OID 24765)
-- Name: medicos id_medico; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medicos ALTER COLUMN id_medico SET DEFAULT nextval('medicos_id_medico_seq'::regclass);


--
-- TOC entry 3283 (class 2604 OID 24648)
-- Name: obras_sociales id_obra_social; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.obras_sociales ALTER COLUMN id_obra_social SET DEFAULT nextval('obras_sociales_id_obra_social_seq'::regclass);


--
-- TOC entry 3284 (class 2604 OID 24687)
-- Name: pacientes id_paciente; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pacientes ALTER COLUMN id_paciente SET DEFAULT nextval('pacientes_id_paciente_seq'::regclass);


--
-- TOC entry 3297 (class 2604 OID 24837)
-- Name: turnos id_turno; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.turnos ALTER COLUMN id_turno SET DEFAULT nextval('turnos_id_turno_seq'::regclass);


--
-- TOC entry 3299 (class 2604 OID 24865)
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('usuarios_id_usuario_seq'::regclass);


--
-- TOC entry 3547 (class 0 OID 24712)
-- Dependencies: 230
-- Data for Name: admisiones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.admisiones VALUES (1, 8, '2025-06-17 16:31:00+00', '2025-06-17 13:34:09.611+00', 'ijoi0j', true, 'Cancelada', 3, '2025-06-17 13:31:47.701+00', '2025-06-17 13:34:09.612+00');
INSERT INTO public.admisiones VALUES (2, 9, '2025-06-17 16:34:00+00', '2025-06-17 13:35:49.717+00', 'nose', true, 'Cancelada', 3, '2025-06-17 13:34:54.858+00', '2025-06-17 13:35:49.717+00');
INSERT INTO public.admisiones VALUES (3, 3, '2025-06-17 16:35:00+00', '2025-06-17 13:37:58.578+00', 'nose', false, 'Cancelada', 3, '2025-06-17 13:36:01.569+00', '2025-06-17 13:37:58.578+00');
INSERT INTO public.admisiones VALUES (4, 10, '2025-06-17 16:37:00+00', '2025-06-17 13:56:09.686+00', 'hemorragia', true, 'Cancelada', 3, '2025-06-17 13:38:14.09+00', '2025-06-17 13:56:09.691+00');
INSERT INTO public.admisiones VALUES (5, 11, '2025-06-17 16:56:00+00', '2025-06-17 14:03:51.9+00', 'nose', true, 'Cancelada', 3, '2025-06-17 13:56:31.27+00', '2025-06-17 14:03:51.905+00');
INSERT INTO public.admisiones VALUES (6, 17, '2025-06-17 17:55:00+00', NULL, 'kjbjk', true, 'En Proceso', 3, '2025-06-17 14:55:43.807+00', '2025-06-17 14:55:43.807+00');
INSERT INTO public.admisiones VALUES (7, 18, '2025-06-17 18:00:00+00', NULL, 'hemorragia', true, 'En Proceso', 6, '2025-06-17 15:01:16.624+00', '2025-06-17 15:01:16.624+00');
INSERT INTO public.admisiones VALUES (8, 2, '2025-06-17 20:17:00+00', NULL, 'dolor de estomago', false, 'En Proceso', 7, '2025-06-17 17:17:13.001+00', '2025-06-17 17:17:13.001+00');


--
-- TOC entry 3537 (class 0 OID 24577)
-- Dependencies: 220
-- Data for Name: ala; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.ala VALUES (1, 'Ala A - Cardiología');
INSERT INTO public.ala VALUES (2, 'Ala B - Pediatría');
INSERT INTO public.ala VALUES (3, 'Ala C - Traumatología');
INSERT INTO public.ala VALUES (4, 'Ala D - Urgencias');


--
-- TOC entry 3557 (class 0 OID 24803)
-- Dependencies: 240
-- Data for Name: altas; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- TOC entry 3549 (class 0 OID 24733)
-- Dependencies: 232
-- Data for Name: asignacion_cama; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- TOC entry 3541 (class 0 OID 24632)
-- Dependencies: 224
-- Data for Name: cama; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.cama VALUES (1, 1, 'Cama 1', 'Ocupada', NULL);
INSERT INTO public.cama VALUES (2, 2, 'Cama 2A', 'Ocupada', 'M');
INSERT INTO public.cama VALUES (3, 2, 'Cama 2B', 'Ocupada', 'F');
INSERT INTO public.cama VALUES (4, 3, 'Cama 3', 'En Limpieza', NULL);
INSERT INTO public.cama VALUES (5, 1, 'Cama 1A', 'Libre', NULL);
INSERT INTO public.cama VALUES (6, 1, 'Cama 1B', 'Ocupada', 'F');
INSERT INTO public.cama VALUES (7, 2, 'Cama 2C', 'Ocupada', 'M');
INSERT INTO public.cama VALUES (8, 2, 'Cama 2D', 'Ocupada', 'F');
INSERT INTO public.cama VALUES (9, 3, 'Cama 3A', 'Libre', NULL);
INSERT INTO public.cama VALUES (10, 3, 'Cama 3B', 'Fuera de Servicio', NULL);
INSERT INTO public.cama VALUES (11, 1, 'Cama 1C', 'En Limpieza', NULL);


--
-- TOC entry 3551 (class 0 OID 24751)
-- Dependencies: 234
-- Data for Name: especialidad; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.especialidad VALUES (1, 'Cardiología', 'Especialidad médica que se encarga del corazón');
INSERT INTO public.especialidad VALUES (2, 'Pediatría', 'Especialidad médica que atiende a niños');
INSERT INTO public.especialidad VALUES (3, 'Traumatología', 'Especialidad médica de huesos y músculos');


--
-- TOC entry 3555 (class 0 OID 24779)
-- Dependencies: 238
-- Data for Name: evaluaciones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.evaluaciones VALUES (1, 5, 11, 2, '2025-06-17 14:00:51.605+00', 'wefe', 'iajdw', '{"presion_arterial":"12","frecuencia_cardiaca":"33","frecuencia_respiratoria":"54","temperatura":"37"}', 'kjhjk', '2025-06-17 14:00:51.606+00', '2025-06-17 14:00:51.606+00');


--
-- TOC entry 3539 (class 0 OID 24604)
-- Dependencies: 222
-- Data for Name: habitaciones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.habitaciones VALUES (1, '101', 'Individual', 'Disponible', 1);
INSERT INTO public.habitaciones VALUES (2, '202', 'Compartida', 'Disponible', 2);
INSERT INTO public.habitaciones VALUES (3, '305', 'Individual', 'Disponible', 3);


--
-- TOC entry 3553 (class 0 OID 24762)
-- Dependencies: 236
-- Data for Name: medicos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.medicos VALUES (1, 'Juan', 'Pérez', 1, 'MP12345', '3515551234', 'juan.perez@hospital.com', true, '2025-06-17 06:35:27.209444+00', '2025-06-17 06:35:27.209444+00');
INSERT INTO public.medicos VALUES (2, 'María', 'Gómez', 2, 'MP54321', '3515554321', 'maria.gomez@hospital.com', true, '2025-06-17 06:35:27.209444+00', '2025-06-17 06:35:27.209444+00');
INSERT INTO public.medicos VALUES (3, 'Carlos', 'López', 3, 'MP67890', '3515556789', 'carlos.lopez@hospital.com', true, '2025-06-17 06:35:27.209444+00', '2025-06-17 06:35:27.209444+00');


--
-- TOC entry 3543 (class 0 OID 24645)
-- Dependencies: 226
-- Data for Name: obras_sociales; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.obras_sociales VALUES (1, 'OSDE', 'OSDE210');
INSERT INTO public.obras_sociales VALUES (2, 'Swiss Medical', 'SWISS456');
INSERT INTO public.obras_sociales VALUES (3, 'Galeno', 'GAL789');


--
-- TOC entry 3545 (class 0 OID 24684)
-- Dependencies: 228
-- Data for Name: pacientes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.pacientes VALUES (1, 'Lourdes', 'Villegas', '43879076', '2001-06-08', 'Femenino', '2664829475', NULL, NULL, 'B+', NULL, NULL, NULL, NULL, true, '2025-06-14 00:06:03.742+00', '2025-06-14 00:06:03.742+00', NULL);
INSERT INTO public.pacientes VALUES (2, 'Martín', 'Díaz', '55667788', '1988-03-10', 'Masculino', '3514445566', 'martin.diaz@example.com', NULL, NULL, NULL, NULL, 2, 'SWISS-67890', true, '2025-06-17 06:35:27.209444+00', '2025-06-17 06:35:27.209444+00', NULL);
INSERT INTO public.pacientes VALUES (3, 'Laura', 'Pérez', '99887766', '1975-11-01', 'Femenino', '3517778899', 'laura.perez@example.com', NULL, NULL, NULL, NULL, 3, 'GAL-11223', true, '2025-06-17 06:35:27.209444+00', '2025-06-17 06:35:27.209444+00', NULL);
INSERT INTO public.pacientes VALUES (8, 'Paciente Desconocido', 'N/A', 'EMERG_07627_3QKIY', '2000-01-01', 'No especificado', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, '2025-06-17 13:31:47.648+00', '2025-06-17 13:31:47.648+00', NULL);
INSERT INTO public.pacientes VALUES (9, 'Paciente Desconocido', 'N/A', 'EMERG_94786_XB23Q', '2000-01-01', 'No especificado', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, '2025-06-17 13:34:54.799+00', '2025-06-17 13:34:54.799+00', NULL);
INSERT INTO public.pacientes VALUES (10, 'Paciente Desconocido', 'N/A', 'EMERG_94035_5DA13', '2000-01-01', 'No especificado', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, '2025-06-17 13:38:14.048+00', '2025-06-17 13:38:14.048+00', NULL);
INSERT INTO public.pacientes VALUES (11, 'Juan', 'Gonzalez', '54556775', '2000-01-04', 'Masculino', NULL, NULL, NULL, 'A-', NULL, NULL, 1, NULL, true, '2025-06-17 13:56:31.218+00', '2025-06-17 13:58:01.683+00', NULL);
INSERT INTO public.pacientes VALUES (17, 'Paciente Desconocido', 'N/A', 'EMERG_43754_FMV0S', '2000-01-01', 'Femenino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, '2025-06-17 14:55:43.766+00', '2025-06-17 14:55:43.766+00', NULL);
INSERT INTO public.pacientes VALUES (18, 'Paciente Desconocido', 'N/A', 'EMERG_76581_0NBG9', '2000-01-01', 'Femenino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, '2025-06-17 15:01:16.595+00', '2025-06-17 15:01:16.595+00', NULL);


--
-- TOC entry 3559 (class 0 OID 24834)
-- Dependencies: 242
-- Data for Name: turnos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.turnos VALUES (1, 1, 1, '2025-06-25 15:00:00+00', 'cancelado');
INSERT INTO public.turnos VALUES (2, 2, 2, '2025-06-28 18:30:00+00', 'confirmado');


--
-- TOC entry 3561 (class 0 OID 24862)
-- Dependencies: 244
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.usuarios VALUES (1, 'Administrador', 'admin@gmail.com', '$2a$10$lBfoLNy5KZX8lrunRCiQ5OKntf0TVYnxfFvRSkXwFX0/LFm5nILeC', 'recepcion', '2025-06-18 02:21:16.374+00', '2025-06-18 02:21:16.374+00');
INSERT INTO public.usuarios VALUES (3, 'Administrador', 'admin@example.com', '$2a$10$N.tIy8paxu6.6i1wY3dhv.20TqfO6pRDwoK1aaKj0dfWzlSxVn9R2', 'recepcion', '2025-06-13 22:40:59.06+00', '2025-06-13 22:40:59.06+00');
INSERT INTO public.usuarios VALUES (5, 'admin@his.com', 'milivic@gmail.com', '$2a$10$3cYTeYyz.JiDPK8sG95/8.Hbo/4U5xdOFB8qyRyHJ/lSIqWQGuYAG', 'recepcion', '2025-06-17 17:19:09.231+00', '2025-06-17 17:19:09.231+00');
INSERT INTO public.usuarios VALUES (4, 'admin@example.com', 'admin@his.com', '$2a$10$x6SigdvHbTyk0pwN.GhtAuwqotKGnqk3lHJfQk8GlWW6QESMisVKW', 'admin', '2025-06-17 05:08:58.33+00', '2025-06-18 02:35:35.177+00');


--
-- TOC entry 3583 (class 0 OID 0)
-- Dependencies: 229
-- Name: admisiones_id_admision_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.admisiones_id_admision_seq', 1, false);


--
-- TOC entry 3584 (class 0 OID 0)
-- Dependencies: 219
-- Name: ala_id_ala_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.ala_id_ala_seq', 1, false);


--
-- TOC entry 3585 (class 0 OID 0)
-- Dependencies: 239
-- Name: altas_id_alta_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.altas_id_alta_seq', 1, false);


--
-- TOC entry 3586 (class 0 OID 0)
-- Dependencies: 231
-- Name: asignacion_cama_id_asignacion_cama_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.asignacion_cama_id_asignacion_cama_seq', 1, false);


--
-- TOC entry 3587 (class 0 OID 0)
-- Dependencies: 223
-- Name: cama_id_cama_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.cama_id_cama_seq', 1, false);


--
-- TOC entry 3588 (class 0 OID 0)
-- Dependencies: 233
-- Name: especialidad_id_especialidad_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.especialidad_id_especialidad_seq', 1, false);


--
-- TOC entry 3589 (class 0 OID 0)
-- Dependencies: 237
-- Name: evaluaciones_id_evaluacion_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.evaluaciones_id_evaluacion_seq', 1, false);


--
-- TOC entry 3590 (class 0 OID 0)
-- Dependencies: 221
-- Name: habitaciones_id_habitacion_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.habitaciones_id_habitacion_seq', 1, false);


--
-- TOC entry 3591 (class 0 OID 0)
-- Dependencies: 235
-- Name: medicos_id_medico_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.medicos_id_medico_seq', 1, false);


--
-- TOC entry 3592 (class 0 OID 0)
-- Dependencies: 225
-- Name: obras_sociales_id_obra_social_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.obras_sociales_id_obra_social_seq', 1, false);


--
-- TOC entry 3593 (class 0 OID 0)
-- Dependencies: 227
-- Name: pacientes_id_paciente_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.pacientes_id_paciente_seq', 1, false);


--
-- TOC entry 3594 (class 0 OID 0)
-- Dependencies: 241
-- Name: turnos_id_turno_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.turnos_id_turno_seq', 1, false);


--
-- TOC entry 3595 (class 0 OID 0)
-- Dependencies: 243
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 1, true);


--
-- TOC entry 3335 (class 2606 OID 24721)
-- Name: admisiones admisiones_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admisiones
    ADD CONSTRAINT admisiones_pkey PRIMARY KEY (id_admision);


--
-- TOC entry 3301 (class 2606 OID 32912)
-- Name: ala ala_nombre_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ala
    ADD CONSTRAINT ala_nombre_key UNIQUE (nombre);


--
-- TOC entry 3303 (class 2606 OID 32914)
-- Name: ala ala_nombre_key1; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ala
    ADD CONSTRAINT ala_nombre_key1 UNIQUE (nombre);


--
-- TOC entry 3305 (class 2606 OID 32916)
-- Name: ala ala_nombre_key2; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ala
    ADD CONSTRAINT ala_nombre_key2 UNIQUE (nombre);


--
-- TOC entry 3307 (class 2606 OID 24582)
-- Name: ala ala_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ala
    ADD CONSTRAINT ala_pkey PRIMARY KEY (id_ala);


--
-- TOC entry 3363 (class 2606 OID 24812)
-- Name: altas altas_id_admision_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.altas
    ADD CONSTRAINT altas_id_admision_key UNIQUE (id_admision);


--
-- TOC entry 3365 (class 2606 OID 24810)
-- Name: altas altas_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.altas
    ADD CONSTRAINT altas_pkey PRIMARY KEY (id_alta);


--
-- TOC entry 3337 (class 2606 OID 24739)
-- Name: asignacion_cama asignacion_cama_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asignacion_cama
    ADD CONSTRAINT asignacion_cama_pkey PRIMARY KEY (id_asignacion_cama);


--
-- TOC entry 3311 (class 2606 OID 24638)
-- Name: cama cama_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cama
    ADD CONSTRAINT cama_pkey PRIMARY KEY (id_cama);


--
-- TOC entry 3339 (class 2606 OID 32993)
-- Name: especialidad especialidad_nombre_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.especialidad
    ADD CONSTRAINT especialidad_nombre_key UNIQUE (nombre);


--
-- TOC entry 3341 (class 2606 OID 32995)
-- Name: especialidad especialidad_nombre_key1; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.especialidad
    ADD CONSTRAINT especialidad_nombre_key1 UNIQUE (nombre);


--
-- TOC entry 3343 (class 2606 OID 32997)
-- Name: especialidad especialidad_nombre_key2; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.especialidad
    ADD CONSTRAINT especialidad_nombre_key2 UNIQUE (nombre);


--
-- TOC entry 3345 (class 2606 OID 24758)
-- Name: especialidad especialidad_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.especialidad
    ADD CONSTRAINT especialidad_pkey PRIMARY KEY (id_especialidad);


--
-- TOC entry 3361 (class 2606 OID 24786)
-- Name: evaluaciones evaluaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.evaluaciones
    ADD CONSTRAINT evaluaciones_pkey PRIMARY KEY (id_evaluacion);


--
-- TOC entry 3309 (class 2606 OID 24610)
-- Name: habitaciones habitaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.habitaciones
    ADD CONSTRAINT habitaciones_pkey PRIMARY KEY (id_habitacion);


--
-- TOC entry 3347 (class 2606 OID 33014)
-- Name: medicos medicos_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medicos
    ADD CONSTRAINT medicos_email_key UNIQUE (email);


--
-- TOC entry 3349 (class 2606 OID 33016)
-- Name: medicos medicos_email_key1; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medicos
    ADD CONSTRAINT medicos_email_key1 UNIQUE (email);


--
-- TOC entry 3351 (class 2606 OID 33018)
-- Name: medicos medicos_email_key2; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medicos
    ADD CONSTRAINT medicos_email_key2 UNIQUE (email);


--
-- TOC entry 3353 (class 2606 OID 33006)
-- Name: medicos medicos_matricula_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medicos
    ADD CONSTRAINT medicos_matricula_key UNIQUE (matricula);


--
-- TOC entry 3355 (class 2606 OID 33008)
-- Name: medicos medicos_matricula_key1; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medicos
    ADD CONSTRAINT medicos_matricula_key1 UNIQUE (matricula);


--
-- TOC entry 3357 (class 2606 OID 33010)
-- Name: medicos medicos_matricula_key2; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medicos
    ADD CONSTRAINT medicos_matricula_key2 UNIQUE (matricula);


--
-- TOC entry 3359 (class 2606 OID 24768)
-- Name: medicos medicos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medicos
    ADD CONSTRAINT medicos_pkey PRIMARY KEY (id_medico);


--
-- TOC entry 3313 (class 2606 OID 32942)
-- Name: obras_sociales obras_sociales_codigo_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.obras_sociales
    ADD CONSTRAINT obras_sociales_codigo_key UNIQUE (codigo);


--
-- TOC entry 3315 (class 2606 OID 32944)
-- Name: obras_sociales obras_sociales_codigo_key1; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.obras_sociales
    ADD CONSTRAINT obras_sociales_codigo_key1 UNIQUE (codigo);


--
-- TOC entry 3317 (class 2606 OID 32946)
-- Name: obras_sociales obras_sociales_codigo_key2; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.obras_sociales
    ADD CONSTRAINT obras_sociales_codigo_key2 UNIQUE (codigo);


--
-- TOC entry 3319 (class 2606 OID 32934)
-- Name: obras_sociales obras_sociales_nombre_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.obras_sociales
    ADD CONSTRAINT obras_sociales_nombre_key UNIQUE (nombre);


--
-- TOC entry 3321 (class 2606 OID 32936)
-- Name: obras_sociales obras_sociales_nombre_key1; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.obras_sociales
    ADD CONSTRAINT obras_sociales_nombre_key1 UNIQUE (nombre);


--
-- TOC entry 3323 (class 2606 OID 32938)
-- Name: obras_sociales obras_sociales_nombre_key2; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.obras_sociales
    ADD CONSTRAINT obras_sociales_nombre_key2 UNIQUE (nombre);


--
-- TOC entry 3325 (class 2606 OID 24650)
-- Name: obras_sociales obras_sociales_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.obras_sociales
    ADD CONSTRAINT obras_sociales_pkey PRIMARY KEY (id_obra_social);


--
-- TOC entry 3327 (class 2606 OID 32950)
-- Name: pacientes pacientes_dni_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_dni_key UNIQUE (dni);


--
-- TOC entry 3329 (class 2606 OID 32952)
-- Name: pacientes pacientes_dni_key1; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_dni_key1 UNIQUE (dni);


--
-- TOC entry 3331 (class 2606 OID 32954)
-- Name: pacientes pacientes_dni_key2; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_dni_key2 UNIQUE (dni);


--
-- TOC entry 3333 (class 2606 OID 24693)
-- Name: pacientes pacientes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_pkey PRIMARY KEY (id_paciente);


--
-- TOC entry 3367 (class 2606 OID 24840)
-- Name: turnos turnos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.turnos
    ADD CONSTRAINT turnos_pkey PRIMARY KEY (id_turno);


--
-- TOC entry 3369 (class 2606 OID 33061)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 3371 (class 2606 OID 33063)
-- Name: usuarios usuarios_email_key1; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key1 UNIQUE (email);


--
-- TOC entry 3373 (class 2606 OID 33065)
-- Name: usuarios usuarios_email_key2; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key2 UNIQUE (email);


--
-- TOC entry 3375 (class 2606 OID 24867)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 3379 (class 2606 OID 32973)
-- Name: admisiones admisiones_id_cama_asignada_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admisiones
    ADD CONSTRAINT admisiones_id_cama_asignada_fkey FOREIGN KEY (id_cama_asignada) REFERENCES cama(id_cama) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3380 (class 2606 OID 32964)
-- Name: admisiones admisiones_id_paciente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admisiones
    ADD CONSTRAINT admisiones_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3387 (class 2606 OID 33036)
-- Name: altas altas_id_admision_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.altas
    ADD CONSTRAINT altas_id_admision_fkey FOREIGN KEY (id_admision) REFERENCES admisiones(id_admision) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3388 (class 2606 OID 33041)
-- Name: altas altas_id_medico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.altas
    ADD CONSTRAINT altas_id_medico_fkey FOREIGN KEY (id_medico) REFERENCES medicos(id_medico) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3381 (class 2606 OID 32978)
-- Name: asignacion_cama asignacion_cama_id_admision_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asignacion_cama
    ADD CONSTRAINT asignacion_cama_id_admision_fkey FOREIGN KEY (id_admision) REFERENCES admisiones(id_admision);


--
-- TOC entry 3382 (class 2606 OID 32983)
-- Name: asignacion_cama asignacion_cama_id_cama_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.asignacion_cama
    ADD CONSTRAINT asignacion_cama_id_cama_fkey FOREIGN KEY (id_cama) REFERENCES cama(id_cama);


--
-- TOC entry 3377 (class 2606 OID 32924)
-- Name: cama cama_id_habitacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cama
    ADD CONSTRAINT cama_id_habitacion_fkey FOREIGN KEY (id_habitacion) REFERENCES habitaciones(id_habitacion) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3384 (class 2606 OID 33021)
-- Name: evaluaciones evaluaciones_id_admision_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.evaluaciones
    ADD CONSTRAINT evaluaciones_id_admision_fkey FOREIGN KEY (id_admision) REFERENCES admisiones(id_admision) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3385 (class 2606 OID 33031)
-- Name: evaluaciones evaluaciones_id_medico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.evaluaciones
    ADD CONSTRAINT evaluaciones_id_medico_fkey FOREIGN KEY (id_medico) REFERENCES medicos(id_medico) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3386 (class 2606 OID 33026)
-- Name: evaluaciones evaluaciones_id_paciente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.evaluaciones
    ADD CONSTRAINT evaluaciones_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3376 (class 2606 OID 32919)
-- Name: habitaciones habitaciones_id_ala_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.habitaciones
    ADD CONSTRAINT habitaciones_id_ala_fkey FOREIGN KEY (id_ala) REFERENCES ala(id_ala) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3383 (class 2606 OID 32998)
-- Name: medicos medicos_id_especialidad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.medicos
    ADD CONSTRAINT medicos_id_especialidad_fkey FOREIGN KEY (id_especialidad) REFERENCES especialidad(id_especialidad) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3378 (class 2606 OID 32957)
-- Name: pacientes pacientes_id_obra_social_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_id_obra_social_fkey FOREIGN KEY (id_obra_social) REFERENCES obras_sociales(id_obra_social) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3389 (class 2606 OID 33051)
-- Name: turnos turnos_id_medico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.turnos
    ADD CONSTRAINT turnos_id_medico_fkey FOREIGN KEY (id_medico) REFERENCES medicos(id_medico) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3390 (class 2606 OID 33046)
-- Name: turnos turnos_id_paciente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.turnos
    ADD CONSTRAINT turnos_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3568 (class 0 OID 0)
-- Dependencies: 3567
-- Name: DATABASE neondb; Type: ACL; Schema: -; Owner: neondb_owner
--

GRANT ALL ON DATABASE neondb TO neon_superuser;


--
-- TOC entry 2136 (class 826 OID 16392)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- TOC entry 2135 (class 826 OID 16391)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


-- Completed on 2025-06-17 23:45:55

--
-- PostgreSQL database dump complete
--

