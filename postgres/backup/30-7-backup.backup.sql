--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.3
-- Dumped by pg_dump version 9.6.3

-- Started on 2017-07-30 18:00:33

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2156 (class 1262 OID 12401)
-- Dependencies: 2155
-- Name: postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- TOC entry 4 (class 2615 OID 16388)
-- Name: astronauts; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA astronauts;


ALTER SCHEMA astronauts OWNER TO postgres;

--
-- TOC entry 7 (class 2615 OID 16444)
-- Name: postgraphql_watch; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA postgraphql_watch;


ALTER SCHEMA postgraphql_watch OWNER TO postgres;

--
-- TOC entry 1 (class 3079 OID 12387)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2157 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = astronauts, pg_catalog;

--
-- TOC entry 205 (class 1255 OID 16440)
-- Name: add_astronaut(json, json); Type: FUNCTION; Schema: astronauts; Owner: postgres
--

CREATE FUNCTION add_astronaut(astronaut json, superpowers json) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    userId int;
    item json;
    superPowerId int;
    possibleId int;
BEGIN
  -- SELECT id INTO possibleId FROM tests.rules WHERE rules.rule = ruleParam;

  WITH upd AS (
    INSERT INTO astronauts.astronauts(
              first_name, last_name, birth_date, email, color)
      VALUES (
        astronaut ->> 'firstName',
        astronaut ->> 'lastName',
        to_date(astronaut ->> 'birthDate', 'YYYY-MM-DD'),
        astronaut ->> 'email',
        astronaut ->> 'color'
      ) RETURNING id
  ) SELECT id INTO userId from upd;

  FOR item IN SELECT * FROM json_array_elements(superPowers)
  LOOP
    SELECT id INTO superPowerId FROM astronauts.super_powers
       WHERE super_powers.name = item ->> 'label';

    IF superPowerId IS NULL then
      WITH upd AS (
        INSERT INTO astronauts.super_powers(name) VALUES ( item ->> 'label' ) RETURNING id
      ) select id INTO superPowerId from upd;
      raise notice 'NULKY: %', superPowerId;
    ELSE
      raise notice 'už je tato superschopnost registrovaná: %', superPowerId;
    END IF;

    INSERT INTO astronauts.astronauts_super_powers_map(
      id_astronaut, id_super_power)
      VALUES (userId, superPowerId);

  END LOOP;

END;
$$;


ALTER FUNCTION astronauts.add_astronaut(astronaut json, superpowers json) OWNER TO postgres;

SET search_path = postgraphql_watch, pg_catalog;

--
-- TOC entry 192 (class 1255 OID 16445)
-- Name: notify_watchers(); Type: FUNCTION; Schema: postgraphql_watch; Owner: postgres
--

CREATE FUNCTION notify_watchers() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$ begin perform pg_notify( 'postgraphql_watch', (select array_to_json(array_agg(x)) from (select schema_name as schema, command_tag as command from pg_event_trigger_ddl_commands()) as x)::text ); end; $$;


ALTER FUNCTION postgraphql_watch.notify_watchers() OWNER TO postgres;

SET search_path = astronauts, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 186 (class 1259 OID 16391)
-- Name: astronauts; Type: TABLE; Schema: astronauts; Owner: postgres
--

CREATE TABLE astronauts (
    id integer NOT NULL,
    first_name text,
    last_name text,
    birth_date date,
    email text,
    color text
);


ALTER TABLE astronauts OWNER TO postgres;

--
-- TOC entry 2158 (class 0 OID 0)
-- Dependencies: 186
-- Name: COLUMN astronauts.id; Type: COMMENT; Schema: astronauts; Owner: postgres
--

COMMENT ON COLUMN astronauts.id IS ' astronaut''s unique identifier';


--
-- TOC entry 2159 (class 0 OID 0)
-- Dependencies: 186
-- Name: COLUMN astronauts.first_name; Type: COMMENT; Schema: astronauts; Owner: postgres
--

COMMENT ON COLUMN astronauts.first_name IS 'name of astronaut';


--
-- TOC entry 2160 (class 0 OID 0)
-- Dependencies: 186
-- Name: COLUMN astronauts.email; Type: COMMENT; Schema: astronauts; Owner: postgres
--

COMMENT ON COLUMN astronauts.email IS 'email of astronaut';


--
-- TOC entry 187 (class 1259 OID 16397)
-- Name: astronauts_id_seq; Type: SEQUENCE; Schema: astronauts; Owner: postgres
--

