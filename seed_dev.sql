--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2 (Ubuntu 17.2-1.pgdg24.04+1)

-- Started on 2025-02-11 19:22:47 CST

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

-- DROP DATABASE IF EXISTS apolis;
--
-- TOC entry 4360 (class 1262 OID 16415)
-- Name: apolis; Type: DATABASE; Schema: -; Owner: -
--

-- CREATE DATABASE apolis WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


\connect apolis

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
-- TOC entry 229 (class 1255 OID 16692)
-- Name: set_timestamp_based_on_status(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_timestamp_based_on_status() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
    -- Check if the status column is being updated
    IF NEW.status <> OLD.status THEN
        -- Update the field based on the new status value
        IF NEW.status = 'Slotted' THEN
            NEW.slotted_at = CURRENT_TIMESTAMP;
        ELSIF NEW.status = 'Completed' THEN
            NEW.completed_at = CURRENT_TIMESTAMP;
        ELSIF NEW.status = 'Queued' THEN
            NEW.queued_at = CURRENT_TIMESTAMP;
        END IF;
    END IF;

    -- Return the modified row
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16611)
-- Name: guest_notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guest_notifications (
    notification_id integer NOT NULL,
    guest_id integer NOT NULL,
    message character varying NOT NULL,
    status character varying DEFAULT 'Active'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 221 (class 1259 OID 16610)
-- Name: guest_notifications_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.guest_notifications_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4361 (class 0 OID 0)
-- Dependencies: 221
-- Name: guest_notifications_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.guest_notifications_notification_id_seq OWNED BY public.guest_notifications.notification_id;


--
-- TOC entry 218 (class 1259 OID 16577)
-- Name: guest_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guest_services (
    guest_service_id integer NOT NULL,
    guest_id integer NOT NULL,
    service_id integer NOT NULL,
    slot_id integer,
    status character varying DEFAULT 'Queued'::character varying NOT NULL,
    queued_at timestamp with time zone DEFAULT now(),
    slotted_at timestamp with time zone,
    completed_at timestamp with time zone
);


--
-- TOC entry 217 (class 1259 OID 16576)
-- Name: guest_services_guest_service_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.guest_services_guest_service_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4362 (class 0 OID 0)
-- Dependencies: 217
-- Name: guest_services_guest_service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.guest_services_guest_service_id_seq OWNED BY public.guest_services.guest_service_id;


--
-- TOC entry 224 (class 1259 OID 16623)
-- Name: guests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guests (
    guest_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    first_name character varying,
    last_name character varying,
    dob date,
    case_manager character varying
);


--
-- TOC entry 223 (class 1259 OID 16622)
-- Name: guests_guest_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.guests_guest_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4363 (class 0 OID 0)
-- Dependencies: 223
-- Name: guests_guest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.guests_guest_id_seq OWNED BY public.guests.guest_id;


--
-- TOC entry 228 (class 1259 OID 16677)
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    service_id integer NOT NULL,
    name character varying,
    quota integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 227 (class 1259 OID 16676)
-- Name: service_types_service_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.service_types_service_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4364 (class 0 OID 0)
-- Dependencies: 227
-- Name: service_types_service_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.service_types_service_type_id_seq OWNED BY public.services.service_id;


--
-- TOC entry 226 (class 1259 OID 16634)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    email character varying NOT NULL,
    name character varying,
    role character varying,
    sub character varying NOT NULL
);


