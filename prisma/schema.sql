--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: Status; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public."Status" AS ENUM (
    'отправлено',
    'одобрено',
    'отклонено'
);


ALTER TYPE public."Status" OWNER TO "default";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO "default";

--
-- Name: add_story_requests; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.add_story_requests (
    id integer NOT NULL,
    story_name character varying(255) NOT NULL,
    comment text DEFAULT ''::text NOT NULL,
    user_id integer NOT NULL,
    status public."Status" DEFAULT 'отправлено'::public."Status" NOT NULL
);


ALTER TABLE public.add_story_requests OWNER TO "default";

--
-- Name: add_story_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.add_story_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.add_story_requests_id_seq OWNER TO "default";

--
-- Name: add_story_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.add_story_requests_id_seq OWNED BY public.add_story_requests.id;


--
-- Name: audios_rating; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.audios_rating (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    story_audio_id integer NOT NULL,
    rating double precision NOT NULL
);


ALTER TABLE public.audios_rating OWNER TO "default";

--
-- Name: audios_rating_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.audios_rating_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audios_rating_id_seq OWNER TO "default";

--
-- Name: audios_rating_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.audios_rating_id_seq OWNED BY public.audios_rating.id;


--
-- Name: constituents_rf; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.constituents_rf (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.constituents_rf OWNER TO "default";

--
-- Name: constituents_rf_ethnic_groups; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.constituents_rf_ethnic_groups (
    id integer NOT NULL,
    ethnic_group_id integer NOT NULL,
    constituent_rf_id integer NOT NULL
);


ALTER TABLE public.constituents_rf_ethnic_groups OWNER TO "default";

--
-- Name: constituents_rf_ethnic_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.constituents_rf_ethnic_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.constituents_rf_ethnic_groups_id_seq OWNER TO "default";

--
-- Name: constituents_rf_ethnic_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.constituents_rf_ethnic_groups_id_seq OWNED BY public.constituents_rf_ethnic_groups.id;


--
-- Name: constituents_rf_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.constituents_rf_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.constituents_rf_id_seq OWNER TO "default";

--
-- Name: constituents_rf_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.constituents_rf_id_seq OWNED BY public.constituents_rf.id;


--
-- Name: ethnic_group_map_points; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.ethnic_group_map_points (
    id integer NOT NULL,
    ethnic_group_id integer NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    constituent_id integer NOT NULL
);


ALTER TABLE public.ethnic_group_map_points OWNER TO "default";

--
-- Name: ethnic_group_map_points_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.ethnic_group_map_points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ethnic_group_map_points_id_seq OWNER TO "default";

--
-- Name: ethnic_group_map_points_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.ethnic_group_map_points_id_seq OWNED BY public.ethnic_group_map_points.id;


--
-- Name: ethnic_groups; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.ethnic_groups (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    language_id integer NOT NULL
);


ALTER TABLE public.ethnic_groups OWNER TO "default";

--
-- Name: ethnic_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.ethnic_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ethnic_groups_id_seq OWNER TO "default";

--
-- Name: ethnic_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.ethnic_groups_id_seq OWNED BY public.ethnic_groups.id;


--
-- Name: img_story; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.img_story (
    id integer NOT NULL,
    filename text NOT NULL,
    path text NOT NULL,
    story_id integer NOT NULL
);


ALTER TABLE public.img_story OWNER TO "default";

--
-- Name: img_story_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.img_story_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.img_story_id_seq OWNER TO "default";

--
-- Name: img_story_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.img_story_id_seq OWNED BY public.img_story.id;


--
-- Name: languages; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.languages (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.languages OWNER TO "default";

--
-- Name: languages_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.languages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.languages_id_seq OWNER TO "default";

--
-- Name: languages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.languages_id_seq OWNED BY public.languages.id;


--
-- Name: stories; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.stories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    ethnic_group_id integer NOT NULL,
    audio_id integer
);


ALTER TABLE public.stories OWNER TO "default";

--
-- Name: stories_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.stories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stories_id_seq OWNER TO "default";

--
-- Name: stories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.stories_id_seq OWNED BY public.stories.id;


--
-- Name: story_audio_requests; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.story_audio_requests (
    id integer NOT NULL,
    type_id integer NOT NULL,
    comment text DEFAULT ''::text NOT NULL,
    "userId" integer NOT NULL,
    user_audio_id integer NOT NULL,
    status public."Status" DEFAULT 'отправлено'::public."Status" NOT NULL,
    "storyId" integer NOT NULL
);


ALTER TABLE public.story_audio_requests OWNER TO "default";

--
-- Name: story_audio_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.story_audio_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.story_audio_requests_id_seq OWNER TO "default";

--
-- Name: story_audio_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.story_audio_requests_id_seq OWNED BY public.story_audio_requests.id;


--
-- Name: story_audios; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.story_audios (
    id integer NOT NULL,
    author integer NOT NULL,
    user_audio_id integer NOT NULL,
    "moderateScore" double precision NOT NULL,
    language_id integer NOT NULL
);


ALTER TABLE public.story_audios OWNER TO "default";

--
-- Name: story_audios_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.story_audios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.story_audios_id_seq OWNER TO "default";

--
-- Name: story_audios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.story_audios_id_seq OWNED BY public.story_audios.id;


--
-- Name: text_stories; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.text_stories (
    id integer NOT NULL,
    text text NOT NULL,
    story_id integer NOT NULL
);


ALTER TABLE public.text_stories OWNER TO "default";

--
-- Name: text_stories_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.text_stories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.text_stories_id_seq OWNER TO "default";

--
-- Name: text_stories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.text_stories_id_seq OWNED BY public.text_stories.id;


--
-- Name: type_requests; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.type_requests (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.type_requests OWNER TO "default";

--
-- Name: type_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.type_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.type_requests_id_seq OWNER TO "default";

--
-- Name: type_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.type_requests_id_seq OWNED BY public.type_requests.id;


--
-- Name: user_audio_story; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.user_audio_story (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    user_id integer NOT NULL,
    language_id integer NOT NULL,
    "pathAudio" character varying(255) NOT NULL
);


ALTER TABLE public.user_audio_story OWNER TO "default";

--
-- Name: user_audio_story_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.user_audio_story_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_audio_story_id_seq OWNER TO "default";

--
-- Name: user_audio_story_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.user_audio_story_id_seq OWNED BY public.user_audio_story.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.users (
    id integer NOT NULL,
    role character varying(64) NOT NULL,
    email character varying(128) NOT NULL,
    password_hash text NOT NULL,
    refresh_token_hash character varying(255),
    first_name character varying(64) NOT NULL,
    last_name character varying(64) NOT NULL
);


ALTER TABLE public.users OWNER TO "default";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO "default";

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: add_story_requests id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.add_story_requests ALTER COLUMN id SET DEFAULT nextval('public.add_story_requests_id_seq'::regclass);


--
-- Name: audios_rating id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.audios_rating ALTER COLUMN id SET DEFAULT nextval('public.audios_rating_id_seq'::regclass);


--
-- Name: constituents_rf id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.constituents_rf ALTER COLUMN id SET DEFAULT nextval('public.constituents_rf_id_seq'::regclass);


--
-- Name: constituents_rf_ethnic_groups id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.constituents_rf_ethnic_groups ALTER COLUMN id SET DEFAULT nextval('public.constituents_rf_ethnic_groups_id_seq'::regclass);


--
-- Name: ethnic_group_map_points id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.ethnic_group_map_points ALTER COLUMN id SET DEFAULT nextval('public.ethnic_group_map_points_id_seq'::regclass);


--
-- Name: ethnic_groups id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.ethnic_groups ALTER COLUMN id SET DEFAULT nextval('public.ethnic_groups_id_seq'::regclass);


--
-- Name: img_story id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.img_story ALTER COLUMN id SET DEFAULT nextval('public.img_story_id_seq'::regclass);


--
-- Name: languages id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.languages ALTER COLUMN id SET DEFAULT nextval('public.languages_id_seq'::regclass);


--
-- Name: stories id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.stories ALTER COLUMN id SET DEFAULT nextval('public.stories_id_seq'::regclass);


--
-- Name: story_audio_requests id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.story_audio_requests ALTER COLUMN id SET DEFAULT nextval('public.story_audio_requests_id_seq'::regclass);


--
-- Name: story_audios id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.story_audios ALTER COLUMN id SET DEFAULT nextval('public.story_audios_id_seq'::regclass);


--
-- Name: text_stories id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.text_stories ALTER COLUMN id SET DEFAULT nextval('public.text_stories_id_seq'::regclass);


--
-- Name: type_requests id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.type_requests ALTER COLUMN id SET DEFAULT nextval('public.type_requests_id_seq'::regclass);


--
-- Name: user_audio_story id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.user_audio_story ALTER COLUMN id SET DEFAULT nextval('public.user_audio_story_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: add_story_requests add_story_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.add_story_requests
    ADD CONSTRAINT add_story_requests_pkey PRIMARY KEY (id);


--
-- Name: audios_rating audios_rating_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.audios_rating
    ADD CONSTRAINT audios_rating_pkey PRIMARY KEY (id);


--
-- Name: constituents_rf_ethnic_groups constituents_rf_ethnic_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.constituents_rf_ethnic_groups
    ADD CONSTRAINT constituents_rf_ethnic_groups_pkey PRIMARY KEY (id);


--
-- Name: constituents_rf constituents_rf_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.constituents_rf
    ADD CONSTRAINT constituents_rf_pkey PRIMARY KEY (id);


--
-- Name: ethnic_group_map_points ethnic_group_map_points_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.ethnic_group_map_points
    ADD CONSTRAINT ethnic_group_map_points_pkey PRIMARY KEY (id);


--
-- Name: ethnic_groups ethnic_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.ethnic_groups
    ADD CONSTRAINT ethnic_groups_pkey PRIMARY KEY (id);


--
-- Name: img_story img_story_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.img_story
    ADD CONSTRAINT img_story_pkey PRIMARY KEY (id);


--
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (id);


--
-- Name: stories stories_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_pkey PRIMARY KEY (id);


--
-- Name: story_audio_requests story_audio_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.story_audio_requests
    ADD CONSTRAINT story_audio_requests_pkey PRIMARY KEY (id);


--
-- Name: story_audios story_audios_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.story_audios
    ADD CONSTRAINT story_audios_pkey PRIMARY KEY (id);


--
-- Name: text_stories text_stories_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.text_stories
    ADD CONSTRAINT text_stories_pkey PRIMARY KEY (id);


--
-- Name: type_requests type_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.type_requests
    ADD CONSTRAINT type_requests_pkey PRIMARY KEY (id);


--
-- Name: user_audio_story user_audio_story_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.user_audio_story
    ADD CONSTRAINT user_audio_story_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: constituents_rf_name_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX constituents_rf_name_key ON public.constituents_rf USING btree (name);


--
-- Name: ethnic_groups_language_id_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX ethnic_groups_language_id_key ON public.ethnic_groups USING btree (language_id);


--
-- Name: ethnic_groups_name_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX ethnic_groups_name_key ON public.ethnic_groups USING btree (name);


--
-- Name: img_story_story_id_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX img_story_story_id_key ON public.img_story USING btree (story_id);


--
-- Name: languages_name_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX languages_name_key ON public.languages USING btree (name);


--
-- Name: stories_audio_id_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX stories_audio_id_key ON public.stories USING btree (audio_id);


--
-- Name: stories_name_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX stories_name_key ON public.stories USING btree (name);


--
-- Name: story_audios_user_audio_id_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX story_audios_user_audio_id_key ON public.story_audios USING btree (user_audio_id);


--
-- Name: text_stories_story_id_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX text_stories_story_id_key ON public.text_stories USING btree (story_id);


--
-- Name: type_requests_name_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX type_requests_name_key ON public.type_requests USING btree (name);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_first_name_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX users_first_name_key ON public.users USING btree (first_name);


--
-- Name: users_last_name_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX users_last_name_key ON public.users USING btree (last_name);


--
-- Name: add_story_requests add_story_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.add_story_requests
    ADD CONSTRAINT add_story_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: audios_rating audios_rating_story_audio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.audios_rating
    ADD CONSTRAINT audios_rating_story_audio_id_fkey FOREIGN KEY (story_audio_id) REFERENCES public.story_audios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: audios_rating audios_rating_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.audios_rating
    ADD CONSTRAINT "audios_rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: constituents_rf_ethnic_groups constituents_rf_ethnic_groups_constituent_rf_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.constituents_rf_ethnic_groups
    ADD CONSTRAINT constituents_rf_ethnic_groups_constituent_rf_id_fkey FOREIGN KEY (constituent_rf_id) REFERENCES public.constituents_rf(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: constituents_rf_ethnic_groups constituents_rf_ethnic_groups_ethnic_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.constituents_rf_ethnic_groups
    ADD CONSTRAINT constituents_rf_ethnic_groups_ethnic_group_id_fkey FOREIGN KEY (ethnic_group_id) REFERENCES public.ethnic_groups(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ethnic_group_map_points ethnic_group_map_points_constituent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.ethnic_group_map_points
    ADD CONSTRAINT ethnic_group_map_points_constituent_id_fkey FOREIGN KEY (constituent_id) REFERENCES public.constituents_rf(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ethnic_group_map_points ethnic_group_map_points_ethnic_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.ethnic_group_map_points
    ADD CONSTRAINT ethnic_group_map_points_ethnic_group_id_fkey FOREIGN KEY (ethnic_group_id) REFERENCES public.ethnic_groups(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ethnic_groups ethnic_groups_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.ethnic_groups
    ADD CONSTRAINT ethnic_groups_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: img_story img_story_story_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.img_story
    ADD CONSTRAINT img_story_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.stories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: stories stories_audio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_audio_id_fkey FOREIGN KEY (audio_id) REFERENCES public.story_audios(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: stories stories_ethnic_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_ethnic_group_id_fkey FOREIGN KEY (ethnic_group_id) REFERENCES public.ethnic_groups(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: story_audio_requests story_audio_requests_storyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.story_audio_requests
    ADD CONSTRAINT "story_audio_requests_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES public.stories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: story_audio_requests story_audio_requests_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.story_audio_requests
    ADD CONSTRAINT story_audio_requests_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.type_requests(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: story_audio_requests story_audio_requests_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.story_audio_requests
    ADD CONSTRAINT "story_audio_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: story_audio_requests story_audio_requests_user_audio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.story_audio_requests
    ADD CONSTRAINT story_audio_requests_user_audio_id_fkey FOREIGN KEY (user_audio_id) REFERENCES public.user_audio_story(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: story_audios story_audios_author_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.story_audios
    ADD CONSTRAINT story_audios_author_fkey FOREIGN KEY (author) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: story_audios story_audios_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.story_audios
    ADD CONSTRAINT story_audios_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: story_audios story_audios_user_audio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.story_audios
    ADD CONSTRAINT story_audios_user_audio_id_fkey FOREIGN KEY (user_audio_id) REFERENCES public.user_audio_story(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: text_stories text_stories_story_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.text_stories
    ADD CONSTRAINT text_stories_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.stories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: user_audio_story user_audio_story_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.user_audio_story
    ADD CONSTRAINT user_audio_story_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: user_audio_story user_audio_story_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.user_audio_story
    ADD CONSTRAINT user_audio_story_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