CREATE SEQUENCE astronauts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE astronauts_id_seq OWNER TO postgres;

--
-- TOC entry 2161 (class 0 OID 0)
-- Dependencies: 187
-- Name: astronauts_id_seq; Type: SEQUENCE OWNED BY; Schema: astronauts; Owner: postgres
--

ALTER SEQUENCE astronauts_id_seq OWNED BY astronauts.id;


--
-- TOC entry 188 (class 1259 OID 16399)
-- Name: astronauts_super_powers_map; Type: TABLE; Schema: astronauts; Owner: postgres
--

CREATE TABLE astronauts_super_powers_map (
    id integer NOT NULL,
    id_astronaut integer NOT NULL,
    id_super_power integer NOT NULL
);


ALTER TABLE astronauts_super_powers_map OWNER TO postgres;

--
-- TOC entry 2162 (class 0 OID 0)
-- Dependencies: 188
-- Name: TABLE astronauts_super_powers_map; Type: COMMENT; Schema: astronauts; Owner: postgres
--

COMMENT ON TABLE astronauts_super_powers_map IS 'N:M table for astronauts and super powers';


--
-- TOC entry 189 (class 1259 OID 16402)
-- Name: astronauts_super_powers_map_id_seq; Type: SEQUENCE; Schema: astronauts; Owner: postgres
--

CREATE SEQUENCE astronauts_super_powers_map_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE astronauts_super_powers_map_id_seq OWNER TO postgres;

--
-- TOC entry 2163 (class 0 OID 0)
-- Dependencies: 189
-- Name: astronauts_super_powers_map_id_seq; Type: SEQUENCE OWNED BY; Schema: astronauts; Owner: postgres
--

ALTER SEQUENCE astronauts_super_powers_map_id_seq OWNED BY astronauts_super_powers_map.id;


--
-- TOC entry 190 (class 1259 OID 16404)
-- Name: super_powers; Type: TABLE; Schema: astronauts; Owner: postgres
--