--
-- TOC entry 225 (class 1259 OID 16633)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4365 (class 0 OID 0)
-- Dependencies: 225
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 220 (class 1259 OID 16589)
-- Name: visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visits (
    visit_id integer NOT NULL,
    guest_id integer NOT NULL,
    service_ids jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 219 (class 1259 OID 16588)
-- Name: visits_visit_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.visits_visit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4366 (class 0 OID 0)
-- Dependencies: 219
-- Name: visits_visit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.visits_visit_id_seq OWNED BY public.visits.visit_id;


--
-- TOC entry 4179 (class 2604 OID 16614)
-- Name: guest_notifications notification_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guest_notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.guest_notifications_notification_id_seq'::regclass);


--
-- TOC entry 4173 (class 2604 OID 16580)
-- Name: guest_services guest_service_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guest_services ALTER COLUMN guest_service_id SET DEFAULT nextval('public.guest_services_guest_service_id_seq'::regclass);


--
-- TOC entry 4183 (class 2604 OID 16626)
-- Name: guests guest_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guests ALTER COLUMN guest_id SET DEFAULT nextval('public.guests_guest_id_seq'::regclass);


--
-- TOC entry 4189 (class 2604 OID 16680)
-- Name: services service_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services ALTER COLUMN service_id SET DEFAULT nextval('public.service_types_service_type_id_seq'::regclass);


--
-- TOC entry 4186 (class 2604 OID 16637)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4176 (class 2604 OID 16592)
-- Name: visits visit_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits ALTER COLUMN visit_id SET DEFAULT nextval('public.visits_visit_id_seq'::regclass);


--
-- TOC entry 4199 (class 2606 OID 16621)
-- Name: guest_notifications guest_notifications_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guest_notifications
    ADD CONSTRAINT guest_notifications_pk PRIMARY KEY (notification_id);


--
-- TOC entry 4194 (class 2606 OID 16585)
-- Name: guest_services guest_services_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guest_services
    ADD CONSTRAINT guest_services_pk PRIMARY KEY (guest_service_id);


--
-- TOC entry 4201 (class 2606 OID 16632)
-- Name: guests guests_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guests
    ADD CONSTRAINT guests_pk PRIMARY KEY (guest_id);


--
-- TOC entry 4205 (class 2606 OID 16686)
-- Name: services service_types_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT service_types_pk PRIMARY KEY (service_id);


--
-- TOC entry 4203 (class 2606 OID 16643)
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY (user_id);


--
-- TOC entry 4197 (class 2606 OID 16598)
-- Name: visits visits_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_pk PRIMARY KEY (visit_id);


--
-- TOC entry 4192 (class 1259 OID 16586)
-- Name: guest_services_guest_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX guest_services_guest_id_idx ON public.guest_services USING btree (guest_id);


--
-- TOC entry 4195 (class 1259 OID 16587)
-- Name: guest_services_service_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX guest_services_service_id_idx ON public.guest_services USING btree (service_id);


--
-- TOC entry 4209 (class 2620 OID 16693)
-- Name: guest_services trigger_set_timestamp_on_status_change; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_set_timestamp_on_status_change BEFORE UPDATE ON public.guest_services FOR EACH ROW WHEN (((old.status)::text IS DISTINCT FROM (new.status)::text)) EXECUTE FUNCTION public.set_timestamp_based_on_status();


--
-- TOC entry 4208 (class 2606 OID 16645)
-- Name: guest_notifications guest_notifications_guests_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guest_notifications
    ADD CONSTRAINT guest_notifications_guests_fk FOREIGN KEY (guest_id) REFERENCES public.guests(guest_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4206 (class 2606 OID 16655)
-- Name: guest_services guest_services_guests_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guest_services
    ADD CONSTRAINT guest_services_guests_fk FOREIGN KEY (guest_id) REFERENCES public.guests(guest_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4207 (class 2606 OID 16650)
-- Name: visits visits_guests_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_guests_fk FOREIGN KEY (guest_id) REFERENCES public.guests(guest_id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2025-02-11 19:22:51 CST

--
-- PostgreSQL database dump complete
--


INSERT INTO public.users (email, role, sub) VALUES
 ('admin@apolis.dev', 'admin', 'somesub1'),
 ('manager@apolis.dev', 'manager', 'somesub2');

INSERT INTO public.services (name, quota) VALUES
 ('Service 1', 10),
 ('Service 2', 20),
 ('Service 3', 30);

INSERT INTO public.guests (first_name, last_name, dob, case_manager) VALUES
 ('John', 'Doe', '1990-01-01', 'Case Manager 1'),
 ('Jane', 'Doe', '1995-01-01', 'Case Manager 2');

INSERT INTO public.guest_services (guest_id, service_id, status) VALUES
 (1, 1, 'Queued'),
 (1, 2, 'Slotted'),
 (2, 3, 'Completed');