CREATE TABLE super_powers (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE super_powers OWNER TO postgres;

--
-- TOC entry 2164 (class 0 OID 0)
-- Dependencies: 190
-- Name: TABLE super_powers; Type: COMMENT; Schema: astronauts; Owner: postgres
--

COMMENT ON TABLE super_powers IS 'list of all possibles super powers';


--
-- TOC entry 2165 (class 0 OID 0)
-- Dependencies: 190
-- Name: COLUMN super_powers.name; Type: COMMENT; Schema: astronauts; Owner: postgres
--

COMMENT ON COLUMN super_powers.name IS 'name of super power';


--
-- TOC entry 191 (class 1259 OID 16410)
-- Name: super_powers_id_seq; Type: SEQUENCE; Schema: astronauts; Owner: postgres
--

CREATE SEQUENCE super_powers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE super_powers_id_seq OWNER TO postgres;

--
-- TOC entry 2166 (class 0 OID 0)
-- Dependencies: 191
-- Name: super_powers_id_seq; Type: SEQUENCE OWNED BY; Schema: astronauts; Owner: postgres
--

ALTER SEQUENCE super_powers_id_seq OWNED BY super_powers.id;


--
-- TOC entry 2019 (class 2604 OID 16412)
-- Name: astronauts id; Type: DEFAULT; Schema: astronauts; Owner: postgres
--

ALTER TABLE ONLY astronauts ALTER COLUMN id SET DEFAULT nextval('astronauts_id_seq'::regclass);


--
-- TOC entry 2020 (class 2604 OID 16413)
-- Name: astronauts_super_powers_map id; Type: DEFAULT; Schema: astronauts; Owner: postgres
--

ALTER TABLE ONLY astronauts_super_powers_map ALTER COLUMN id SET DEFAULT nextval('astronauts_super_powers_map_id_seq'::regclass);


--
-- TOC entry 2021 (class 2604 OID 16414)
-- Name: super_powers id; Type: DEFAULT; Schema: astronauts; Owner: postgres
--

ALTER TABLE ONLY super_powers ALTER COLUMN id SET DEFAULT nextval('super_powers_id_seq'::regclass);


--
-- TOC entry 2145 (class 0 OID 16391)
-- Dependencies: 186
-- Data for Name: astronauts; Type: TABLE DATA; Schema: astronauts; Owner: postgres
--

COPY astronauts (id, first_name, last_name, birth_date, email, color) FROM stdin;
104	Michaela	Vičar	2017-07-30	mich.vicar@gmail.com	#ecd647
105	katka	sve	2017-07-30	mich.vicar@gmail.com	#db25c7
106	Michaela	Vičar	2017-07-30	mich.vicar@gmail.com	#9013fe
\.


--
-- TOC entry 2167 (class 0 OID 0)
-- Dependencies: 187
-- Name: astronauts_id_seq; Type: SEQUENCE SET; Schema: astronauts; Owner: postgres
--

SELECT pg_catalog.setval('astronauts_id_seq', 106, true);


--
-- TOC entry 2147 (class 0 OID 16399)
-- Dependencies: 188
-- Data for Name: astronauts_super_powers_map; Type: TABLE DATA; Schema: astronauts; Owner: postgres
--

COPY astronauts_super_powers_map (id, id_astronaut, id_super_power) FROM stdin;
108	105	51
109	106	52
110	106	51
\.


--
-- TOC entry 2168 (class 0 OID 0)
-- Dependencies: 189
-- Name: astronauts_super_powers_map_id_seq; Type: SEQUENCE SET; Schema: astronauts; Owner: postgres
--

SELECT pg_catalog.setval('astronauts_super_powers_map_id_seq', 110, true);


--
-- TOC entry 2149 (class 0 OID 16404)
-- Dependencies: 190
-- Data for Name: super_powers; Type: TABLE DATA; Schema: astronauts; Owner: postgres
--

COPY super_powers (id, name) FROM stdin;
51	růžová lady
52	im so coool
\.


--
-- TOC entry 2169 (class 0 OID 0)
-- Dependencies: 191
-- Name: super_powers_id_seq; Type: SEQUENCE SET; Schema: astronauts; Owner: postgres
--

SELECT pg_catalog.setval('super_powers_id_seq', 52, true);


--
-- TOC entry 2023 (class 2606 OID 16416)
-- Name: astronauts primary key; Type: CONSTRAINT; Schema: astronauts; Owner: postgres
--

ALTER TABLE ONLY astronauts
    ADD CONSTRAINT "primary key" PRIMARY KEY (id);


--
-- TOC entry 2025 (class 2606 OID 16418)
-- Name: super_powers primary key for superpower; Type: CONSTRAINT; Schema: astronauts; Owner: postgres
--

ALTER TABLE ONLY super_powers
    ADD CONSTRAINT "primary key for superpower" PRIMARY KEY (id);


--
-- TOC entry 2026 (class 2606 OID 16419)
-- Name: astronauts_super_powers_map foreign key for astronauts; Type: FK CONSTRAINT; Schema: astronauts; Owner: postgres
--

ALTER TABLE ONLY astronauts_super_powers_map
    ADD CONSTRAINT "foreign key for astronauts" FOREIGN KEY (id_astronaut) REFERENCES astronauts(id);


--
-- TOC entry 2027 (class 2606 OID 16424)
-- Name: astronauts_super_powers_map foreign key for super powers; Type: FK CONSTRAINT; Schema: astronauts; Owner: postgres
--

ALTER TABLE ONLY astronauts_super_powers_map
    ADD CONSTRAINT "foreign key for super powers" FOREIGN KEY (id_super_power) REFERENCES super_powers(id);


--
-- TOC entry 2018 (class 3466 OID 16446)
-- Name: postgraphql_watch; Type: EVENT TRIGGER; Schema: -; Owner: postgres
--

CREATE EVENT TRIGGER postgraphql_watch ON ddl_command_end
         WHEN TAG IN ('ALTER DOMAIN', 'ALTER FOREIGN TABLE', 'ALTER FUNCTION', 'ALTER SCHEMA', 'ALTER TABLE', 'ALTER TYPE', 'ALTER VIEW', 'COMMENT', 'CREATE DOMAIN', 'CREATE FOREIGN TABLE', 'CREATE FUNCTION', 'CREATE SCHEMA', 'CREATE TABLE', 'CREATE TABLE AS', 'CREATE VIEW', 'DROP DOMAIN', 'DROP FOREIGN TABLE', 'DROP FUNCTION', 'DROP SCHEMA', 'DROP TABLE', 'DROP VIEW', 'GRANT', 'REVOKE', 'SELECT INTO')
   EXECUTE PROCEDURE postgraphql_watch.notify_watchers();


-- Completed on 2017-07-30 18:00:34

--
-- PostgreSQL database dump complete
--

