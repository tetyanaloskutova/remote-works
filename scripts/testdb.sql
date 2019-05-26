--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.2
-- Dumped by pg_dump version 9.6.2

-- Started on 2019-05-26 20:54:20

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 201 (class 1259 OID 16477)
-- Name: account_address; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE account_address (
    id integer NOT NULL,
    first_name character varying(256) NOT NULL,
    last_name character varying(256) NOT NULL,
    company_name character varying(256) NOT NULL,
    street_address_1 character varying(256) NOT NULL,
    street_address_2 character varying(256) NOT NULL,
    city character varying(256) NOT NULL,
    postal_code character varying(20) NOT NULL,
    country character varying(2) NOT NULL,
    country_area character varying(128) NOT NULL,
    phone character varying(128) NOT NULL,
    city_area character varying(128) NOT NULL
);


ALTER TABLE account_address OWNER TO remote_works;

--
-- TOC entry 209 (class 1259 OID 16615)
-- Name: account_customernote; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE account_customernote (
    id integer NOT NULL,
    date timestamp with time zone NOT NULL,
    content text NOT NULL,
    is_public boolean NOT NULL,
    customer_id integer NOT NULL,
    user_id integer
);


ALTER TABLE account_customernote OWNER TO remote_works;

--
-- TOC entry 208 (class 1259 OID 16613)
-- Name: account_customernote_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE account_customernote_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE account_customernote_id_seq OWNER TO remote_works;

--
-- TOC entry 3469 (class 0 OID 0)
-- Dependencies: 208
-- Name: account_customernote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE account_customernote_id_seq OWNED BY account_customernote.id;


--
-- TOC entry 322 (class 1259 OID 28213)
-- Name: account_schedule; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE account_schedule (
    days_of_week character varying(128) NOT NULL,
    owner_id integer,
    id integer NOT NULL,
    time_slot_end time without time zone,
    time_slot_start time without time zone
);


ALTER TABLE account_schedule OWNER TO remote_works;

--
-- TOC entry 323 (class 1259 OID 28227)
-- Name: account_schedule_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE account_schedule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE account_schedule_id_seq OWNER TO remote_works;

--
-- TOC entry 3470 (class 0 OID 0)
-- Dependencies: 323
-- Name: account_schedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE account_schedule_id_seq OWNED BY account_schedule.id;


--
-- TOC entry 199 (class 1259 OID 16467)
-- Name: account_user; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE account_user (
    id integer NOT NULL,
    is_superuser boolean NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    password character varying(128) NOT NULL,
    date_joined timestamp with time zone NOT NULL,
    last_login timestamp with time zone,
    default_billing_address_id integer,
    default_delivery_address_id integer,
    note text,
    token uuid NOT NULL,
    first_name character varying(256) NOT NULL,
    last_name character varying(256) NOT NULL,
    is_employer boolean NOT NULL
);


ALTER TABLE account_user OWNER TO remote_works;

--
-- TOC entry 203 (class 1259 OID 16488)
-- Name: account_user_addresses; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE account_user_addresses (
    id integer NOT NULL,
    user_id integer NOT NULL,
    address_id integer NOT NULL
);


ALTER TABLE account_user_addresses OWNER TO remote_works;

--
-- TOC entry 205 (class 1259 OID 16496)
-- Name: account_user_groups; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE account_user_groups (
    id integer NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE account_user_groups OWNER TO remote_works;

--
-- TOC entry 207 (class 1259 OID 16504)
-- Name: account_user_user_permissions; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE account_user_user_permissions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE account_user_user_permissions OWNER TO remote_works;

--
-- TOC entry 195 (class 1259 OID 16426)
-- Name: auth_group; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE auth_group (
    id integer NOT NULL,
    name character varying(80) NOT NULL
);


ALTER TABLE auth_group OWNER TO remote_works;

--
-- TOC entry 194 (class 1259 OID 16424)
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE auth_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE auth_group_id_seq OWNER TO remote_works;

--
-- TOC entry 3471 (class 0 OID 0)
-- Dependencies: 194
-- Name: auth_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE auth_group_id_seq OWNED BY auth_group.id;


--
-- TOC entry 197 (class 1259 OID 16436)
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE auth_group_permissions (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE auth_group_permissions OWNER TO remote_works;

--
-- TOC entry 196 (class 1259 OID 16434)
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE auth_group_permissions_id_seq OWNER TO remote_works;

--
-- TOC entry 3472 (class 0 OID 0)
-- Dependencies: 196
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE auth_group_permissions_id_seq OWNED BY auth_group_permissions.id;


--
-- TOC entry 193 (class 1259 OID 16418)
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


ALTER TABLE auth_permission OWNER TO remote_works;

--
-- TOC entry 192 (class 1259 OID 16416)
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE auth_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE auth_permission_id_seq OWNER TO remote_works;

--
-- TOC entry 3473 (class 0 OID 0)
-- Dependencies: 192
-- Name: auth_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE auth_permission_id_seq OWNED BY auth_permission.id;


--
-- TOC entry 236 (class 1259 OID 17085)
-- Name: checkout_cartline; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE checkout_cartline (
    id integer NOT NULL,
    quantity integer NOT NULL,
    cart_id uuid NOT NULL,
    variant_id integer NOT NULL,
    data jsonb NOT NULL,
    CONSTRAINT cart_cartline_quantity_check CHECK ((quantity >= 0))
);


ALTER TABLE checkout_cartline OWNER TO remote_works;

--
-- TOC entry 235 (class 1259 OID 17083)
-- Name: cart_cartline_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE cart_cartline_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE cart_cartline_id_seq OWNER TO remote_works;

--
-- TOC entry 3474 (class 0 OID 0)
-- Dependencies: 235
-- Name: cart_cartline_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE cart_cartline_id_seq OWNED BY checkout_cartline.id;


--
-- TOC entry 234 (class 1259 OID 17074)
-- Name: checkout_cart; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE checkout_cart (
    created timestamp with time zone NOT NULL,
    last_change timestamp with time zone NOT NULL,
    email character varying(254) NOT NULL,
    token uuid NOT NULL,
    quantity integer NOT NULL,
    user_id integer,
    billing_address_id integer,
    discount_amount numeric(12,2) NOT NULL,
    discount_name character varying(255),
    note text NOT NULL,
    delivery_address_id integer,
    delivery_method_id integer,
    voucher_code character varying(12),
    translated_discount_name character varying(255),
    CONSTRAINT cart_cart_quantity_check CHECK ((quantity >= 0))
);


ALTER TABLE checkout_cart OWNER TO remote_works;

--
-- TOC entry 211 (class 1259 OID 16692)
-- Name: delivery_deliverymethod; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE delivery_deliverymethod (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    maximum_task_price numeric(12,2),
    maximum_task_weight double precision,
    minimum_task_price numeric(12,2),
    minimum_task_weight double precision,
    price numeric(12,2) NOT NULL,
    type character varying(30) NOT NULL,
    delivery_zone_id integer NOT NULL
);


ALTER TABLE delivery_deliverymethod OWNER TO remote_works;

--
-- TOC entry 309 (class 1259 OID 19792)
-- Name: delivery_deliverymethodtranslation; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE delivery_deliverymethodtranslation (
    id integer NOT NULL,
    language_code character varying(10) NOT NULL,
    name character varying(255),
    delivery_method_id integer NOT NULL
);


ALTER TABLE delivery_deliverymethodtranslation OWNER TO remote_works;

--
-- TOC entry 311 (class 1259 OID 19800)
-- Name: delivery_deliveryzone; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE delivery_deliveryzone (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    countries character varying(749) NOT NULL,
    "default" boolean NOT NULL
);


ALTER TABLE delivery_deliveryzone OWNER TO remote_works;

--
-- TOC entry 227 (class 1259 OID 16999)
-- Name: discount_sale; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE discount_sale (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(10) NOT NULL,
    value numeric(12,2) NOT NULL,
    end_date date,
    start_date date NOT NULL
);


ALTER TABLE discount_sale OWNER TO remote_works;

--
-- TOC entry 229 (class 1259 OID 17007)
-- Name: discount_sale_categories; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE discount_sale_categories (
    id integer NOT NULL,
    sale_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE discount_sale_categories OWNER TO remote_works;

--
-- TOC entry 228 (class 1259 OID 17005)
-- Name: discount_sale_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE discount_sale_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE discount_sale_categories_id_seq OWNER TO remote_works;

--
-- TOC entry 3475 (class 0 OID 0)
-- Dependencies: 228
-- Name: discount_sale_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE discount_sale_categories_id_seq OWNED BY discount_sale_categories.id;


--
-- TOC entry 252 (class 1259 OID 18763)
-- Name: discount_sale_collections; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE discount_sale_collections (
    id integer NOT NULL,
    sale_id integer NOT NULL,
    collection_id integer NOT NULL
);


ALTER TABLE discount_sale_collections OWNER TO remote_works;

--
-- TOC entry 251 (class 1259 OID 18761)
-- Name: discount_sale_collections_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE discount_sale_collections_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE discount_sale_collections_id_seq OWNER TO remote_works;

--
-- TOC entry 3476 (class 0 OID 0)
-- Dependencies: 251
-- Name: discount_sale_collections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE discount_sale_collections_id_seq OWNED BY discount_sale_collections.id;


--
-- TOC entry 226 (class 1259 OID 16997)
-- Name: discount_sale_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE discount_sale_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE discount_sale_id_seq OWNER TO remote_works;

--
-- TOC entry 3477 (class 0 OID 0)
-- Dependencies: 226
-- Name: discount_sale_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE discount_sale_id_seq OWNED BY discount_sale.id;


--
-- TOC entry 231 (class 1259 OID 17015)
-- Name: discount_sale_skills; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE discount_sale_skills (
    id integer NOT NULL,
    sale_id integer NOT NULL,
    skill_id integer NOT NULL
);


ALTER TABLE discount_sale_skills OWNER TO remote_works;

--
-- TOC entry 230 (class 1259 OID 17013)
-- Name: discount_sale_products_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE discount_sale_products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE discount_sale_products_id_seq OWNER TO remote_works;

--
-- TOC entry 3478 (class 0 OID 0)
-- Dependencies: 230
-- Name: discount_sale_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE discount_sale_products_id_seq OWNED BY discount_sale_skills.id;


--
-- TOC entry 233 (class 1259 OID 17051)
-- Name: discount_voucher; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE discount_voucher (
    id integer NOT NULL,
    type character varying(20) NOT NULL,
    name character varying(255),
    code character varying(12) NOT NULL,
    usage_limit integer,
    used integer NOT NULL,
    start_date date NOT NULL,
    end_date date,
    discount_value_type character varying(10) NOT NULL,
    discount_value numeric(12,2) NOT NULL,
    min_amount_spent numeric(12,2),
    apply_once_per_order boolean NOT NULL,
    countries character varying(749) NOT NULL,
    CONSTRAINT discount_voucher_usage_limit_check CHECK ((usage_limit >= 0)),
    CONSTRAINT discount_voucher_used_check CHECK ((used >= 0))
);


ALTER TABLE discount_voucher OWNER TO remote_works;

--
-- TOC entry 254 (class 1259 OID 18797)
-- Name: discount_voucher_categories; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE discount_voucher_categories (
    id integer NOT NULL,
    voucher_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE discount_voucher_categories OWNER TO remote_works;

--
-- TOC entry 253 (class 1259 OID 18795)
-- Name: discount_voucher_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE discount_voucher_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE discount_voucher_categories_id_seq OWNER TO remote_works;

--
-- TOC entry 3479 (class 0 OID 0)
-- Dependencies: 253
-- Name: discount_voucher_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE discount_voucher_categories_id_seq OWNED BY discount_voucher_categories.id;


--
-- TOC entry 256 (class 1259 OID 18805)
-- Name: discount_voucher_collections; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE discount_voucher_collections (
    id integer NOT NULL,
    voucher_id integer NOT NULL,
    collection_id integer NOT NULL
);


ALTER TABLE discount_voucher_collections OWNER TO remote_works;

--
-- TOC entry 255 (class 1259 OID 18803)
-- Name: discount_voucher_collections_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE discount_voucher_collections_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE discount_voucher_collections_id_seq OWNER TO remote_works;

--
-- TOC entry 3480 (class 0 OID 0)
-- Dependencies: 255
-- Name: discount_voucher_collections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE discount_voucher_collections_id_seq OWNED BY discount_voucher_collections.id;


--
-- TOC entry 232 (class 1259 OID 17049)
-- Name: discount_voucher_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE discount_voucher_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE discount_voucher_id_seq OWNER TO remote_works;

--
-- TOC entry 3481 (class 0 OID 0)
-- Dependencies: 232
-- Name: discount_voucher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE discount_voucher_id_seq OWNED BY discount_voucher.id;


--
-- TOC entry 258 (class 1259 OID 18826)
-- Name: discount_voucher_skills; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE discount_voucher_skills (
    id integer NOT NULL,
    voucher_id integer NOT NULL,
    skill_id integer NOT NULL
);


ALTER TABLE discount_voucher_skills OWNER TO remote_works;

--
-- TOC entry 257 (class 1259 OID 18824)
-- Name: discount_voucher_products_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE discount_voucher_products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE discount_voucher_products_id_seq OWNER TO remote_works;

--
-- TOC entry 3482 (class 0 OID 0)
-- Dependencies: 257
-- Name: discount_voucher_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE discount_voucher_products_id_seq OWNED BY discount_voucher_skills.id;


--
-- TOC entry 260 (class 1259 OID 18876)
-- Name: discount_vouchertranslation; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE discount_vouchertranslation (
    id integer NOT NULL,
    language_code character varying(10) NOT NULL,
    name character varying(255),
    voucher_id integer NOT NULL
);


ALTER TABLE discount_vouchertranslation OWNER TO remote_works;

--
-- TOC entry 259 (class 1259 OID 18874)
-- Name: discount_vouchertranslation_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE discount_vouchertranslation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE discount_vouchertranslation_id_seq OWNER TO remote_works;

--
-- TOC entry 3483 (class 0 OID 0)
-- Dependencies: 259
-- Name: discount_vouchertranslation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE discount_vouchertranslation_id_seq OWNED BY discount_vouchertranslation.id;


--
-- TOC entry 262 (class 1259 OID 18892)
-- Name: django_celery_results_taskresult; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE django_celery_results_taskresult (
    id integer NOT NULL,
    task_id character varying(255) NOT NULL,
    status character varying(50) NOT NULL,
    content_type character varying(128) NOT NULL,
    content_encoding character varying(64) NOT NULL,
    result text,
    date_done timestamp with time zone NOT NULL,
    traceback text,
    hidden boolean NOT NULL,
    meta text,
    task_args text,
    task_kwargs text,
    task_name character varying(255)
);


ALTER TABLE django_celery_results_taskresult OWNER TO remote_works;

--
-- TOC entry 261 (class 1259 OID 18890)
-- Name: django_celery_results_taskresult_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE django_celery_results_taskresult_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE django_celery_results_taskresult_id_seq OWNER TO remote_works;

--
-- TOC entry 3484 (class 0 OID 0)
-- Dependencies: 261
-- Name: django_celery_results_taskresult_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE django_celery_results_taskresult_id_seq OWNED BY django_celery_results_taskresult.id;


--
-- TOC entry 191 (class 1259 OID 16408)
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL,
    name character varying(100)
);


ALTER TABLE django_content_type OWNER TO remote_works;

--
-- TOC entry 190 (class 1259 OID 16406)
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE django_content_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE django_content_type_id_seq OWNER TO remote_works;

--
-- TOC entry 3485 (class 0 OID 0)
-- Dependencies: 190
-- Name: django_content_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE django_content_type_id_seq OWNED BY django_content_type.id;


--
-- TOC entry 189 (class 1259 OID 16397)
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE django_migrations (
    id integer NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


ALTER TABLE django_migrations OWNER TO remote_works;

--
-- TOC entry 188 (class 1259 OID 16395)
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE django_migrations_id_seq OWNER TO remote_works;

--
-- TOC entry 3486 (class 0 OID 0)
-- Dependencies: 188
-- Name: django_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE django_migrations_id_seq OWNED BY django_migrations.id;


--
-- TOC entry 264 (class 1259 OID 18907)
-- Name: django_prices_openexchangerates_conversionrate; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE django_prices_openexchangerates_conversionrate (
    id integer NOT NULL,
    to_currency character varying(3) NOT NULL,
    rate numeric(20,12) NOT NULL,
    modified_at timestamp with time zone NOT NULL
);


ALTER TABLE django_prices_openexchangerates_conversionrate OWNER TO remote_works;

--
-- TOC entry 263 (class 1259 OID 18905)
-- Name: django_prices_openexchangerates_conversionrate_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE django_prices_openexchangerates_conversionrate_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE django_prices_openexchangerates_conversionrate_id_seq OWNER TO remote_works;

--
-- TOC entry 3487 (class 0 OID 0)
-- Dependencies: 263
-- Name: django_prices_openexchangerates_conversionrate_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE django_prices_openexchangerates_conversionrate_id_seq OWNED BY django_prices_openexchangerates_conversionrate.id;


--
-- TOC entry 268 (class 1259 OID 18941)
-- Name: django_prices_vatlayer_ratetypes; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE django_prices_vatlayer_ratetypes (
    id integer NOT NULL,
    types text NOT NULL
);


ALTER TABLE django_prices_vatlayer_ratetypes OWNER TO remote_works;

--
-- TOC entry 267 (class 1259 OID 18939)
-- Name: django_prices_vatlayer_ratetypes_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE django_prices_vatlayer_ratetypes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE django_prices_vatlayer_ratetypes_id_seq OWNER TO remote_works;

--
-- TOC entry 3488 (class 0 OID 0)
-- Dependencies: 267
-- Name: django_prices_vatlayer_ratetypes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE django_prices_vatlayer_ratetypes_id_seq OWNED BY django_prices_vatlayer_ratetypes.id;


--
-- TOC entry 266 (class 1259 OID 18930)
-- Name: django_prices_vatlayer_vat; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE django_prices_vatlayer_vat (
    id integer NOT NULL,
    country_code character varying(2) NOT NULL,
    data text NOT NULL
);


ALTER TABLE django_prices_vatlayer_vat OWNER TO remote_works;

--
-- TOC entry 265 (class 1259 OID 18928)
-- Name: django_prices_vatlayer_vat_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE django_prices_vatlayer_vat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE django_prices_vatlayer_vat_id_seq OWNER TO remote_works;

--
-- TOC entry 3489 (class 0 OID 0)
-- Dependencies: 265
-- Name: django_prices_vatlayer_vat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE django_prices_vatlayer_vat_id_seq OWNED BY django_prices_vatlayer_vat.id;


--
-- TOC entry 307 (class 1259 OID 19780)
-- Name: django_session; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


ALTER TABLE django_session OWNER TO remote_works;

--
-- TOC entry 288 (class 1259 OID 19330)
-- Name: django_site; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE django_site (
    id integer NOT NULL,
    domain character varying(100) NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE django_site OWNER TO remote_works;

--
-- TOC entry 287 (class 1259 OID 19328)
-- Name: django_site_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE django_site_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE django_site_id_seq OWNER TO remote_works;

--
-- TOC entry 3490 (class 0 OID 0)
-- Dependencies: 287
-- Name: django_site_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE django_site_id_seq OWNED BY django_site.id;


--
-- TOC entry 270 (class 1259 OID 18954)
-- Name: impersonate_impersonationlog; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE impersonate_impersonationlog (
    id integer NOT NULL,
    session_key character varying(40) NOT NULL,
    session_started_at timestamp with time zone,
    session_ended_at timestamp with time zone,
    impersonating_id integer NOT NULL,
    impersonator_id integer NOT NULL
);


ALTER TABLE impersonate_impersonationlog OWNER TO remote_works;

--
-- TOC entry 269 (class 1259 OID 18952)
-- Name: impersonate_impersonationlog_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE impersonate_impersonationlog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE impersonate_impersonationlog_id_seq OWNER TO remote_works;

--
-- TOC entry 3491 (class 0 OID 0)
-- Dependencies: 269
-- Name: impersonate_impersonationlog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE impersonate_impersonationlog_id_seq OWNED BY impersonate_impersonationlog.id;


--
-- TOC entry 274 (class 1259 OID 18988)
-- Name: menu_menu; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE menu_menu (
    id integer NOT NULL,
    name character varying(128) NOT NULL,
    json_content jsonb NOT NULL
);


ALTER TABLE menu_menu OWNER TO remote_works;

--
-- TOC entry 273 (class 1259 OID 18986)
-- Name: menu_menu_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE menu_menu_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE menu_menu_id_seq OWNER TO remote_works;

--
-- TOC entry 3492 (class 0 OID 0)
-- Dependencies: 273
-- Name: menu_menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE menu_menu_id_seq OWNED BY menu_menu.id;


--
-- TOC entry 276 (class 1259 OID 18998)
-- Name: menu_menuitem; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE menu_menuitem (
    id integer NOT NULL,
    name character varying(128) NOT NULL,
    sort_order integer NOT NULL,
    url character varying(256),
    lft integer NOT NULL,
    rght integer NOT NULL,
    tree_id integer NOT NULL,
    level integer NOT NULL,
    category_id integer,
    collection_id integer,
    menu_id integer NOT NULL,
    page_id integer,
    parent_id integer,
    CONSTRAINT menu_menuitem_level_check CHECK ((level >= 0)),
    CONSTRAINT menu_menuitem_lft_check CHECK ((lft >= 0)),
    CONSTRAINT menu_menuitem_rght_check CHECK ((rght >= 0)),
    CONSTRAINT menu_menuitem_sort_order_check CHECK ((sort_order >= 0)),
    CONSTRAINT menu_menuitem_tree_id_check CHECK ((tree_id >= 0))
);


ALTER TABLE menu_menuitem OWNER TO remote_works;

--
-- TOC entry 275 (class 1259 OID 18996)
-- Name: menu_menuitem_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE menu_menuitem_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE menu_menuitem_id_seq OWNER TO remote_works;

--
-- TOC entry 3493 (class 0 OID 0)
-- Dependencies: 275
-- Name: menu_menuitem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE menu_menuitem_id_seq OWNED BY menu_menuitem.id;


--
-- TOC entry 278 (class 1259 OID 19054)
-- Name: menu_menuitemtranslation; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE menu_menuitemtranslation (
    id integer NOT NULL,
    language_code character varying(10) NOT NULL,
    name character varying(128) NOT NULL,
    menu_item_id integer NOT NULL
);


ALTER TABLE menu_menuitemtranslation OWNER TO remote_works;

--
-- TOC entry 277 (class 1259 OID 19052)
-- Name: menu_menuitemtranslation_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE menu_menuitemtranslation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE menu_menuitemtranslation_id_seq OWNER TO remote_works;

--
-- TOC entry 3494 (class 0 OID 0)
-- Dependencies: 277
-- Name: menu_menuitemtranslation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE menu_menuitemtranslation_id_seq OWNED BY menu_menuitemtranslation.id;


--
-- TOC entry 248 (class 1259 OID 18523)
-- Name: task_fulfillment; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE task_fulfillment (
    id integer NOT NULL,
    tracking_number character varying(255) NOT NULL,
    shipping_date timestamp with time zone NOT NULL,
    order_id integer NOT NULL,
    fulfillment_order integer NOT NULL,
    status character varying(32) NOT NULL,
    CONSTRAINT order_fulfillment_fulfillment_order_check CHECK ((fulfillment_order >= 0))
);


ALTER TABLE task_fulfillment OWNER TO remote_works;

--
-- TOC entry 247 (class 1259 OID 18521)
-- Name: order_fulfillment_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE order_fulfillment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE order_fulfillment_id_seq OWNER TO remote_works;

--
-- TOC entry 3495 (class 0 OID 0)
-- Dependencies: 247
-- Name: order_fulfillment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE order_fulfillment_id_seq OWNED BY task_fulfillment.id;


--
-- TOC entry 250 (class 1259 OID 18532)
-- Name: task_fulfillmentline; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE task_fulfillmentline (
    id integer NOT NULL,
    order_line_id integer NOT NULL,
    quantity integer NOT NULL,
    fulfillment_id integer NOT NULL,
    CONSTRAINT order_fulfillmentline_quantity_81b787d3_check CHECK ((quantity >= 0))
);


ALTER TABLE task_fulfillmentline OWNER TO remote_works;

--
-- TOC entry 249 (class 1259 OID 18530)
-- Name: order_fulfillmentline_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE order_fulfillmentline_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE order_fulfillmentline_id_seq OWNER TO remote_works;

--
-- TOC entry 3496 (class 0 OID 0)
-- Dependencies: 249
-- Name: order_fulfillmentline_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE order_fulfillmentline_id_seq OWNED BY task_fulfillmentline.id;


--
-- TOC entry 244 (class 1259 OID 18129)
-- Name: task_task; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE task_task (
    id integer NOT NULL,
    created timestamp with time zone NOT NULL,
    tracking_client_id character varying(36) NOT NULL,
    user_email character varying(254) NOT NULL,
    token character varying(36) NOT NULL,
    billing_address_id integer,
    delivery_address_id integer,
    user_id integer,
    total_net numeric(12,2) NOT NULL,
    discount_amount numeric(12,2) NOT NULL,
    discount_name character varying(255) NOT NULL,
    voucher_id integer,
    language_code character varying(35) NOT NULL,
    delivery_price_gross numeric(12,2) NOT NULL,
    total_gross numeric(12,2) NOT NULL,
    delivery_price_net numeric(12,2) NOT NULL,
    status character varying(32) NOT NULL,
    delivery_method_name character varying(255),
    delivery_method_id integer,
    display_gross_prices boolean NOT NULL,
    translated_discount_name character varying(255) NOT NULL,
    customer_note text NOT NULL,
    weight double precision NOT NULL,
    checkout_token character varying(36) NOT NULL
);


ALTER TABLE task_task OWNER TO remote_works;

--
-- TOC entry 243 (class 1259 OID 18127)
-- Name: order_order_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE order_order_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE order_order_id_seq OWNER TO remote_works;

--
-- TOC entry 3497 (class 0 OID 0)
-- Dependencies: 243
-- Name: order_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE order_order_id_seq OWNED BY task_task.id;


--
-- TOC entry 246 (class 1259 OID 18142)
-- Name: task_taskline; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE task_taskline (
    id integer NOT NULL,
    skill_name character varying(386) NOT NULL,
    skill_sku character varying(32) NOT NULL,
    quantity integer NOT NULL,
    unit_price_net numeric(12,2) NOT NULL,
    unit_price_gross numeric(12,2) NOT NULL,
    is_delivery_required boolean NOT NULL,
    task_id integer NOT NULL,
    quantity_fulfilled integer NOT NULL,
    variant_id integer,
    tax_rate numeric(5,2) NOT NULL,
    translated_skill_name character varying(386) NOT NULL
);


ALTER TABLE task_taskline OWNER TO remote_works;

--
-- TOC entry 245 (class 1259 OID 18140)
-- Name: order_ordereditem_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE order_ordereditem_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE order_ordereditem_id_seq OWNER TO remote_works;

--
-- TOC entry 3498 (class 0 OID 0)
-- Dependencies: 245
-- Name: order_ordereditem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE order_ordereditem_id_seq OWNED BY task_taskline.id;


--
-- TOC entry 280 (class 1259 OID 19179)
-- Name: task_taskevent; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE task_taskevent (
    id integer NOT NULL,
    date timestamp with time zone NOT NULL,
    type character varying(255) NOT NULL,
    task_id integer NOT NULL,
    user_id integer,
    parameters jsonb NOT NULL
);


ALTER TABLE task_taskevent OWNER TO remote_works;

--
-- TOC entry 279 (class 1259 OID 19177)
-- Name: order_orderevent_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE order_orderevent_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE order_orderevent_id_seq OWNER TO remote_works;

--
-- TOC entry 3499 (class 0 OID 0)
-- Dependencies: 279
-- Name: order_orderevent_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE order_orderevent_id_seq OWNED BY task_taskevent.id;


--
-- TOC entry 272 (class 1259 OID 18974)
-- Name: page_page; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE page_page (
    id integer NOT NULL,
    slug character varying(100) NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    created timestamp with time zone NOT NULL,
    is_published boolean NOT NULL,
    publication_date date,
    seo_description character varying(300),
    seo_title character varying(70),
    content_json jsonb NOT NULL
);


ALTER TABLE page_page OWNER TO remote_works;

--
-- TOC entry 271 (class 1259 OID 18972)
-- Name: page_page_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE page_page_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE page_page_id_seq OWNER TO remote_works;

--
-- TOC entry 3500 (class 0 OID 0)
-- Dependencies: 271
-- Name: page_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE page_page_id_seq OWNED BY page_page.id;


--
-- TOC entry 286 (class 1259 OID 19276)
-- Name: page_pagetranslation; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE page_pagetranslation (
    id integer NOT NULL,
    seo_title character varying(70),
    seo_description character varying(300),
    language_code character varying(10) NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    page_id integer NOT NULL,
    content_json jsonb NOT NULL
);


ALTER TABLE page_pagetranslation OWNER TO remote_works;

--
-- TOC entry 285 (class 1259 OID 19274)
-- Name: page_pagetranslation_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE page_pagetranslation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE page_pagetranslation_id_seq OWNER TO remote_works;

--
-- TOC entry 3501 (class 0 OID 0)
-- Dependencies: 285
-- Name: page_pagetranslation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE page_pagetranslation_id_seq OWNED BY page_pagetranslation.id;


--
-- TOC entry 282 (class 1259 OID 19217)
-- Name: payment_payment; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE payment_payment (
    id integer NOT NULL,
    gateway character varying(255) NOT NULL,
    is_active boolean NOT NULL,
    created timestamp with time zone NOT NULL,
    modified timestamp with time zone NOT NULL,
    charge_status character varying(20) NOT NULL,
    billing_first_name character varying(256) NOT NULL,
    billing_last_name character varying(256) NOT NULL,
    billing_company_name character varying(256) NOT NULL,
    billing_address_1 character varying(256) NOT NULL,
    billing_address_2 character varying(256) NOT NULL,
    billing_city character varying(256) NOT NULL,
    billing_city_area character varying(128) NOT NULL,
    billing_postal_code character varying(256) NOT NULL,
    billing_country_code character varying(2) NOT NULL,
    billing_country_area character varying(256) NOT NULL,
    billing_email character varying(254) NOT NULL,
    customer_ip_address inet,
    cc_brand character varying(40) NOT NULL,
    cc_exp_month integer,
    cc_exp_year integer,
    cc_first_digits character varying(6) NOT NULL,
    cc_last_digits character varying(4) NOT NULL,
    extra_data text NOT NULL,
    token character varying(128) NOT NULL,
    currency character varying(10) NOT NULL,
    total numeric(12,2) NOT NULL,
    captured_amount numeric(12,2) NOT NULL,
    checkout_id uuid,
    task_id integer,
    CONSTRAINT payment_paymentmethod_cc_exp_month_check CHECK ((cc_exp_month >= 0)),
    CONSTRAINT payment_paymentmethod_cc_exp_year_check CHECK ((cc_exp_year >= 0))
);


ALTER TABLE payment_payment OWNER TO remote_works;

--
-- TOC entry 281 (class 1259 OID 19215)
-- Name: payment_paymentmethod_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE payment_paymentmethod_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE payment_paymentmethod_id_seq OWNER TO remote_works;

--
-- TOC entry 3502 (class 0 OID 0)
-- Dependencies: 281
-- Name: payment_paymentmethod_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE payment_paymentmethod_id_seq OWNED BY payment_payment.id;


--
-- TOC entry 284 (class 1259 OID 19230)
-- Name: payment_transaction; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE payment_transaction (
    id integer NOT NULL,
    created timestamp with time zone NOT NULL,
    token character varying(128) NOT NULL,
    kind character varying(10) NOT NULL,
    is_success boolean NOT NULL,
    error character varying(256),
    currency character varying(10) NOT NULL,
    amount numeric(12,2) NOT NULL,
    gateway_response jsonb NOT NULL,
    payment_id integer NOT NULL
);


ALTER TABLE payment_transaction OWNER TO remote_works;

--
-- TOC entry 283 (class 1259 OID 19228)
-- Name: payment_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE payment_transaction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE payment_transaction_id_seq OWNER TO remote_works;

--
-- TOC entry 3503 (class 0 OID 0)
-- Dependencies: 283
-- Name: payment_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE payment_transaction_id_seq OWNED BY payment_transaction.id;


--
-- TOC entry 213 (class 1259 OID 16729)
-- Name: skill_attributevalue; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE skill_attributevalue (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    attribute_id integer NOT NULL,
    slug character varying(100) NOT NULL,
    sort_order integer NOT NULL,
    value character varying(100) NOT NULL,
    CONSTRAINT product_attributechoicevalue_sort_order_check CHECK ((sort_order >= 0))
);


ALTER TABLE skill_attributevalue OWNER TO remote_works;

--
-- TOC entry 212 (class 1259 OID 16727)
-- Name: product_attributechoicevalue_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE product_attributechoicevalue_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE product_attributechoicevalue_id_seq OWNER TO remote_works;

--
-- TOC entry 3504 (class 0 OID 0)
-- Dependencies: 212
-- Name: product_attributechoicevalue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE product_attributechoicevalue_id_seq OWNED BY skill_attributevalue.id;


--
-- TOC entry 296 (class 1259 OID 19471)
-- Name: skill_attributevaluetranslation; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE skill_attributevaluetranslation (
    id integer NOT NULL,
    language_code character varying(10) NOT NULL,
    name character varying(100) NOT NULL,
    attribute_value_id integer NOT NULL
);


ALTER TABLE skill_attributevaluetranslation OWNER TO remote_works;

--
-- TOC entry 295 (class 1259 OID 19469)
-- Name: product_attributechoicevaluetranslation_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE product_attributechoicevaluetranslation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE product_attributechoicevaluetranslation_id_seq OWNER TO remote_works;

--
-- TOC entry 3505 (class 0 OID 0)
-- Dependencies: 295
-- Name: product_attributechoicevaluetranslation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE product_attributechoicevaluetranslation_id_seq OWNED BY skill_attributevaluetranslation.id;


--
-- TOC entry 215 (class 1259 OID 16737)
-- Name: skill_category; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE skill_category (
    id integer NOT NULL,
    name character varying(128) NOT NULL,
    slug character varying(128) NOT NULL,
    description text NOT NULL,
    lft integer NOT NULL,
    rght integer NOT NULL,
    tree_id integer NOT NULL,
    level integer NOT NULL,
    parent_id integer,
    background_image character varying(100),
    seo_description character varying(300),
    seo_title character varying(70),
    background_image_alt character varying(128) NOT NULL,
    description_json jsonb NOT NULL,
    CONSTRAINT product_category_level_check CHECK ((level >= 0)),
    CONSTRAINT product_category_lft_check CHECK ((lft >= 0)),
    CONSTRAINT product_category_rght_check CHECK ((rght >= 0)),
    CONSTRAINT product_category_tree_id_check CHECK ((tree_id >= 0))
);


ALTER TABLE skill_category OWNER TO remote_works;

--
-- TOC entry 214 (class 1259 OID 16735)
-- Name: product_category_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE product_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE product_category_id_seq OWNER TO remote_works;

--
-- TOC entry 3506 (class 0 OID 0)
-- Dependencies: 214
-- Name: product_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE product_category_id_seq OWNED BY skill_category.id;


--
-- TOC entry 298 (class 1259 OID 19479)
-- Name: skill_categorytranslation; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE skill_categorytranslation (
    id integer NOT NULL,
    seo_title character varying(70),
    seo_description character varying(300),
    language_code character varying(10) NOT NULL,
    name character varying(128) NOT NULL,
    description text NOT NULL,
    category_id integer NOT NULL,
    description_json jsonb NOT NULL
);


ALTER TABLE skill_categorytranslation OWNER TO remote_works;

--
-- TOC entry 297 (class 1259 OID 19477)
-- Name: product_categorytranslation_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE product_categorytranslation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE product_categorytranslation_id_seq OWNER TO remote_works;

--
-- TOC entry 3507 (class 0 OID 0)
-- Dependencies: 297
-- Name: product_categorytranslation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE product_categorytranslation_id_seq OWNED BY skill_categorytranslation.id;


--
-- TOC entry 240 (class 1259 OID 18067)
-- Name: skill_collection; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE skill_collection (
    id integer NOT NULL,
    name character varying(128) NOT NULL,
    slug character varying(128) NOT NULL,
    background_image character varying(100),
    seo_description character varying(300),
    seo_title character varying(70),
    is_published boolean NOT NULL,
    description text NOT NULL,
    publication_date date,
    background_image_alt character varying(128) NOT NULL,
    description_json jsonb NOT NULL
);


ALTER TABLE skill_collection OWNER TO remote_works;

--
-- TOC entry 239 (class 1259 OID 18065)
-- Name: product_collection_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE product_collection_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE product_collection_id_seq OWNER TO remote_works;

--
-- TOC entry 3508 (class 0 OID 0)
-- Dependencies: 239
-- Name: product_collection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE product_collection_id_seq OWNED BY skill_collection.id;


--
-- TOC entry 242 (class 1259 OID 18077)
-- Name: skill_collection_skills; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE skill_collection_skills (
    id integer NOT NULL,
    collection_id integer NOT NULL,
    skill_id integer NOT NULL
);


ALTER TABLE skill_collection_skills OWNER TO remote_works;

--
-- TOC entry 241 (class 1259 OID 18075)
-- Name: product_collection_products_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE product_collection_products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE product_collection_products_id_seq OWNER TO remote_works;

--
-- TOC entry 3509 (class 0 OID 0)
-- Dependencies: 241
-- Name: product_collection_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE product_collection_products_id_seq OWNED BY skill_collection_skills.id;


--
-- TOC entry 300 (class 1259 OID 19490)
-- Name: skill_collectiontranslation; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE skill_collectiontranslation (
    id integer NOT NULL,
    seo_title character varying(70),
    seo_description character varying(300),
    language_code character varying(10) NOT NULL,
    name character varying(128) NOT NULL,
    collection_id integer NOT NULL,
    description text NOT NULL,
    description_json jsonb NOT NULL
);


ALTER TABLE skill_collectiontranslation OWNER TO remote_works;

--
-- TOC entry 299 (class 1259 OID 19488)
-- Name: product_collectiontranslation_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE product_collectiontranslation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE product_collectiontranslation_id_seq OWNER TO remote_works;

--
-- TOC entry 3510 (class 0 OID 0)
-- Dependencies: 299
-- Name: product_collectiontranslation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE product_collectiontranslation_id_seq OWNED BY skill_collectiontranslation.id;


--
-- TOC entry 217 (class 1259 OID 16760)
-- Name: skill_skill; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE skill_skill (
    id integer NOT NULL,
    name character varying(128) NOT NULL,
    description text NOT NULL,
    price numeric(12,2) NOT NULL,
    publication_date date,
    updated_at timestamp with time zone,
    skill_type_id integer NOT NULL,
    attributes hstore NOT NULL,
    is_published boolean NOT NULL,
    category_id integer NOT NULL,
    seo_description character varying(300),
    seo_title character varying(70),
    charge_taxes boolean NOT NULL,
    tax_rate character varying(128) NOT NULL,
    description_json jsonb NOT NULL,
    owner_id integer,
    experience_years character varying(128)
);


ALTER TABLE skill_skill OWNER TO remote_works;

--
-- TOC entry 216 (class 1259 OID 16758)
-- Name: product_product_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE product_product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE product_product_id_seq OWNER TO remote_works;

--
-- TOC entry 3511 (class 0 OID 0)
-- Dependencies: 216
-- Name: product_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE product_product_id_seq OWNED BY skill_skill.id;


--
-- TOC entry 219 (class 1259 OID 16771)
-- Name: skill_attribute; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE skill_attribute (
    id integer NOT NULL,
    slug character varying(50) NOT NULL,
    name character varying(50) NOT NULL,
    skill_type_id integer,
    skill_variant_type_id integer
);


ALTER TABLE skill_attribute OWNER TO remote_works;

--
-- TOC entry 218 (class 1259 OID 16769)
-- Name: product_productattribute_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE product_productattribute_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE product_productattribute_id_seq OWNER TO remote_works;

--
-- TOC entry 3512 (class 0 OID 0)
-- Dependencies: 218
-- Name: product_productattribute_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE product_productattribute_id_seq OWNED BY skill_attribute.id;


--
-- TOC entry 302 (class 1259 OID 19501)
-- Name: skill_attributetranslation; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE skill_attributetranslation (
    id integer NOT NULL,
    language_code character varying(10) NOT NULL,
    name character varying(100) NOT NULL,
    attribute_id integer NOT NULL
);


ALTER TABLE skill_attributetranslation OWNER TO remote_works;

--
-- TOC entry 301 (class 1259 OID 19499)
-- Name: product_productattributetranslation_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE product_productattributetranslation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE product_productattributetranslation_id_seq OWNER TO remote_works;

--
-- TOC entry 3513 (class 0 OID 0)
-- Dependencies: 301
-- Name: product_productattributetranslation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE product_productattributetranslation_id_seq OWNED BY skill_attributetranslation.id;


--
-- TOC entry 238 (class 1259 OID 17255)
-- Name: skill_skilltype; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE skill_skilltype (
    id integer NOT NULL,
    name character varying(128) NOT NULL,
    has_variants boolean NOT NULL,
    is_delivery_required boolean NOT NULL,
    tax_rate character varying(128) NOT NULL,
    weight double precision NOT NULL
);


ALTER TABLE skill_skilltype OWNER TO remote_works;

--
-- TOC entry 237 (class 1259 OID 17253)
-- Name: product_productclass_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE product_productclass_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE product_productclass_id_seq OWNER TO remote_works;

--
-- TOC entry 3514 (class 0 OID 0)
-- Dependencies: 237
-- Name: product_productclass_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE product_productclass_id_seq OWNED BY skill_skilltype.id;


--
-- TOC entry 221 (class 1259 OID 16781)
-- Name: skill_skillimage; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE skill_skillimage (
    id integer NOT NULL,
    image character varying(100) NOT NULL,
    ppoi character varying(20) NOT NULL,
    alt character varying(128) NOT NULL,
    sort_order integer NOT NULL,
    skill_type_id integer NOT NULL,
    CONSTRAINT product_productimage_sort_order_dfda9c19_check CHECK ((sort_order >= 0))
);


ALTER TABLE skill_skillimage OWNER TO remote_works;

--
-- TOC entry 220 (class 1259 OID 16779)
-- Name: product_productimage_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE product_productimage_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE product_productimage_id_seq OWNER TO remote_works;

--
-- TOC entry 3515 (class 0 OID 0)
-- Dependencies: 220
-- Name: product_productimage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE product_productimage_id_seq OWNED BY skill_skillimage.id;


--
-- TOC entry 304 (class 1259 OID 19509)
-- Name: skill_skilltranslation; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE skill_skilltranslation (
    id integer NOT NULL,
    seo_title character varying(70),
    seo_description character varying(300),
    language_code character varying(10) NOT NULL,
    name character varying(128) NOT NULL,
    description text NOT NULL,
    skill_id integer NOT NULL,
    description_json jsonb NOT NULL
);


ALTER TABLE skill_skilltranslation OWNER TO remote_works;

--
-- TOC entry 303 (class 1259 OID 19507)
-- Name: product_producttranslation_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE product_producttranslation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE product_producttranslation_id_seq OWNER TO remote_works;

--
-- TOC entry 3516 (class 0 OID 0)
-- Dependencies: 303
-- Name: product_producttranslation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE product_producttranslation_id_seq OWNED BY skill_skilltranslation.id;


--
-- TOC entry 223 (class 1259 OID 16790)
-- Name: skill_skillvariant; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE skill_skillvariant (
    id integer NOT NULL,
    sku character varying(32) NOT NULL,
    name character varying(255) NOT NULL,
    price_override numeric(12,2),
    skill_id integer NOT NULL,
    attributes hstore NOT NULL,
    cost_price numeric(12,2),
    quantity integer NOT NULL,
    quantity_allocated integer NOT NULL,
    track_inventory boolean NOT NULL,
    weight double precision
);


ALTER TABLE skill_skillvariant OWNER TO remote_works;

--
-- TOC entry 222 (class 1259 OID 16788)
-- Name: product_productvariant_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE product_productvariant_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE product_productvariant_id_seq OWNER TO remote_works;

--
-- TOC entry 3517 (class 0 OID 0)
-- Dependencies: 222
-- Name: product_productvariant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE product_productvariant_id_seq OWNED BY skill_skillvariant.id;


--
-- TOC entry 306 (class 1259 OID 19520)
-- Name: skill_skillvarianttranslation; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE skill_skillvarianttranslation (
    id integer NOT NULL,
    language_code character varying(10) NOT NULL,
    name character varying(255) NOT NULL,
    skill_variant_id integer NOT NULL
);


ALTER TABLE skill_skillvarianttranslation OWNER TO remote_works;

--
-- TOC entry 305 (class 1259 OID 19518)
-- Name: product_productvarianttranslation_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE product_productvarianttranslation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE product_productvarianttranslation_id_seq OWNER TO remote_works;

--
-- TOC entry 3518 (class 0 OID 0)
-- Dependencies: 305
-- Name: product_productvarianttranslation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE product_productvarianttranslation_id_seq OWNED BY skill_skillvarianttranslation.id;


--
-- TOC entry 225 (class 1259 OID 16979)
-- Name: skill_variantimage; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE skill_variantimage (
    id integer NOT NULL,
    image_id integer NOT NULL,
    variant_id integer NOT NULL
);


ALTER TABLE skill_variantimage OWNER TO remote_works;

--
-- TOC entry 224 (class 1259 OID 16977)
-- Name: product_variantimage_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE product_variantimage_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE product_variantimage_id_seq OWNER TO remote_works;

--
-- TOC entry 3519 (class 0 OID 0)
-- Dependencies: 224
-- Name: product_variantimage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE product_variantimage_id_seq OWNED BY skill_variantimage.id;


--
-- TOC entry 210 (class 1259 OID 16690)
-- Name: shipping_shippingmethod_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE shipping_shippingmethod_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE shipping_shippingmethod_id_seq OWNER TO remote_works;

--
-- TOC entry 3520 (class 0 OID 0)
-- Dependencies: 210
-- Name: shipping_shippingmethod_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE shipping_shippingmethod_id_seq OWNED BY delivery_deliverymethod.id;


--
-- TOC entry 308 (class 1259 OID 19790)
-- Name: shipping_shippingmethodtranslation_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE shipping_shippingmethodtranslation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE shipping_shippingmethodtranslation_id_seq OWNER TO remote_works;

--
-- TOC entry 3521 (class 0 OID 0)
-- Dependencies: 308
-- Name: shipping_shippingmethodtranslation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE shipping_shippingmethodtranslation_id_seq OWNED BY delivery_deliverymethodtranslation.id;


--
-- TOC entry 310 (class 1259 OID 19798)
-- Name: shipping_shippingzone_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE shipping_shippingzone_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE shipping_shippingzone_id_seq OWNER TO remote_works;

--
-- TOC entry 3522 (class 0 OID 0)
-- Dependencies: 310
-- Name: shipping_shippingzone_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE shipping_shippingzone_id_seq OWNED BY delivery_deliveryzone.id;


--
-- TOC entry 292 (class 1259 OID 19365)
-- Name: site_authorizationkey; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE site_authorizationkey (
    id integer NOT NULL,
    name character varying(20) NOT NULL,
    key text NOT NULL,
    password text NOT NULL,
    site_settings_id integer NOT NULL
);


ALTER TABLE site_authorizationkey OWNER TO remote_works;

--
-- TOC entry 291 (class 1259 OID 19363)
-- Name: site_authorizationkey_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE site_authorizationkey_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE site_authorizationkey_id_seq OWNER TO remote_works;

--
-- TOC entry 3523 (class 0 OID 0)
-- Dependencies: 291
-- Name: site_authorizationkey_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE site_authorizationkey_id_seq OWNED BY site_authorizationkey.id;


--
-- TOC entry 290 (class 1259 OID 19341)
-- Name: site_sitesettings; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE site_sitesettings (
    id integer NOT NULL,
    header_text character varying(200) NOT NULL,
    description character varying(500) NOT NULL,
    site_id integer NOT NULL,
    bottom_menu_id integer,
    top_menu_id integer,
    display_gross_prices boolean NOT NULL,
    include_taxes_in_prices boolean NOT NULL,
    charge_taxes_on_delivery boolean NOT NULL,
    track_inventory_by_default boolean NOT NULL,
    homepage_collection_id integer,
    default_weight_unit character varying(10) NOT NULL
);


ALTER TABLE site_sitesettings OWNER TO remote_works;

--
-- TOC entry 289 (class 1259 OID 19339)
-- Name: site_sitesettings_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE site_sitesettings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE site_sitesettings_id_seq OWNER TO remote_works;

--
-- TOC entry 3524 (class 0 OID 0)
-- Dependencies: 289
-- Name: site_sitesettings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE site_sitesettings_id_seq OWNED BY site_sitesettings.id;


--
-- TOC entry 294 (class 1259 OID 19452)
-- Name: site_sitesettingstranslation; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE site_sitesettingstranslation (
    id integer NOT NULL,
    language_code character varying(10) NOT NULL,
    header_text character varying(200) NOT NULL,
    description character varying(500) NOT NULL,
    site_settings_id integer NOT NULL
);


ALTER TABLE site_sitesettingstranslation OWNER TO remote_works;

--
-- TOC entry 293 (class 1259 OID 19450)
-- Name: site_sitesettingstranslation_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE site_sitesettingstranslation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE site_sitesettingstranslation_id_seq OWNER TO remote_works;

--
-- TOC entry 3525 (class 0 OID 0)
-- Dependencies: 293
-- Name: site_sitesettingstranslation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE site_sitesettingstranslation_id_seq OWNED BY site_sitesettingstranslation.id;


--
-- TOC entry 313 (class 1259 OID 19860)
-- Name: social_auth_association; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE social_auth_association (
    id integer NOT NULL,
    server_url character varying(255) NOT NULL,
    handle character varying(255) NOT NULL,
    secret character varying(255) NOT NULL,
    issued integer NOT NULL,
    lifetime integer NOT NULL,
    assoc_type character varying(64) NOT NULL
);


ALTER TABLE social_auth_association OWNER TO remote_works;

--
-- TOC entry 312 (class 1259 OID 19858)
-- Name: social_auth_association_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE social_auth_association_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE social_auth_association_id_seq OWNER TO remote_works;

--
-- TOC entry 3526 (class 0 OID 0)
-- Dependencies: 312
-- Name: social_auth_association_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE social_auth_association_id_seq OWNED BY social_auth_association.id;


--
-- TOC entry 315 (class 1259 OID 19871)
-- Name: social_auth_code; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE social_auth_code (
    id integer NOT NULL,
    email character varying(254) NOT NULL,
    code character varying(32) NOT NULL,
    verified boolean NOT NULL,
    "timestamp" timestamp with time zone NOT NULL
);


ALTER TABLE social_auth_code OWNER TO remote_works;

--
-- TOC entry 314 (class 1259 OID 19869)
-- Name: social_auth_code_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE social_auth_code_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE social_auth_code_id_seq OWNER TO remote_works;

--
-- TOC entry 3527 (class 0 OID 0)
-- Dependencies: 314
-- Name: social_auth_code_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE social_auth_code_id_seq OWNED BY social_auth_code.id;


--
-- TOC entry 317 (class 1259 OID 19879)
-- Name: social_auth_nonce; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE social_auth_nonce (
    id integer NOT NULL,
    server_url character varying(255) NOT NULL,
    "timestamp" integer NOT NULL,
    salt character varying(65) NOT NULL
);


ALTER TABLE social_auth_nonce OWNER TO remote_works;

--
-- TOC entry 316 (class 1259 OID 19877)
-- Name: social_auth_nonce_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE social_auth_nonce_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE social_auth_nonce_id_seq OWNER TO remote_works;

--
-- TOC entry 3528 (class 0 OID 0)
-- Dependencies: 316
-- Name: social_auth_nonce_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE social_auth_nonce_id_seq OWNED BY social_auth_nonce.id;


--
-- TOC entry 321 (class 1259 OID 19921)
-- Name: social_auth_partial; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE social_auth_partial (
    id integer NOT NULL,
    token character varying(32) NOT NULL,
    next_step smallint NOT NULL,
    backend character varying(32) NOT NULL,
    data text NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    CONSTRAINT social_auth_partial_next_step_check CHECK ((next_step >= 0))
);


ALTER TABLE social_auth_partial OWNER TO remote_works;

--
-- TOC entry 320 (class 1259 OID 19919)
-- Name: social_auth_partial_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE social_auth_partial_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE social_auth_partial_id_seq OWNER TO remote_works;

--
-- TOC entry 3529 (class 0 OID 0)
-- Dependencies: 320
-- Name: social_auth_partial_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE social_auth_partial_id_seq OWNED BY social_auth_partial.id;


--
-- TOC entry 319 (class 1259 OID 19887)
-- Name: social_auth_usersocialauth; Type: TABLE; Schema: public; Owner: remote_works
--

CREATE TABLE social_auth_usersocialauth (
    id integer NOT NULL,
    provider character varying(32) NOT NULL,
    uid character varying(255) NOT NULL,
    extra_data text NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE social_auth_usersocialauth OWNER TO remote_works;

--
-- TOC entry 318 (class 1259 OID 19885)
-- Name: social_auth_usersocialauth_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE social_auth_usersocialauth_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE social_auth_usersocialauth_id_seq OWNER TO remote_works;

--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 318
-- Name: social_auth_usersocialauth_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE social_auth_usersocialauth_id_seq OWNED BY social_auth_usersocialauth.id;


--
-- TOC entry 200 (class 1259 OID 16475)
-- Name: userprofile_address_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE userprofile_address_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE userprofile_address_id_seq OWNER TO remote_works;

--
-- TOC entry 3531 (class 0 OID 0)
-- Dependencies: 200
-- Name: userprofile_address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE userprofile_address_id_seq OWNED BY account_address.id;


--
-- TOC entry 202 (class 1259 OID 16486)
-- Name: userprofile_user_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE userprofile_user_addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE userprofile_user_addresses_id_seq OWNER TO remote_works;

--
-- TOC entry 3532 (class 0 OID 0)
-- Dependencies: 202
-- Name: userprofile_user_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE userprofile_user_addresses_id_seq OWNED BY account_user_addresses.id;


--
-- TOC entry 204 (class 1259 OID 16494)
-- Name: userprofile_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE userprofile_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE userprofile_user_groups_id_seq OWNER TO remote_works;

--
-- TOC entry 3533 (class 0 OID 0)
-- Dependencies: 204
-- Name: userprofile_user_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE userprofile_user_groups_id_seq OWNED BY account_user_groups.id;


--
-- TOC entry 198 (class 1259 OID 16465)
-- Name: userprofile_user_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE userprofile_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE userprofile_user_id_seq OWNER TO remote_works;

--
-- TOC entry 3534 (class 0 OID 0)
-- Dependencies: 198
-- Name: userprofile_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE userprofile_user_id_seq OWNED BY account_user.id;


--
-- TOC entry 206 (class 1259 OID 16502)
-- Name: userprofile_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: remote_works
--

CREATE SEQUENCE userprofile_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE userprofile_user_user_permissions_id_seq OWNER TO remote_works;

--
-- TOC entry 3535 (class 0 OID 0)
-- Dependencies: 206
-- Name: userprofile_user_user_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: remote_works
--

ALTER SEQUENCE userprofile_user_user_permissions_id_seq OWNED BY account_user_user_permissions.id;


--
-- TOC entry 2696 (class 2604 OID 16480)
-- Name: account_address id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_address ALTER COLUMN id SET DEFAULT nextval('userprofile_address_id_seq'::regclass);


--
-- TOC entry 2700 (class 2604 OID 16618)
-- Name: account_customernote id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_customernote ALTER COLUMN id SET DEFAULT nextval('account_customernote_id_seq'::regclass);


--
-- TOC entry 2776 (class 2604 OID 28229)
-- Name: account_schedule id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_schedule ALTER COLUMN id SET DEFAULT nextval('account_schedule_id_seq'::regclass);


--
-- TOC entry 2695 (class 2604 OID 16470)
-- Name: account_user id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user ALTER COLUMN id SET DEFAULT nextval('userprofile_user_id_seq'::regclass);


--
-- TOC entry 2697 (class 2604 OID 16491)
-- Name: account_user_addresses id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user_addresses ALTER COLUMN id SET DEFAULT nextval('userprofile_user_addresses_id_seq'::regclass);


--
-- TOC entry 2698 (class 2604 OID 16499)
-- Name: account_user_groups id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user_groups ALTER COLUMN id SET DEFAULT nextval('userprofile_user_groups_id_seq'::regclass);


--
-- TOC entry 2699 (class 2604 OID 16507)
-- Name: account_user_user_permissions id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user_user_permissions ALTER COLUMN id SET DEFAULT nextval('userprofile_user_user_permissions_id_seq'::regclass);


--
-- TOC entry 2693 (class 2604 OID 16429)
-- Name: auth_group id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY auth_group ALTER COLUMN id SET DEFAULT nextval('auth_group_id_seq'::regclass);


--
-- TOC entry 2694 (class 2604 OID 16439)
-- Name: auth_group_permissions id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('auth_group_permissions_id_seq'::regclass);


--
-- TOC entry 2692 (class 2604 OID 16421)
-- Name: auth_permission id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY auth_permission ALTER COLUMN id SET DEFAULT nextval('auth_permission_id_seq'::regclass);


--
-- TOC entry 2722 (class 2604 OID 17088)
-- Name: checkout_cartline id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY checkout_cartline ALTER COLUMN id SET DEFAULT nextval('cart_cartline_id_seq'::regclass);


--
-- TOC entry 2701 (class 2604 OID 16695)
-- Name: delivery_deliverymethod id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY delivery_deliverymethod ALTER COLUMN id SET DEFAULT nextval('shipping_shippingmethod_id_seq'::regclass);


--
-- TOC entry 2768 (class 2604 OID 19795)
-- Name: delivery_deliverymethodtranslation id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY delivery_deliverymethodtranslation ALTER COLUMN id SET DEFAULT nextval('shipping_shippingmethodtranslation_id_seq'::regclass);


--
-- TOC entry 2769 (class 2604 OID 19803)
-- Name: delivery_deliveryzone id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY delivery_deliveryzone ALTER COLUMN id SET DEFAULT nextval('shipping_shippingzone_id_seq'::regclass);


--
-- TOC entry 2715 (class 2604 OID 17002)
-- Name: discount_sale id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_sale ALTER COLUMN id SET DEFAULT nextval('discount_sale_id_seq'::regclass);


--
-- TOC entry 2716 (class 2604 OID 17010)
-- Name: discount_sale_categories id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_sale_categories ALTER COLUMN id SET DEFAULT nextval('discount_sale_categories_id_seq'::regclass);


--
-- TOC entry 2733 (class 2604 OID 18766)
-- Name: discount_sale_collections id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_sale_collections ALTER COLUMN id SET DEFAULT nextval('discount_sale_collections_id_seq'::regclass);


--
-- TOC entry 2717 (class 2604 OID 17018)
-- Name: discount_sale_skills id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_sale_skills ALTER COLUMN id SET DEFAULT nextval('discount_sale_products_id_seq'::regclass);


--
-- TOC entry 2718 (class 2604 OID 17054)
-- Name: discount_voucher id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_voucher ALTER COLUMN id SET DEFAULT nextval('discount_voucher_id_seq'::regclass);


--
-- TOC entry 2734 (class 2604 OID 18800)
-- Name: discount_voucher_categories id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_voucher_categories ALTER COLUMN id SET DEFAULT nextval('discount_voucher_categories_id_seq'::regclass);


--
-- TOC entry 2735 (class 2604 OID 18808)
-- Name: discount_voucher_collections id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_voucher_collections ALTER COLUMN id SET DEFAULT nextval('discount_voucher_collections_id_seq'::regclass);


--
-- TOC entry 2736 (class 2604 OID 18829)
-- Name: discount_voucher_skills id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_voucher_skills ALTER COLUMN id SET DEFAULT nextval('discount_voucher_products_id_seq'::regclass);


--
-- TOC entry 2737 (class 2604 OID 18879)
-- Name: discount_vouchertranslation id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_vouchertranslation ALTER COLUMN id SET DEFAULT nextval('discount_vouchertranslation_id_seq'::regclass);


--
-- TOC entry 2738 (class 2604 OID 18895)
-- Name: django_celery_results_taskresult id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY django_celery_results_taskresult ALTER COLUMN id SET DEFAULT nextval('django_celery_results_taskresult_id_seq'::regclass);


--
-- TOC entry 2691 (class 2604 OID 16411)
-- Name: django_content_type id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY django_content_type ALTER COLUMN id SET DEFAULT nextval('django_content_type_id_seq'::regclass);


--
-- TOC entry 2690 (class 2604 OID 16400)
-- Name: django_migrations id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY django_migrations ALTER COLUMN id SET DEFAULT nextval('django_migrations_id_seq'::regclass);


--
-- TOC entry 2739 (class 2604 OID 18910)
-- Name: django_prices_openexchangerates_conversionrate id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY django_prices_openexchangerates_conversionrate ALTER COLUMN id SET DEFAULT nextval('django_prices_openexchangerates_conversionrate_id_seq'::regclass);


--
-- TOC entry 2741 (class 2604 OID 18944)
-- Name: django_prices_vatlayer_ratetypes id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY django_prices_vatlayer_ratetypes ALTER COLUMN id SET DEFAULT nextval('django_prices_vatlayer_ratetypes_id_seq'::regclass);


--
-- TOC entry 2740 (class 2604 OID 18933)
-- Name: django_prices_vatlayer_vat id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY django_prices_vatlayer_vat ALTER COLUMN id SET DEFAULT nextval('django_prices_vatlayer_vat_id_seq'::regclass);


--
-- TOC entry 2758 (class 2604 OID 19333)
-- Name: django_site id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY django_site ALTER COLUMN id SET DEFAULT nextval('django_site_id_seq'::regclass);


--
-- TOC entry 2742 (class 2604 OID 18957)
-- Name: impersonate_impersonationlog id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY impersonate_impersonationlog ALTER COLUMN id SET DEFAULT nextval('impersonate_impersonationlog_id_seq'::regclass);


--
-- TOC entry 2744 (class 2604 OID 18991)
-- Name: menu_menu id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY menu_menu ALTER COLUMN id SET DEFAULT nextval('menu_menu_id_seq'::regclass);


--
-- TOC entry 2745 (class 2604 OID 19001)
-- Name: menu_menuitem id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY menu_menuitem ALTER COLUMN id SET DEFAULT nextval('menu_menuitem_id_seq'::regclass);


--
-- TOC entry 2751 (class 2604 OID 19057)
-- Name: menu_menuitemtranslation id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY menu_menuitemtranslation ALTER COLUMN id SET DEFAULT nextval('menu_menuitemtranslation_id_seq'::regclass);


--
-- TOC entry 2743 (class 2604 OID 18977)
-- Name: page_page id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY page_page ALTER COLUMN id SET DEFAULT nextval('page_page_id_seq'::regclass);


--
-- TOC entry 2757 (class 2604 OID 19279)
-- Name: page_pagetranslation id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY page_pagetranslation ALTER COLUMN id SET DEFAULT nextval('page_pagetranslation_id_seq'::regclass);


--
-- TOC entry 2753 (class 2604 OID 19220)
-- Name: payment_payment id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY payment_payment ALTER COLUMN id SET DEFAULT nextval('payment_paymentmethod_id_seq'::regclass);


--
-- TOC entry 2756 (class 2604 OID 19233)
-- Name: payment_transaction id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY payment_transaction ALTER COLUMN id SET DEFAULT nextval('payment_transaction_id_seq'::regclass);


--
-- TOC entry 2760 (class 2604 OID 19368)
-- Name: site_authorizationkey id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY site_authorizationkey ALTER COLUMN id SET DEFAULT nextval('site_authorizationkey_id_seq'::regclass);


--
-- TOC entry 2759 (class 2604 OID 19344)
-- Name: site_sitesettings id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY site_sitesettings ALTER COLUMN id SET DEFAULT nextval('site_sitesettings_id_seq'::regclass);


--
-- TOC entry 2761 (class 2604 OID 19455)
-- Name: site_sitesettingstranslation id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY site_sitesettingstranslation ALTER COLUMN id SET DEFAULT nextval('site_sitesettingstranslation_id_seq'::regclass);


--
-- TOC entry 2710 (class 2604 OID 16774)
-- Name: skill_attribute id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_attribute ALTER COLUMN id SET DEFAULT nextval('product_productattribute_id_seq'::regclass);


--
-- TOC entry 2765 (class 2604 OID 19504)
-- Name: skill_attributetranslation id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_attributetranslation ALTER COLUMN id SET DEFAULT nextval('product_productattributetranslation_id_seq'::regclass);


--
-- TOC entry 2702 (class 2604 OID 16732)
-- Name: skill_attributevalue id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_attributevalue ALTER COLUMN id SET DEFAULT nextval('product_attributechoicevalue_id_seq'::regclass);


--
-- TOC entry 2762 (class 2604 OID 19474)
-- Name: skill_attributevaluetranslation id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_attributevaluetranslation ALTER COLUMN id SET DEFAULT nextval('product_attributechoicevaluetranslation_id_seq'::regclass);


--
-- TOC entry 2704 (class 2604 OID 16740)
-- Name: skill_category id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_category ALTER COLUMN id SET DEFAULT nextval('product_category_id_seq'::regclass);


--
-- TOC entry 2763 (class 2604 OID 19482)
-- Name: skill_categorytranslation id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_categorytranslation ALTER COLUMN id SET DEFAULT nextval('product_categorytranslation_id_seq'::regclass);


--
-- TOC entry 2725 (class 2604 OID 18070)
-- Name: skill_collection id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_collection ALTER COLUMN id SET DEFAULT nextval('product_collection_id_seq'::regclass);


--
-- TOC entry 2726 (class 2604 OID 18080)
-- Name: skill_collection_skills id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_collection_skills ALTER COLUMN id SET DEFAULT nextval('product_collection_products_id_seq'::regclass);


--
-- TOC entry 2764 (class 2604 OID 19493)
-- Name: skill_collectiontranslation id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_collectiontranslation ALTER COLUMN id SET DEFAULT nextval('product_collectiontranslation_id_seq'::regclass);


--
-- TOC entry 2709 (class 2604 OID 16763)
-- Name: skill_skill id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skill ALTER COLUMN id SET DEFAULT nextval('product_product_id_seq'::regclass);


--
-- TOC entry 2711 (class 2604 OID 16784)
-- Name: skill_skillimage id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skillimage ALTER COLUMN id SET DEFAULT nextval('product_productimage_id_seq'::regclass);


--
-- TOC entry 2766 (class 2604 OID 19512)
-- Name: skill_skilltranslation id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skilltranslation ALTER COLUMN id SET DEFAULT nextval('product_producttranslation_id_seq'::regclass);


--
-- TOC entry 2724 (class 2604 OID 17258)
-- Name: skill_skilltype id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skilltype ALTER COLUMN id SET DEFAULT nextval('product_productclass_id_seq'::regclass);


--
-- TOC entry 2713 (class 2604 OID 16793)
-- Name: skill_skillvariant id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skillvariant ALTER COLUMN id SET DEFAULT nextval('product_productvariant_id_seq'::regclass);


--
-- TOC entry 2767 (class 2604 OID 19523)
-- Name: skill_skillvarianttranslation id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skillvarianttranslation ALTER COLUMN id SET DEFAULT nextval('product_productvarianttranslation_id_seq'::regclass);


--
-- TOC entry 2714 (class 2604 OID 16982)
-- Name: skill_variantimage id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_variantimage ALTER COLUMN id SET DEFAULT nextval('product_variantimage_id_seq'::regclass);


--
-- TOC entry 2770 (class 2604 OID 19863)
-- Name: social_auth_association id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY social_auth_association ALTER COLUMN id SET DEFAULT nextval('social_auth_association_id_seq'::regclass);


--
-- TOC entry 2771 (class 2604 OID 19874)
-- Name: social_auth_code id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY social_auth_code ALTER COLUMN id SET DEFAULT nextval('social_auth_code_id_seq'::regclass);


--
-- TOC entry 2772 (class 2604 OID 19882)
-- Name: social_auth_nonce id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY social_auth_nonce ALTER COLUMN id SET DEFAULT nextval('social_auth_nonce_id_seq'::regclass);


--
-- TOC entry 2774 (class 2604 OID 19924)
-- Name: social_auth_partial id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY social_auth_partial ALTER COLUMN id SET DEFAULT nextval('social_auth_partial_id_seq'::regclass);


--
-- TOC entry 2773 (class 2604 OID 19890)
-- Name: social_auth_usersocialauth id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY social_auth_usersocialauth ALTER COLUMN id SET DEFAULT nextval('social_auth_usersocialauth_id_seq'::regclass);


--
-- TOC entry 2729 (class 2604 OID 18526)
-- Name: task_fulfillment id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_fulfillment ALTER COLUMN id SET DEFAULT nextval('order_fulfillment_id_seq'::regclass);


--
-- TOC entry 2731 (class 2604 OID 18535)
-- Name: task_fulfillmentline id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_fulfillmentline ALTER COLUMN id SET DEFAULT nextval('order_fulfillmentline_id_seq'::regclass);


--
-- TOC entry 2727 (class 2604 OID 18132)
-- Name: task_task id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_task ALTER COLUMN id SET DEFAULT nextval('order_order_id_seq'::regclass);


--
-- TOC entry 2752 (class 2604 OID 19182)
-- Name: task_taskevent id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_taskevent ALTER COLUMN id SET DEFAULT nextval('order_orderevent_id_seq'::regclass);


--
-- TOC entry 2728 (class 2604 OID 18145)
-- Name: task_taskline id; Type: DEFAULT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_taskline ALTER COLUMN id SET DEFAULT nextval('order_ordereditem_id_seq'::regclass);


--
-- TOC entry 3341 (class 0 OID 16477)
-- Dependencies: 201
-- Data for Name: account_address; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY account_address (id, first_name, last_name, company_name, street_address_1, street_address_2, city, postal_code, country, country_area, phone, city_area) FROM stdin;
1				Sugarbird	12	JOHANNESBURG	1684	ZA		+17603600	
2				Sugarbird	12	JOHANNESBURG	1684	ZA		+17603600	
3	Christina	Collier		729 Christopher Station Suite 074		Alexanderchester	55518	IE			
4	David	Lee		25068 Melissa Estate Suite 087		Joshuaside	32310	AF			
5	Brianna	Donaldson		26098 Kevin Manor Apt. 094		New Jessica	26639	SL			
6	Julia	Torres		429 Brenda Ford Suite 273		Richardmouth	29363	BN			
7	Tony	Ewing		43696 Mckinney Avenue Suite 791		Paulborough	84709	MT			
8	Steven	Villanueva		0612 Victoria Centers Suite 495		South Deniseside	30323	SY			
9	Alexandra	Williams		5119 Oneal Prairie		Sheilafort	85143	CI			
10	Christine	Chavez		266 Craig Stream Apt. 232		Aaronland	56407	KW			
11	Michael	Velez		295 Carolyn Dam		South Jayfurt	23180	QA			
12	James	Leon		4437 Robert Extension		Jacksonbury	90269	CG			
13	Jared	Thomas		4438 Hamilton Terrace Suite 766		Kylieburgh	72650	TT			
14	Joseph	Fry		480 Bell Inlet Suite 964		East Larry	57546	SN			
15	Paul	Morris		78349 Allen Coves Apt. 138		New Markhaven	38685	LC			
16	Shawn	Carter		906 Peterson Cove Suite 603		Port Ericstad	71838	CM			
17	Charles	Willis		2916 Heather Neck		New Deborahton	78856	GA			
18	Tonya	Neal		83355 Emily Shores		Cohentown	66754	BW			
19	Alexander	Thomas		7323 Bowman Plains Apt. 315		West Kellyborough	29480	DZ			
20	Julie	Clark		5534 Sara Gardens Apt. 609		Port Melindafort	06647	SR			
21	Brian	Rhodes		337 Tina Springs		Levineton	30470	IN			
22	Jill	Gibson		77926 Darrell Crescent		Ashleyville	62900	BI			
\.


--
-- TOC entry 3349 (class 0 OID 16615)
-- Dependencies: 209
-- Data for Name: account_customernote; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY account_customernote (id, date, content, is_public, customer_id, user_id) FROM stdin;
\.


--
-- TOC entry 3536 (class 0 OID 0)
-- Dependencies: 208
-- Name: account_customernote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('account_customernote_id_seq', 1, false);


--
-- TOC entry 3462 (class 0 OID 28213)
-- Dependencies: 322
-- Data for Name: account_schedule; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY account_schedule (days_of_week, owner_id, id, time_slot_end, time_slot_start) FROM stdin;
['fr', 'sa']	2	6	00:00:00	00:00:00
['su', 'mo']	2	7	10:00:00	00:00:00
['tu', 'we']	2	9	10:00:00	00:00:00
\.


--
-- TOC entry 3537 (class 0 OID 0)
-- Dependencies: 323
-- Name: account_schedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('account_schedule_id_seq', 9, true);


--
-- TOC entry 3339 (class 0 OID 16467)
-- Dependencies: 199
-- Data for Name: account_user; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY account_user (id, is_superuser, email, is_staff, is_active, password, date_joined, last_login, default_billing_address_id, default_delivery_address_id, note, token, first_name, last_name, is_employer) FROM stdin;
18	f	tonya.neal@example.com	f	t	pbkdf2_sha256$120000$Nmj42vprNSk2$gZgT+fjGaez+oxyjBLu60bWs9yF1wH8Vv0szeQLj5w4=	2019-03-11 15:30:29.672153+02	\N	18	18	\N	ecddcd07-36cb-4478-9382-13bcecaf347d	Tonya	Neal	f
4	f	david.lee@example.com	f	t	pbkdf2_sha256$120000$I0DWAn3yw8PS$ewYdV5B5lsi85qZm8xz826K7lq1zrptkWyLuyNFCW3s=	2019-03-11 15:30:28.178013+02	\N	4	4	\N	124ebe79-6250-4973-9d2c-226765e2493b	David	Lee	f
5	f	brianna.donaldson@example.com	f	t	pbkdf2_sha256$120000$HdVLRbVTXqJN$57zPBn4lhy1htXQBzOvEaLlk86JudPLw0CUSyctqyos=	2019-03-11 15:30:28.289601+02	\N	5	5	\N	7e2c5a60-fe1f-4107-98dd-ed2e6a61f391	Brianna	Donaldson	f
6	f	julia.torres@example.com	f	t	pbkdf2_sha256$120000$j9cUWT2V9trO$XLfEeMZMYkAYiTZnb7CSKo0YWsGQnodgzHYz4Lr3RRY=	2019-03-11 15:30:28.384943+02	\N	6	6	\N	c5531d54-b27c-40c9-ad0b-9cff639b885d	Julia	Torres	f
7	f	tony.ewing@example.com	f	t	pbkdf2_sha256$120000$DsTKEWkqV4WH$b4A54rTFjCsajKmV/g9Y5+m4VBXGUUu88++XIqlso8k=	2019-03-11 15:30:28.479118+02	\N	7	7	\N	9175ffcf-d8d0-49a4-a03b-cc6e792dd9a0	Tony	Ewing	f
8	f	steven.villanueva@example.com	f	t	pbkdf2_sha256$120000$rHNK7KDIYfDe$xqG2hXxEbpXbzULARkw9n+oJXMho5SR4piem6dFtEtw=	2019-03-11 15:30:28.57869+02	\N	8	8	\N	f29a97fb-445f-46e0-9585-161357317af1	Steven	Villanueva	f
9	f	alexandra.williams@example.com	f	t	pbkdf2_sha256$120000$XRMkGRXABtYU$erL71nEUhKnk+aVD+7z3CwfWIU6wI+GqY4JgwURroak=	2019-03-11 15:30:28.669661+02	\N	9	9	\N	1bf5e9a6-a884-49a1-a2a5-87c26209df69	Alexandra	Williams	f
10	f	christine.chavez@example.com	f	t	pbkdf2_sha256$120000$5awq83bUyIEg$D/JRPyqAXbWlMyK93DygWPe1qaBSZzC4xXJBjznu/JY=	2019-03-11 15:30:28.750903+02	\N	10	10	\N	615c31b3-dd1f-4fa6-95e7-2de68f66b31e	Christine	Chavez	f
11	f	michael.velez@example.com	f	t	pbkdf2_sha256$120000$4BEQi4mpnOgt$Ji2SgHBbsK35yHaTc2qWGPVy+GlyOH0k36GH5OKaW6M=	2019-03-11 15:30:28.845769+02	\N	11	11	\N	d45a21e1-39f8-47be-b7b3-0f50b0a2d308	Michael	Velez	f
12	f	james.leon@example.com	f	t	pbkdf2_sha256$120000$rnTfZ4wlgZaq$vYAoZ650XLvhX07lGX6zenHk4PN5k2VlGiEUicJyePE=	2019-03-11 15:30:28.928724+02	\N	12	12	\N	564fa5b8-dc4e-4009-be22-05e97082da9d	James	Leon	f
13	f	jared.thomas@example.com	f	t	pbkdf2_sha256$120000$jeDXRe06MyIF$qBVxDNx9MjhiIa+dQn3jv1NwEdVNLIsaLd9n3uZHBIQ=	2019-03-11 15:30:29.027001+02	\N	13	13	\N	239296e2-ca79-4811-9a8f-5591c2319d7a	Jared	Thomas	f
14	f	joseph.fry@example.com	f	t	pbkdf2_sha256$120000$8lfLMZBRCydM$H1DqFJJkaFdD0v9OOxW0kMZhqRbJ+yA9746N7IFRfvk=	2019-03-11 15:30:29.127321+02	\N	14	14	\N	c37152c1-5c0b-42e0-bc25-0b7be3044d60	Joseph	Fry	f
15	f	paul.morris@example.com	f	t	pbkdf2_sha256$120000$Tvama6lfrF2i$5zImXwCzW2xbJ2hgkk2StR/p0eHA2wV14y0a/EqOAu4=	2019-03-11 15:30:29.217255+02	\N	15	15	\N	0a6c7756-921e-486a-81b2-44ac28dad766	Paul	Morris	f
16	f	shawn.carter@example.com	f	t	pbkdf2_sha256$120000$mdM1fQVwLr34$cidSBMOibhbcoFvjJ+P0mz3P0w/zoOfsBOpjfnyHwWo=	2019-03-11 15:30:29.295709+02	\N	16	16	\N	12a1f04f-6479-4616-9012-d58ed1708d7b	Shawn	Carter	f
17	f	charles.willis@example.com	f	t	pbkdf2_sha256$120000$xomUHSa8Zld7$YAyOmGaZEsr4jC9XteoLCWo3lrOMHudzIrTZkujB2Bo=	2019-03-11 15:30:29.494226+02	\N	17	17	\N	f60cc66c-07f4-49d4-a7b5-9a3bee4bea9f	Charles	Willis	f
19	f	alexander.thomas@example.com	f	t	pbkdf2_sha256$120000$3JNgBQcU39xp$V1Tm8dLVF6waG3Tv9iHcFSX4T59yMdfvaC1KrQ2XSOI=	2019-03-11 15:30:29.8526+02	\N	19	19	\N	0875611e-8ea1-4cb8-ae8e-b5d85b4ff1fd	Alexander	Thomas	f
20	f	julie.clark@example.com	f	t	pbkdf2_sha256$120000$LAuI4mVG4rge$LgWLlGGMnaDyHYjJ0SZCG5wqkZoRgR+hy+dCCEvtuJ8=	2019-03-11 15:30:30.049561+02	\N	20	20	\N	2a69c1c2-9915-428d-8103-0e8419f52c67	Julie	Clark	f
21	f	brian.rhodes@example.com	f	t	pbkdf2_sha256$120000$uFYXwH6ThbAE$VsdSiLiwqMEEc0mMcThRjMHdH6wXN5v1dnZn+Xnwv98=	2019-03-11 15:30:30.223869+02	\N	21	21	\N	dc3a448b-c9b9-46ff-8d5f-23a4420eefc8	Brian	Rhodes	f
22	f	jill.gibson@example.com	f	t	pbkdf2_sha256$120000$L6pT4H8TotyE$KnJC50HA2c1CkRqzCPcCEG6d5HszL7YKeoEQtcIfU6Q=	2019-03-11 15:30:30.408945+02	\N	22	22	\N	64211f55-010f-4f37-b90d-643043c97b8d	Jill	Gibson	f
23	f	employer@employer.com	t	t	pbkdf2_sha256$12000jjjGX9LO5io1gv+UnCpWpjJ4Hord1wv09fEBPNWfWAGc=	2019-03-15 10:58:31.417783+02	2019-03-18 17:50:46.136483+02	\N	\N	\N	67d750dd-5cf7-40c4-b1fc-7e79f925180a	employer	employer	f
3	f	christina.collier@example.com	f	t	pbkdf2_sha256$1hhhszyYT7RpwUqnApJ0pXb5E93dXWCDHVqkQkmjc=	2019-03-11 15:30:28.099818+02	\N	3	3	\N	9237f1aa-1884-47d4-95ee-b34b78046e6b	Christina	Collier	f
1	f	tetyana.loskutova@gmail.com	f	t	pbkdf2_sha256$12000jjjszyYT7RpwUqnApJ0pXb5E93dXWCDHVqkQkmjc=	2019-03-06 19:04:01.736508+02	2019-05-19 15:21:31.529714+02	\N	\N	\N	0dedaf07-6bad-4433-83cc-8a0de0f8f3cc			f
2	t	d_aana@yahoo.com	t	t	pbkdf2_sha256$-	2019-03-07 10:01:48.51843+02	2019-05-26 19:55:31.190993+02	2	\N	\N	f5bccb34-934f-4ce7-9dfa-4e8c45159862	employer		f
\.


--
-- TOC entry 3343 (class 0 OID 16488)
-- Dependencies: 203
-- Data for Name: account_user_addresses; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY account_user_addresses (id, user_id, address_id) FROM stdin;
1	2	2
2	3	3
3	4	4
4	5	5
5	6	6
6	7	7
7	8	8
8	9	9
9	10	10
10	11	11
11	12	12
12	13	13
13	14	14
14	15	15
15	16	16
16	17	17
17	18	18
18	19	19
19	20	20
20	21	21
21	22	22
\.


--
-- TOC entry 3345 (class 0 OID 16496)
-- Dependencies: 205
-- Data for Name: account_user_groups; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY account_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- TOC entry 3347 (class 0 OID 16504)
-- Dependencies: 207
-- Data for Name: account_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY account_user_user_permissions (id, user_id, permission_id) FROM stdin;
1	2	40
2	2	57
3	2	170
4	23	57
5	23	164
6	1	57
7	1	164
8	23	70
9	23	71
10	23	72
\.


--
-- TOC entry 3335 (class 0 OID 16426)
-- Dependencies: 195
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY auth_group (id, name) FROM stdin;
\.


--
-- TOC entry 3538 (class 0 OID 0)
-- Dependencies: 194
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('auth_group_id_seq', 1, false);


--
-- TOC entry 3337 (class 0 OID 16436)
-- Dependencies: 197
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- TOC entry 3539 (class 0 OID 0)
-- Dependencies: 196
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('auth_group_permissions_id_seq', 1, false);


--
-- TOC entry 3333 (class 0 OID 16418)
-- Dependencies: 193
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add content type	1	add_contenttype
2	Can change content type	1	change_contenttype
3	Can delete content type	1	delete_contenttype
4	Can view content type	1	view_contenttype
5	Can add session	2	add_session
6	Can change session	2	change_session
7	Can delete session	2	delete_session
8	Can view session	2	view_session
9	Can add site	3	add_site
10	Can change site	3	change_site
11	Can delete site	3	delete_site
12	Can view site	3	view_site
13	Can add permission	4	add_permission
14	Can change permission	4	change_permission
15	Can delete permission	4	delete_permission
16	Can view permission	4	view_permission
17	Can add group	5	add_group
18	Can change group	5	change_group
19	Can delete group	5	delete_group
20	Can view group	5	view_group
21	Can add user	6	add_user
22	Can change user	6	change_user
23	Can delete user	6	delete_user
24	Can view user	6	view_user
25	Manage customers.	6	manage_users
26	Manage staff.	6	manage_staff
27	Impersonate customers.	6	impersonate_users
28	Can add address	7	add_address
29	Can change address	7	change_address
30	Can delete address	7	delete_address
31	Can view address	7	view_address
32	Can add customer note	8	add_customernote
33	Can change customer note	8	change_customernote
34	Can delete customer note	8	delete_customernote
35	Can view customer note	8	view_customernote
36	Can add sale	9	add_sale
37	Can change sale	9	change_sale
38	Can delete sale	9	delete_sale
39	Can view sale	9	view_sale
40	Manage sales and vouchers.	9	manage_discounts
41	Can add voucher	10	add_voucher
42	Can change voucher	10	change_voucher
43	Can delete voucher	10	delete_voucher
44	Can view voucher	10	view_voucher
45	Can add voucher translation	11	add_vouchertranslation
46	Can change voucher translation	11	change_vouchertranslation
47	Can delete voucher translation	11	delete_vouchertranslation
48	Can view voucher translation	11	view_vouchertranslation
49	Can add category	12	add_category
50	Can change category	12	change_category
51	Can delete category	12	delete_category
52	Can view category	12	view_category
66	Can add variant image	16	add_variantimage
67	Can change variant image	16	change_variantimage
68	Can delete variant image	16	delete_variantimage
69	Can view variant image	16	view_variantimage
74	Can add collection	18	add_collection
75	Can change collection	18	change_collection
76	Can delete collection	18	delete_collection
77	Can view collection	18	view_collection
78	Can add category translation	19	add_categorytranslation
79	Can change category translation	19	change_categorytranslation
80	Can delete category translation	19	delete_categorytranslation
81	Can view category translation	19	view_categorytranslation
82	Can add collection translation	20	add_collectiontranslation
83	Can change collection translation	20	change_collectiontranslation
84	Can delete collection translation	20	delete_collectiontranslation
85	Can view collection translation	20	view_collectiontranslation
86	Can add product translation	21	add_producttranslation
87	Can change product translation	21	change_producttranslation
88	Can delete product translation	21	delete_producttranslation
89	Can view product translation	21	view_producttranslation
90	Can add product variant translation	22	add_productvarianttranslation
91	Can change product variant translation	22	change_productvarianttranslation
92	Can delete product variant translation	22	delete_productvarianttranslation
93	Can view product variant translation	22	view_productvarianttranslation
94	Can add attribute	23	add_attribute
95	Can change attribute	23	change_attribute
96	Can delete attribute	23	delete_attribute
97	Can view attribute	23	view_attribute
98	Can add attribute value translation	24	add_attributevaluetranslation
56	Can view skill	13	view_skill
99	Can change attribute value translation	24	change_attributevaluetranslation
100	Can delete attribute value translation	24	delete_attributevaluetranslation
101	Can view attribute value translation	24	view_attributevaluetranslation
102	Can add attribute value	25	add_attributevalue
103	Can change attribute value	25	change_attributevalue
104	Can delete attribute value	25	delete_attributevalue
105	Can view attribute value	25	view_attributevalue
106	Can add attribute translation	26	add_attributetranslation
107	Can change attribute translation	26	change_attributetranslation
108	Can delete attribute translation	26	delete_attributetranslation
109	Can view attribute translation	26	view_attributetranslation
110	Can add cart	27	add_cart
111	Can change cart	27	change_cart
112	Can delete cart	27	delete_cart
113	Can view cart	27	view_cart
114	Can add cart line	28	add_cartline
115	Can change cart line	28	change_cartline
116	Can delete cart line	28	delete_cartline
117	Can view cart line	28	view_cartline
118	Can add menu	29	add_menu
119	Can change menu	29	change_menu
120	Can delete menu	29	delete_menu
121	Can view menu	29	view_menu
122	Manage navigation.	29	manage_menus
123	Can add menu item	30	add_menuitem
124	Can change menu item	30	change_menuitem
125	Can delete menu item	30	delete_menuitem
126	Can view menu item	30	view_menuitem
127	Can add menu item translation	31	add_menuitemtranslation
128	Can change menu item translation	31	change_menuitemtranslation
129	Can delete menu item translation	31	delete_menuitemtranslation
130	Can view menu item translation	31	view_menuitemtranslation
131	Can add order	32	add_order
132	Can change order	32	change_order
133	Can delete order	32	delete_order
134	Can view order	32	view_order
135	Manage orders.	32	manage_orders
136	Can add order line	33	add_orderline
137	Can change order line	33	change_orderline
138	Can delete order line	33	delete_orderline
139	Can view order line	33	view_orderline
140	Can add fulfillment	34	add_fulfillment
141	Can change fulfillment	34	change_fulfillment
142	Can delete fulfillment	34	delete_fulfillment
143	Can view fulfillment	34	view_fulfillment
144	Can add fulfillment line	35	add_fulfillmentline
145	Can change fulfillment line	35	change_fulfillmentline
146	Can delete fulfillment line	35	delete_fulfillmentline
147	Can view fulfillment line	35	view_fulfillmentline
148	Can add order event	36	add_orderevent
149	Can change order event	36	change_orderevent
150	Can delete order event	36	delete_orderevent
151	Can view order event	36	view_orderevent
152	Can add shipping method	37	add_shippingmethod
153	Can change shipping method	37	change_shippingmethod
154	Can delete shipping method	37	delete_shippingmethod
155	Can view shipping method	37	view_shippingmethod
156	Can add shipping method translation	38	add_shippingmethodtranslation
157	Can change shipping method translation	38	change_shippingmethodtranslation
158	Can delete shipping method translation	38	delete_shippingmethodtranslation
159	Can view shipping method translation	38	view_shippingmethodtranslation
160	Can add shipping zone	39	add_shippingzone
161	Can change shipping zone	39	change_shippingzone
162	Can delete shipping zone	39	delete_shippingzone
163	Can view shipping zone	39	view_shippingzone
164	Manage shipping.	39	manage_shipping
165	Can add site settings	40	add_sitesettings
166	Can change site settings	40	change_sitesettings
167	Can delete site settings	40	delete_sitesettings
168	Can view site settings	40	view_sitesettings
169	Manage settings.	40	manage_settings
170	Manage translations.	40	manage_translations
171	Can add authorization key	41	add_authorizationkey
172	Can change authorization key	41	change_authorizationkey
173	Can delete authorization key	41	delete_authorizationkey
174	Can view authorization key	41	view_authorizationkey
175	Can add site settings translation	42	add_sitesettingstranslation
176	Can change site settings translation	42	change_sitesettingstranslation
177	Can delete site settings translation	42	delete_sitesettingstranslation
178	Can view site settings translation	42	view_sitesettingstranslation
179	Can add page	43	add_page
180	Can change page	43	change_page
181	Can delete page	43	delete_page
182	Can view page	43	view_page
183	Manage pages.	43	manage_pages
184	Can add page translation	44	add_pagetranslation
185	Can change page translation	44	change_pagetranslation
186	Can delete page translation	44	delete_pagetranslation
187	Can view page translation	44	view_pagetranslation
188	Can add transaction	45	add_transaction
189	Can change transaction	45	change_transaction
190	Can delete transaction	45	delete_transaction
191	Can view transaction	45	view_transaction
192	Can add payment	46	add_payment
193	Can change payment	46	change_payment
194	Can delete payment	46	delete_payment
195	Can view payment	46	view_payment
196	Can add conversion rate	47	add_conversionrate
197	Can change conversion rate	47	change_conversionrate
198	Can delete conversion rate	47	delete_conversionrate
199	Can view conversion rate	47	view_conversionrate
200	Can add vat	48	add_vat
201	Can change vat	48	change_vat
202	Can delete vat	48	delete_vat
203	Can view vat	48	view_vat
204	Can add rate types	49	add_ratetypes
205	Can change rate types	49	change_ratetypes
206	Can delete rate types	49	delete_ratetypes
207	Can view rate types	49	view_ratetypes
208	Can add association	50	add_association
209	Can change association	50	change_association
210	Can delete association	50	delete_association
211	Can view association	50	view_association
212	Can add code	51	add_code
213	Can change code	51	change_code
214	Can delete code	51	delete_code
215	Can view code	51	view_code
216	Can add nonce	52	add_nonce
217	Can change nonce	52	change_nonce
218	Can delete nonce	52	delete_nonce
219	Can view nonce	52	view_nonce
220	Can add user social auth	53	add_usersocialauth
221	Can change user social auth	53	change_usersocialauth
222	Can delete user social auth	53	delete_usersocialauth
223	Can view user social auth	53	view_usersocialauth
224	Can add partial	54	add_partial
225	Can change partial	54	change_partial
226	Can delete partial	54	delete_partial
227	Can view partial	54	view_partial
228	Can add task result	55	add_taskresult
229	Can change task result	55	change_taskresult
230	Can delete task result	55	delete_taskresult
231	Can view task result	55	view_taskresult
232	Can add impersonation log	56	add_impersonationlog
233	Can change impersonation log	56	change_impersonationlog
234	Can delete impersonation log	56	delete_impersonationlog
235	Can view impersonation log	56	view_impersonationlog
71	Can change skill type	17	change_skilltype
70	Can add skill type	17	add_skilltype
58	Can add skill image	14	add_skillimage
57	Manage skills	13	manage_skills
64	Can delete skill variant	15	delete_skillvariant
61	Can view skill image	14	view_skillimage
54	Can change skill	13	change_skill
60	Can delete skill image	14	delete_skillimage
65	Can view skill variant	15	view_skillvariant
55	Can delete skill	13	delete_skill
62	Can add skill variant	15	add_skillvariant
73	Can view skill type	17	view_skilltype
63	Can change skill variant	15	change_skillvariant
53	Can add skill	13	add_skill
59	Can change skill image	14	change_skillimage
72	Can delete skill type	17	delete_skilltype
236	Manage shipping.	37	manage_shipping
237	Can add shipping method country	57	add_shippingmethodcountry
238	Can change shipping method country	57	change_shippingmethodcountry
239	Can delete shipping method country	57	delete_shippingmethodcountry
240	Can view shipping method country	57	view_shippingmethodcountry
241	Can edit site settings	40	edit_settings
242	Can view site settings	40	view_settings
243	Can add attribute	58	add_attribute
244	Can change attribute	58	change_attribute
245	Can delete attribute	58	delete_attribute
246	Can view attribute	58	view_attribute
247	Can add attribute translation	59	add_attributetranslation
248	Can change attribute translation	59	change_attributetranslation
249	Can delete attribute translation	59	delete_attributetranslation
250	Can view attribute translation	59	view_attributetranslation
251	Can add attribute value	60	add_attributevalue
252	Can change attribute value	60	change_attributevalue
253	Can delete attribute value	60	delete_attributevalue
254	Can view attribute value	60	view_attributevalue
255	Can add attribute value translation	61	add_attributevaluetranslation
256	Can change attribute value translation	61	change_attributevaluetranslation
257	Can delete attribute value translation	61	delete_attributevaluetranslation
258	Can view attribute value translation	61	view_attributevaluetranslation
259	Can add category	62	add_category
260	Can change category	62	change_category
261	Can delete category	62	delete_category
262	Can view category	62	view_category
263	Can add category translation	63	add_categorytranslation
264	Can change category translation	63	change_categorytranslation
265	Can delete category translation	63	delete_categorytranslation
266	Can view category translation	63	view_categorytranslation
267	Can add collection	64	add_collection
268	Can change collection	64	change_collection
269	Can delete collection	64	delete_collection
270	Can view collection	64	view_collection
271	Can add collection translation	65	add_collectiontranslation
272	Can change collection translation	65	change_collectiontranslation
273	Can delete collection translation	65	delete_collectiontranslation
274	Can view collection translation	65	view_collectiontranslation
275	Can add skill	66	add_skill
276	Can change skill	66	change_skill
277	Can delete skill	66	delete_skill
278	Can view skill	66	view_skill
279	Manage Skills.	66	manage_Skills
280	Can add skill image	67	add_skillimage
281	Can change skill image	67	change_skillimage
282	Can delete skill image	67	delete_skillimage
283	Can view skill image	67	view_skillimage
284	Can add skill translation	68	add_skilltranslation
285	Can change skill translation	68	change_skilltranslation
286	Can delete skill translation	68	delete_skilltranslation
287	Can view skill translation	68	view_skilltranslation
288	Can add skill type	69	add_skilltype
289	Can change skill type	69	change_skilltype
290	Can delete skill type	69	delete_skilltype
291	Can view skill type	69	view_skilltype
292	Can add skill variant	70	add_skillvariant
293	Can change skill variant	70	change_skillvariant
294	Can delete skill variant	70	delete_skillvariant
295	Can view skill variant	70	view_skillvariant
296	Can add skill variant translation	71	add_skillvarianttranslation
297	Can change skill variant translation	71	change_skillvarianttranslation
298	Can delete skill variant translation	71	delete_skillvarianttranslation
299	Can view skill variant translation	71	view_skillvarianttranslation
300	Can add variant image	72	add_variantimage
301	Can change variant image	72	change_variantimage
302	Can delete variant image	72	delete_variantimage
303	Can view variant image	72	view_variantimage
304	Manage Skills.	66	manage_skills
305	Can add schedule	73	add_schedule
306	Can change schedule	73	change_schedule
307	Can delete schedule	73	delete_schedule
308	Can view schedule	73	view_schedule
\.


--
-- TOC entry 3540 (class 0 OID 0)
-- Dependencies: 192
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('auth_permission_id_seq', 308, true);


--
-- TOC entry 3541 (class 0 OID 0)
-- Dependencies: 235
-- Name: cart_cartline_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('cart_cartline_id_seq', 1, true);


--
-- TOC entry 3374 (class 0 OID 17074)
-- Dependencies: 234
-- Data for Name: checkout_cart; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY checkout_cart (created, last_change, email, token, quantity, user_id, billing_address_id, discount_amount, discount_name, note, delivery_address_id, delivery_method_id, voucher_code, translated_discount_name) FROM stdin;
\.


--
-- TOC entry 3376 (class 0 OID 17085)
-- Dependencies: 236
-- Data for Name: checkout_cartline; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY checkout_cartline (id, quantity, cart_id, variant_id, data) FROM stdin;
\.


--
-- TOC entry 3351 (class 0 OID 16692)
-- Dependencies: 211
-- Data for Name: delivery_deliverymethod; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY delivery_deliverymethod (id, name, maximum_task_price, maximum_task_weight, minimum_task_price, minimum_task_weight, price, type, delivery_zone_id) FROM stdin;
1	DHL	\N	\N	0.00	0	80.28	weight	1
2	UPS	\N	\N	0.00	0	45.60	price	1
3	Registred priority	\N	\N	0.00	0	41.46	price	1
4	DB Schenker	\N	\N	0.00	0	50.29	weight	1
5	FBA	\N	\N	0.00	0	63.13	weight	2
6	FedEx Express	\N	\N	0.00	0	33.55	weight	2
7	Oceania Air Mail	\N	\N	0.00	0	66.00	price	2
8	China Post	\N	\N	0.00	0	51.94	weight	3
9	TNT	\N	\N	0.00	0	26.23	price	3
10	Aramex	\N	\N	0.00	0	54.77	weight	3
11	EMS	\N	\N	0.00	0	96.40	weight	3
12	DHL	\N	\N	0.00	0	75.50	weight	4
13	UPS	\N	\N	0.00	0	49.29	weight	4
14	FedEx	\N	\N	0.00	0	13.56	weight	4
15	EMS	\N	\N	0.00	0	61.93	weight	4
16	Royale International	\N	\N	0.00	0	29.91	price	5
17	ACE	\N	\N	0.00	0	46.83	weight	5
18	fastway couriers	\N	\N	0.00	0	40.65	weight	5
19	Post Office	\N	\N	0.00	0	41.27	weight	5
\.


--
-- TOC entry 3449 (class 0 OID 19792)
-- Dependencies: 309
-- Data for Name: delivery_deliverymethodtranslation; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY delivery_deliverymethodtranslation (id, language_code, name, delivery_method_id) FROM stdin;
\.


--
-- TOC entry 3451 (class 0 OID 19800)
-- Dependencies: 311
-- Data for Name: delivery_deliveryzone; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY delivery_deliveryzone (id, name, countries, "default") FROM stdin;
1	Europe	AX,AL,AD,AT,BY,BE,BA,BG,HR,CZ,DK,EE,FO,FI,FR,DE,GI,GR,GG,VA,HU,IS,IE,IM,IT,JE,LV,LI,LT,LU,MK,MT,MD,MC,ME,NL,NO,PL,PT,RO,RU,SM,RS,SK,SI,ES,SJ,SE,CH,UA,GB	f
2	Oceania	AS,AU,CX,CC,CK,FJ,PF,GU,HM,KI,MH,FM,NR,NC,NZ,NU,NF,MP,PW,PG,PN,WS,SB,TK,TO,TV,UM,VU,WF	f
3	Asia	AF,AM,AZ,BH,BD,BT,BN,KH,CN,CY,GE,HK,IN,ID,IR,IQ,IL,JP,JO,KZ,KP,KR,KW,KG,LA,LB,MO,MY,MV,MN,MM,NP,OM,PK,PS,PH,QA,SA,SG,LK,SY,TW,TJ,TH,TL,TR,TM,AE,UZ,VN,YE	f
4	Americas	AI,AG,AR,AW,BS,BB,BZ,BM,BO,BQ,BV,BR,CA,KY,CL,CO,CR,CU,CW,DM,DO,EC,SV,FK,GF,GL,GD,GP,GT,GY,HT,HN,JM,MQ,MX,MS,NI,PA,PY,PE,PR,BL,KN,LC,MF,PM,VC,SX,GS,SR,TT,TC,US,UY,VE,VG,VI	f
5	Africa	DZ,AO,BJ,BW,IO,BF,BI,CV,CM,CF,TD,KM,CG,CD,CI,DJ,EG,GQ,ER,SZ,ET,TF,GA,GM,GH,GN,GW,KE,LS,LR,LY,MG,MW,ML,MR,MU,YT,MA,MZ,NA,NE,NG,RE,RW,SH,ST,SN,SC,SL,SO,ZA,SS,SD,TZ,TG,TN,UG,EH,ZM,ZW	f
\.


--
-- TOC entry 3367 (class 0 OID 16999)
-- Dependencies: 227
-- Data for Name: discount_sale; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY discount_sale (id, name, type, value, end_date, start_date) FROM stdin;
1	Happy firm day!	percentage	30.00	\N	2019-03-11
2	Happy painting day!	percentage	50.00	\N	2019-03-11
3	Happy budget day!	percentage	30.00	\N	2019-03-11
5	Happy put day!	percentage	40.00	\N	2019-03-11
4	Happy travel day!	percentage	50.00	\N	2019-03-11
\.


--
-- TOC entry 3369 (class 0 OID 17007)
-- Dependencies: 229
-- Data for Name: discount_sale_categories; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY discount_sale_categories (id, sale_id, category_id) FROM stdin;
\.


--
-- TOC entry 3542 (class 0 OID 0)
-- Dependencies: 228
-- Name: discount_sale_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('discount_sale_categories_id_seq', 1, false);


--
-- TOC entry 3392 (class 0 OID 18763)
-- Dependencies: 252
-- Data for Name: discount_sale_collections; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY discount_sale_collections (id, sale_id, collection_id) FROM stdin;
\.


--
-- TOC entry 3543 (class 0 OID 0)
-- Dependencies: 251
-- Name: discount_sale_collections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('discount_sale_collections_id_seq', 1, false);


--
-- TOC entry 3544 (class 0 OID 0)
-- Dependencies: 226
-- Name: discount_sale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('discount_sale_id_seq', 5, true);


--
-- TOC entry 3545 (class 0 OID 0)
-- Dependencies: 230
-- Name: discount_sale_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('discount_sale_products_id_seq', 22, true);


--
-- TOC entry 3371 (class 0 OID 17015)
-- Dependencies: 231
-- Data for Name: discount_sale_skills; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY discount_sale_skills (id, sale_id, skill_id) FROM stdin;
1	1	112
5	2	1
21	4	1
22	4	72
\.


--
-- TOC entry 3373 (class 0 OID 17051)
-- Dependencies: 233
-- Data for Name: discount_voucher; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY discount_voucher (id, type, name, code, usage_limit, used, start_date, end_date, discount_value_type, discount_value, min_amount_spent, apply_once_per_order, countries) FROM stdin;
1	shipping	Free shipping	FREESHIPPING	\N	0	2019-03-11	\N	percentage	100.00	\N	f	
2	value	Big order discount	DISCOUNT	\N	0	2019-03-11	\N	fixed	25.00	200.00	f	
\.


--
-- TOC entry 3394 (class 0 OID 18797)
-- Dependencies: 254
-- Data for Name: discount_voucher_categories; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY discount_voucher_categories (id, voucher_id, category_id) FROM stdin;
\.


--
-- TOC entry 3546 (class 0 OID 0)
-- Dependencies: 253
-- Name: discount_voucher_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('discount_voucher_categories_id_seq', 1, false);


--
-- TOC entry 3396 (class 0 OID 18805)
-- Dependencies: 256
-- Data for Name: discount_voucher_collections; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY discount_voucher_collections (id, voucher_id, collection_id) FROM stdin;
\.


--
-- TOC entry 3547 (class 0 OID 0)
-- Dependencies: 255
-- Name: discount_voucher_collections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('discount_voucher_collections_id_seq', 1, false);


--
-- TOC entry 3548 (class 0 OID 0)
-- Dependencies: 232
-- Name: discount_voucher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('discount_voucher_id_seq', 2, true);


--
-- TOC entry 3549 (class 0 OID 0)
-- Dependencies: 257
-- Name: discount_voucher_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('discount_voucher_products_id_seq', 1, false);


--
-- TOC entry 3398 (class 0 OID 18826)
-- Dependencies: 258
-- Data for Name: discount_voucher_skills; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY discount_voucher_skills (id, voucher_id, skill_id) FROM stdin;
\.


--
-- TOC entry 3400 (class 0 OID 18876)
-- Dependencies: 260
-- Data for Name: discount_vouchertranslation; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY discount_vouchertranslation (id, language_code, name, voucher_id) FROM stdin;
\.


--
-- TOC entry 3550 (class 0 OID 0)
-- Dependencies: 259
-- Name: discount_vouchertranslation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('discount_vouchertranslation_id_seq', 1, false);


--
-- TOC entry 3402 (class 0 OID 18892)
-- Dependencies: 262
-- Data for Name: django_celery_results_taskresult; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY django_celery_results_taskresult (id, task_id, status, content_type, content_encoding, result, date_done, traceback, hidden, meta, task_args, task_kwargs, task_name) FROM stdin;
\.


--
-- TOC entry 3551 (class 0 OID 0)
-- Dependencies: 261
-- Name: django_celery_results_taskresult_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('django_celery_results_taskresult_id_seq', 1, false);


--
-- TOC entry 3331 (class 0 OID 16408)
-- Dependencies: 191
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY django_content_type (id, app_label, model, name) FROM stdin;
1	contenttypes	contenttype	\N
2	sessions	session	\N
3	sites	site	\N
4	auth	permission	\N
5	auth	group	\N
6	account	user	\N
7	account	address	\N
8	account	customernote	\N
9	discount	sale	\N
10	discount	voucher	\N
11	discount	vouchertranslation	\N
12	product	category	\N
13	product	product	\N
14	product	productimage	\N
15	product	productvariant	\N
16	product	variantimage	\N
17	product	producttype	\N
18	product	collection	\N
19	product	categorytranslation	\N
20	product	collectiontranslation	\N
21	product	producttranslation	\N
22	product	productvarianttranslation	\N
23	product	attribute	\N
24	product	attributevaluetranslation	\N
25	product	attributevalue	\N
26	product	attributetranslation	\N
27	checkout	cart	\N
28	checkout	cartline	\N
29	menu	menu	\N
30	menu	menuitem	\N
31	menu	menuitemtranslation	\N
32	order	order	\N
33	order	orderline	\N
34	order	fulfillment	\N
35	order	fulfillmentline	\N
36	order	orderevent	\N
37	shipping	shippingmethod	\N
38	shipping	shippingmethodtranslation	\N
39	shipping	shippingzone	\N
40	site	sitesettings	\N
41	site	authorizationkey	\N
42	site	sitesettingstranslation	\N
43	page	page	\N
44	page	pagetranslation	\N
45	payment	transaction	\N
46	payment	payment	\N
47	django_prices_openexchangerates	conversionrate	\N
48	django_prices_vatlayer	vat	\N
49	django_prices_vatlayer	ratetypes	\N
50	social_django	association	\N
51	social_django	code	\N
52	social_django	nonce	\N
53	social_django	usersocialauth	\N
54	social_django	partial	\N
55	django_celery_results	taskresult	\N
56	impersonate	impersonationlog	\N
57	shipping	shippingmethodcountry	\N
58	skill	attribute	\N
59	skill	attributetranslation	\N
60	skill	attributevalue	\N
61	skill	attributevaluetranslation	\N
62	skill	category	\N
63	skill	categorytranslation	\N
64	skill	collection	\N
65	skill	collectiontranslation	\N
66	skill	skill	\N
67	skill	skillimage	\N
68	skill	skilltranslation	\N
69	skill	skilltype	\N
70	skill	skillvariant	\N
71	skill	skillvarianttranslation	\N
72	skill	variantimage	\N
73	account	schedule	\N
\.


--
-- TOC entry 3552 (class 0 OID 0)
-- Dependencies: 190
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('django_content_type_id_seq', 73, true);


--
-- TOC entry 3329 (class 0 OID 16397)
-- Dependencies: 189
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2019-03-06 18:40:42.959663+02
2	skill	0001_initial	2019-03-06 18:42:11.549865+02
3	auth	0001_initial	2019-03-06 18:40:43.103165+02
262	menu	0001_initial	2019-03-06 18:41:12.933546+02
379	django_celery_results	0002_add_task_name_args_kwargs	2019-03-25 19:08:11.598607+02
380	django_celery_results	0003_auto_20181106_1101	2019-03-25 19:08:11.602598+02
388	sites	0002_alter_domain_unique	2019-03-25 19:20:36.576342+02
9	userprofile	0001_initial	2019-03-06 18:40:43.410153+02
404	skill	0003_auto_20190327_1321	2019-03-27 13:23:24.678949+02
407	account	0004_auto_20190408_0910	2019-04-08 09:10:42.324116+02
36	delivery	0001_initial	2019-03-06 18:40:44.659976+02
381	django_prices_openexchangerates	0002_auto_20160329_0702	2019-03-25 19:09:20.824508+02
382	django_prices_openexchangerates	0003_auto_20161018_0707	2019-03-25 19:09:20.852681+02
383	django_prices_openexchangerates	0004_auto_20170316_0944	2019-03-25 19:09:20.857978+02
389	default	0002_add_related_name	2019-03-25 19:21:00.828368+02
390	social_auth	0002_add_related_name	2019-03-25 19:21:00.831364+02
391	default	0003_alter_email_max_length	2019-03-25 19:21:00.84034+02
392	social_auth	0003_alter_email_max_length	2019-03-25 19:21:00.842334+02
393	default	0004_auto_20160423_0400	2019-03-25 19:21:00.858291+02
394	social_auth	0004_auto_20160423_0400	2019-03-25 19:21:00.860286+02
340	skill	0004_auto_20190327_2016	2019-03-27 20:16:00.678949+02
341	account	0002_auto_20190327_2016	2019-03-27 13:23:24.678949+02
408	account	0005_auto_20190408_1634	2019-04-08 16:34:57.969801+02
195	django_celery_results	0001_initial	2019-03-06 18:41:01.491373+02
198	django_prices_openexchangerates	0001_initial	2019-03-06 18:41:01.617746+02
202	django_prices_vatlayer	0001_initial	2019-03-06 18:41:01.83053+02
205	impersonate	0001_initial	2019-03-06 18:41:02.062321+02
206	page	0001_initial	2019-03-06 18:41:02.135436+02
369	contenttypes	0002_remove_content_type_name	2019-03-25 18:57:03.596584+02
370	auth	0002_alter_permission_name_max_length	2019-03-25 18:57:03.60955+02
371	auth	0003_alter_user_email_max_length	2019-03-25 18:57:03.613539+02
372	auth	0004_alter_user_username_opts	2019-03-25 18:57:03.616532+02
373	auth	0005_alter_user_last_login_null	2019-03-25 18:57:03.620521+02
374	auth	0006_require_contenttypes_0002	2019-03-25 18:57:03.623513+02
375	auth	0007_alter_validators_add_error_messages	2019-03-25 18:57:03.626506+02
376	auth	0008_alter_user_username_max_length	2019-03-25 18:57:03.630494+02
377	auth	0009_alter_user_last_name_max_length	2019-03-25 18:57:03.635481+02
384	django_prices_vatlayer	0002_ratetypes	2019-03-25 19:10:25.602219+02
385	django_prices_vatlayer	0003_auto_20180316_1053	2019-03-25 19:10:25.610196+02
395	social_auth	0005_auto_20160727_2333	2019-03-25 19:26:04.146632+02
396	social_django	0006_partial	2019-03-25 19:26:04.155608+02
397	social_django	0007_code_timestamp	2019-03-25 19:26:04.157602+02
398	social_django	0008_partial_timestamp	2019-03-25 19:26:04.159604+02
399	social_django	0002_add_related_name	2019-03-25 19:26:04.162589+02
400	social_django	0005_auto_20160727_2333	2019-03-25 19:26:04.164584+02
401	social_django	0004_auto_20160423_0400	2019-03-25 19:26:04.165581+02
402	social_django	0003_alter_email_max_length	2019-03-25 19:26:04.167576+02
409	account	0006_remove_user_time_availability	2019-04-09 12:49:22.459145+02
410	skill	0005_auto_20190409_1249	2019-04-09 12:49:22.589757+02
261	sites	0001_initial	2019-03-06 18:41:06.806522+02
263	site	0001_initial	2019-03-06 18:41:06.861443+02
307	sessions	0001_initial	2019-03-06 18:41:11.549865+02
316	default	0001_initial	2019-03-06 18:41:12.540162+02
317	social_auth	0001_initial	2019-03-06 18:41:12.5431+02
378	discount	0001_initial	2019-03-25 19:01:55.080345+02
387	payment	0001_initial	2019-03-25 19:11:22.978914+02
403	skill	0002_auto_20190327_1217	2019-03-27 12:38:13.758011+02
406	account	0003_auto_20190407_1139	2019-04-08 07:20:36.405513+02
386	task	0001_initial	2019-03-25 19:11:22.896135+02
339	account	0001_initial	2019-03-06 18:41:12.905396+02
344	checkout	0001_initial	2019-03-06 18:41:12.916071+02
353	social_django	0001_initial	2019-03-06 18:41:12.933546+02
\.


--
-- TOC entry 3553 (class 0 OID 0)
-- Dependencies: 188
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('django_migrations_id_seq', 410, true);


--
-- TOC entry 3404 (class 0 OID 18907)
-- Dependencies: 264
-- Data for Name: django_prices_openexchangerates_conversionrate; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY django_prices_openexchangerates_conversionrate (id, to_currency, rate, modified_at) FROM stdin;
\.


--
-- TOC entry 3554 (class 0 OID 0)
-- Dependencies: 263
-- Name: django_prices_openexchangerates_conversionrate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('django_prices_openexchangerates_conversionrate_id_seq', 1, false);


--
-- TOC entry 3408 (class 0 OID 18941)
-- Dependencies: 268
-- Data for Name: django_prices_vatlayer_ratetypes; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY django_prices_vatlayer_ratetypes (id, types) FROM stdin;
\.


--
-- TOC entry 3555 (class 0 OID 0)
-- Dependencies: 267
-- Name: django_prices_vatlayer_ratetypes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('django_prices_vatlayer_ratetypes_id_seq', 1, false);


--
-- TOC entry 3406 (class 0 OID 18930)
-- Dependencies: 266
-- Data for Name: django_prices_vatlayer_vat; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY django_prices_vatlayer_vat (id, country_code, data) FROM stdin;
\.


--
-- TOC entry 3556 (class 0 OID 0)
-- Dependencies: 265
-- Name: django_prices_vatlayer_vat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('django_prices_vatlayer_vat_id_seq', 1, false);


--
-- TOC entry 3447 (class 0 OID 19780)
-- Dependencies: 307
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY django_session (session_key, session_data, expire_date) FROM stdin;
gsalw1rgzbuslvhtz1u24fb1j0zwegm7	MTk3MDZjYTdjMDVmNjUyYTQwN2Y5MjA4ZGYxZjAwNWVhYTJkOWQ2Yjp7Il9hdXRoX3VzZXJfaWQiOiIxIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJiMzJhNTRmZmYwZmRmYThkZjA2YmQzNDlmYjk3ZDlhZTkxNGYzZDQxIn0=	2019-04-10 11:44:45.048031+02
049mfv8e4p2jorbl3ildyf6iez635gxe	YjU0ODAyNGVkNGQxMTk0ZWExM2NkZjFhMThkZGIxZDk0MTdiZDNkZTp7Il9hdXRoX3VzZXJfaWQiOiIyIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJmYzg0ZDNkOGQyZWRmYTY1MzA3YmY4NTk5YjBkYTQwYTllNzAwNDZjIn0=	2019-03-21 10:55:13.384766+02
g4jwtz4zbae1n462lc3je2uz5wphfz2k	YjU0ODAyNGVkNGQxMTk0ZWExM2NkZjFhMThkZGIxZDk0MTdiZDNkZTp7Il9hdXRoX3VzZXJfaWQiOiIyIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJmYzg0ZDNkOGQyZWRmYTY1MzA3YmY4NTk5YjBkYTQwYTllNzAwNDZjIn0=	2019-05-06 10:31:09.756958+02
kx8dod9ooq0wiukedud5whk081xr02fd	MTk3MDZjYTdjMDVmNjUyYTQwN2Y5MjA4ZGYxZjAwNWVhYTJkOWQ2Yjp7Il9hdXRoX3VzZXJfaWQiOiIxIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJiMzJhNTRmZmYwZmRmYThkZjA2YmQzNDlmYjk3ZDlhZTkxNGYzZDQxIn0=	2019-05-15 20:03:53.177394+02
daq738uj10cx0ru0fdsf2x4ahuiqek8t	MTk3MDZjYTdjMDVmNjUyYTQwN2Y5MjA4ZGYxZjAwNWVhYTJkOWQ2Yjp7Il9hdXRoX3VzZXJfaWQiOiIxIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJiMzJhNTRmZmYwZmRmYThkZjA2YmQzNDlmYjk3ZDlhZTkxNGYzZDQxIn0=	2019-06-02 15:21:31.616513+02
z1rp4v24asnh2xle18l0y6q8s3w35u5u	YjU0ODAyNGVkNGQxMTk0ZWExM2NkZjFhMThkZGIxZDk0MTdiZDNkZTp7Il9hdXRoX3VzZXJfaWQiOiIyIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJmYzg0ZDNkOGQyZWRmYTY1MzA3YmY4NTk5YjBkYTQwYTllNzAwNDZjIn0=	2019-06-09 19:55:31.259857+02
\.


--
-- TOC entry 3428 (class 0 OID 19330)
-- Dependencies: 288
-- Data for Name: django_site; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY django_site (id, domain, name) FROM stdin;
1	localhost:8000	Remote work platform
\.


--
-- TOC entry 3557 (class 0 OID 0)
-- Dependencies: 287
-- Name: django_site_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('django_site_id_seq', 1, true);


--
-- TOC entry 3410 (class 0 OID 18954)
-- Dependencies: 270
-- Data for Name: impersonate_impersonationlog; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY impersonate_impersonationlog (id, session_key, session_started_at, session_ended_at, impersonating_id, impersonator_id) FROM stdin;
\.


--
-- TOC entry 3558 (class 0 OID 0)
-- Dependencies: 269
-- Name: impersonate_impersonationlog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('impersonate_impersonationlog_id_seq', 1, false);


--
-- TOC entry 3414 (class 0 OID 18988)
-- Dependencies: 274
-- Data for Name: menu_menu; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY menu_menu (id, name, json_content) FROM stdin;
2	footer	[]
1	navbar	[]
\.


--
-- TOC entry 3559 (class 0 OID 0)
-- Dependencies: 273
-- Name: menu_menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('menu_menu_id_seq', 2, true);


--
-- TOC entry 3416 (class 0 OID 18998)
-- Dependencies: 276
-- Data for Name: menu_menuitem; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY menu_menuitem (id, name, sort_order, url, lft, rght, tree_id, level, category_id, collection_id, menu_id, page_id, parent_id) FROM stdin;
\.


--
-- TOC entry 3560 (class 0 OID 0)
-- Dependencies: 275
-- Name: menu_menuitem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('menu_menuitem_id_seq', 1, true);


--
-- TOC entry 3418 (class 0 OID 19054)
-- Dependencies: 278
-- Data for Name: menu_menuitemtranslation; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY menu_menuitemtranslation (id, language_code, name, menu_item_id) FROM stdin;
\.


--
-- TOC entry 3561 (class 0 OID 0)
-- Dependencies: 277
-- Name: menu_menuitemtranslation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('menu_menuitemtranslation_id_seq', 1, false);


--
-- TOC entry 3562 (class 0 OID 0)
-- Dependencies: 247
-- Name: order_fulfillment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('order_fulfillment_id_seq', 2, true);


--
-- TOC entry 3563 (class 0 OID 0)
-- Dependencies: 249
-- Name: order_fulfillmentline_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('order_fulfillmentline_id_seq', 4, true);


--
-- TOC entry 3564 (class 0 OID 0)
-- Dependencies: 243
-- Name: order_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('order_order_id_seq', 3, true);


--
-- TOC entry 3565 (class 0 OID 0)
-- Dependencies: 245
-- Name: order_ordereditem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('order_ordereditem_id_seq', 7, true);


--
-- TOC entry 3566 (class 0 OID 0)
-- Dependencies: 279
-- Name: order_orderevent_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('order_orderevent_id_seq', 6, true);


--
-- TOC entry 3412 (class 0 OID 18974)
-- Dependencies: 272
-- Data for Name: page_page; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY page_page (id, slug, title, content, created, is_published, publication_date, seo_description, seo_title, content_json) FROM stdin;
\.


--
-- TOC entry 3567 (class 0 OID 0)
-- Dependencies: 271
-- Name: page_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('page_page_id_seq', 1, false);


--
-- TOC entry 3426 (class 0 OID 19276)
-- Dependencies: 286
-- Data for Name: page_pagetranslation; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY page_pagetranslation (id, seo_title, seo_description, language_code, title, content, page_id, content_json) FROM stdin;
\.


--
-- TOC entry 3568 (class 0 OID 0)
-- Dependencies: 285
-- Name: page_pagetranslation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('page_pagetranslation_id_seq', 1, false);


--
-- TOC entry 3422 (class 0 OID 19217)
-- Dependencies: 282
-- Data for Name: payment_payment; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY payment_payment (id, gateway, is_active, created, modified, charge_status, billing_first_name, billing_last_name, billing_company_name, billing_address_1, billing_address_2, billing_city, billing_city_area, billing_postal_code, billing_country_code, billing_country_area, billing_email, customer_ip_address, cc_brand, cc_exp_month, cc_exp_year, cc_first_digits, cc_last_digits, extra_data, token, currency, total, captured_amount, checkout_id, task_id) FROM stdin;
1	dummy	t	2019-03-11 14:56:12.54844+02	2019-03-11 14:56:12.54844+02	fully-charged				Sugarbird	12	JOHANNESBURG		1684	ZA		d_aana@yahoo.com	127.0.0.1		\N	\N			{'customer_user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'}		USD	12.00	12.00	\N	1
2	dummy	f	2019-03-11 15:30:30.754164+02	2019-03-11 15:30:30.754164+02	not-charged	Jared	Thomas		4438 Hamilton Terrace Suite 766		Kylieburgh		72650	TT			198.51.101.111		\N	\N			{}	138e3dd5-e7ea-47e0-ac00-0c084298d400	USD	424.28	0.00	\N	2
\.


--
-- TOC entry 3569 (class 0 OID 0)
-- Dependencies: 281
-- Name: payment_paymentmethod_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('payment_paymentmethod_id_seq', 2, true);


--
-- TOC entry 3424 (class 0 OID 19230)
-- Dependencies: 284
-- Data for Name: payment_transaction; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY payment_transaction (id, created, token, kind, is_success, error, currency, amount, gateway_response, payment_id) FROM stdin;
1	2019-03-11 14:56:29.33375+02	fully-charged	auth	t	\N	USD	12.00	{"kind": "auth", "error": null, "amount": "12.00", "currency": "USD", "is_success": true, "transaction_id": "fully-charged"}	1
2	2019-03-11 14:56:29.372792+02	fully-charged	capture	t	\N	USD	12.00	{"kind": "capture", "error": null, "amount": "12.00", "currency": "USD", "is_success": true, "transaction_id": "fully-charged"}	1
3	2019-03-11 15:30:30.762679+02	138e3dd5-e7ea-47e0-ac00-0c084298d400	auth	t	\N	USD	424.28	{"kind": "auth", "error": null, "amount": "424.28", "currency": "USD", "is_success": true, "transaction_id": "138e3dd5-e7ea-47e0-ac00-0c084298d400"}	2
4	2019-03-11 15:30:30.771274+02	138e3dd5-e7ea-47e0-ac00-0c084298d400	void	t	\N	USD	424.28	{"kind": "void", "error": null, "amount": "424.28", "currency": "USD", "is_success": true, "transaction_id": "138e3dd5-e7ea-47e0-ac00-0c084298d400"}	2
\.


--
-- TOC entry 3570 (class 0 OID 0)
-- Dependencies: 283
-- Name: payment_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('payment_transaction_id_seq', 4, true);


--
-- TOC entry 3571 (class 0 OID 0)
-- Dependencies: 212
-- Name: product_attributechoicevalue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('product_attributechoicevalue_id_seq', 3, true);


--
-- TOC entry 3572 (class 0 OID 0)
-- Dependencies: 295
-- Name: product_attributechoicevaluetranslation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('product_attributechoicevaluetranslation_id_seq', 1, false);


--
-- TOC entry 3573 (class 0 OID 0)
-- Dependencies: 214
-- Name: product_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('product_category_id_seq', 1, true);


--
-- TOC entry 3574 (class 0 OID 0)
-- Dependencies: 297
-- Name: product_categorytranslation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('product_categorytranslation_id_seq', 1, false);


--
-- TOC entry 3575 (class 0 OID 0)
-- Dependencies: 239
-- Name: product_collection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('product_collection_id_seq', 1, true);


--
-- TOC entry 3576 (class 0 OID 0)
-- Dependencies: 241
-- Name: product_collection_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('product_collection_products_id_seq', 9, true);


--
-- TOC entry 3577 (class 0 OID 0)
-- Dependencies: 299
-- Name: product_collectiontranslation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('product_collectiontranslation_id_seq', 1, false);


--
-- TOC entry 3578 (class 0 OID 0)
-- Dependencies: 216
-- Name: product_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('product_product_id_seq', 2, true);


--
-- TOC entry 3579 (class 0 OID 0)
-- Dependencies: 218
-- Name: product_productattribute_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('product_productattribute_id_seq', 1, false);


--
-- TOC entry 3580 (class 0 OID 0)
-- Dependencies: 301
-- Name: product_productattributetranslation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('product_productattributetranslation_id_seq', 1, false);


--
-- TOC entry 3581 (class 0 OID 0)
-- Dependencies: 237
-- Name: product_productclass_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('product_productclass_id_seq', 1, true);


--
-- TOC entry 3582 (class 0 OID 0)
-- Dependencies: 220
-- Name: product_productimage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('product_productimage_id_seq', 51, true);


--
-- TOC entry 3583 (class 0 OID 0)
-- Dependencies: 303
-- Name: product_producttranslation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('product_producttranslation_id_seq', 1, false);


--
-- TOC entry 3584 (class 0 OID 0)
-- Dependencies: 222
-- Name: product_productvariant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('product_productvariant_id_seq', 2, true);


--
-- TOC entry 3585 (class 0 OID 0)
-- Dependencies: 305
-- Name: product_productvarianttranslation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('product_productvarianttranslation_id_seq', 1, false);


--
-- TOC entry 3586 (class 0 OID 0)
-- Dependencies: 224
-- Name: product_variantimage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('product_variantimage_id_seq', 1, false);


--
-- TOC entry 3587 (class 0 OID 0)
-- Dependencies: 210
-- Name: shipping_shippingmethod_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('shipping_shippingmethod_id_seq', 19, true);


--
-- TOC entry 3588 (class 0 OID 0)
-- Dependencies: 308
-- Name: shipping_shippingmethodtranslation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('shipping_shippingmethodtranslation_id_seq', 1, false);


--
-- TOC entry 3589 (class 0 OID 0)
-- Dependencies: 310
-- Name: shipping_shippingzone_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('shipping_shippingzone_id_seq', 5, true);


--
-- TOC entry 3432 (class 0 OID 19365)
-- Dependencies: 292
-- Data for Name: site_authorizationkey; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY site_authorizationkey (id, name, key, password, site_settings_id) FROM stdin;
\.


--
-- TOC entry 3590 (class 0 OID 0)
-- Dependencies: 291
-- Name: site_authorizationkey_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('site_authorizationkey_id_seq', 1, false);


--
-- TOC entry 3430 (class 0 OID 19341)
-- Dependencies: 290
-- Data for Name: site_sitesettings; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY site_sitesettings (id, header_text, description, site_id, bottom_menu_id, top_menu_id, display_gross_prices, include_taxes_in_prices, charge_taxes_on_delivery, track_inventory_by_default, homepage_collection_id, default_weight_unit) FROM stdin;
1	Remote work platform		1	2	1	t	t	t	t	1	kg
\.


--
-- TOC entry 3591 (class 0 OID 0)
-- Dependencies: 289
-- Name: site_sitesettings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('site_sitesettings_id_seq', 1, true);


--
-- TOC entry 3434 (class 0 OID 19452)
-- Dependencies: 294
-- Data for Name: site_sitesettingstranslation; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY site_sitesettingstranslation (id, language_code, header_text, description, site_settings_id) FROM stdin;
\.


--
-- TOC entry 3592 (class 0 OID 0)
-- Dependencies: 293
-- Name: site_sitesettingstranslation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('site_sitesettingstranslation_id_seq', 1, false);


--
-- TOC entry 3359 (class 0 OID 16771)
-- Dependencies: 219
-- Data for Name: skill_attribute; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY skill_attribute (id, slug, name, skill_type_id, skill_variant_type_id) FROM stdin;
15	bottle-size	Size	11	\N
18	bucket-size	Size	\N	7
20	volume	Volume	10	\N
21	bigdata	Big Data	11	\N
23	framework	Framework	12	\N
16	framework	Framework	9	\N
19	library	Library	8	\N
25	platform	Platform	14	\N
13	size	Size	\N	\N
22	cushion-size	Size	\N	\N
\.


--
-- TOC entry 3442 (class 0 OID 19501)
-- Dependencies: 302
-- Data for Name: skill_attributetranslation; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY skill_attributetranslation (id, language_code, name, attribute_id) FROM stdin;
\.


--
-- TOC entry 3353 (class 0 OID 16729)
-- Dependencies: 213
-- Data for Name: skill_attributevalue; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY skill_attributevalue (id, name, attribute_id, slug, sort_order, value) FROM stdin;
36	S	13	s	0	
37	M	13	m	1	
38	L	13	l	2	
39	XL	13	xl	3	
40	XXL	13	xxl	4	
46	500ml	15	500ml	0	
47	1l	15	1l	1	
48	2l	15	2l	2	
60	1l	18	1l	0	
61	2.5l	18	25l	1	
62	5l	18	5l	2	
67	700ml	20	700ml	0	
70	45cm x 45cm	22	45cm-x-45cm	0	
71	55cm x 55cm	22	55cm-x-55cm	1	
69	MapReduce	21	mapreduce	0	
72	Spring	23	spring	0	
73	ICEFaces	23	icefaces	1	
74	Hibernate	23	hibernate	2	
49	jQuery	16	jquery	0	
50	NHibernate	16	nhibernate	1	
51	LINQ	16	linq	2	
63	Keras	19	keras	0	
64	Theano	19	theano	1	
65	Pandas	19	pandas	2	
66	SciKit	19	scikit	3	
82	Python	25	python	0	
3	R	25	r	1	
\.


--
-- TOC entry 3436 (class 0 OID 19471)
-- Dependencies: 296
-- Data for Name: skill_attributevaluetranslation; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY skill_attributevaluetranslation (id, language_code, name, attribute_value_id) FROM stdin;
\.


--
-- TOC entry 3355 (class 0 OID 16737)
-- Dependencies: 215
-- Data for Name: skill_category; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY skill_category (id, name, slug, description, lft, rght, tree_id, level, parent_id, background_image, seo_description, seo_title, background_image_alt, description_json) FROM stdin;
1	Analysis help	analysis-help		1	2	1	0	\N					{}
7	Data Analytics	data-analytics		1	2	1	0	\N	category-backgrounds/DEMO-04.jpg				{}
8	Programming	programming		1	2	2	0	\N	category-backgrounds/groceries.jpg				{}
9	Miscellaneous	miscellaneous		1	2	3	0	\N	category-backgrounds/cos.jpg				{}
\.


--
-- TOC entry 3438 (class 0 OID 19479)
-- Dependencies: 298
-- Data for Name: skill_categorytranslation; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY skill_categorytranslation (id, seo_title, seo_description, language_code, name, description, category_id, description_json) FROM stdin;
\.


--
-- TOC entry 3380 (class 0 OID 18067)
-- Dependencies: 240
-- Data for Name: skill_collection; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY skill_collection (id, name, slug, background_image, seo_description, seo_title, is_published, description, publication_date, background_image_alt, description_json) FROM stdin;
1	Featured skills	featured-skills				t		\N		{}
\.


--
-- TOC entry 3382 (class 0 OID 18077)
-- Dependencies: 242
-- Data for Name: skill_collection_skills; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY skill_collection_skills (id, collection_id, skill_id) FROM stdin;
1	1	1
2	1	72
3	1	74
4	1	79
5	1	112
6	1	111
7	1	114
8	1	113
9	1	2
\.


--
-- TOC entry 3440 (class 0 OID 19490)
-- Dependencies: 300
-- Data for Name: skill_collectiontranslation; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY skill_collectiontranslation (id, seo_title, seo_description, language_code, name, collection_id, description, description_json) FROM stdin;
\.


--
-- TOC entry 3357 (class 0 OID 16760)
-- Dependencies: 217
-- Data for Name: skill_skill; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY skill_skill (id, name, description, price, publication_date, updated_at, skill_type_id, attributes, is_published, category_id, seo_description, seo_title, charge_taxes, tax_rate, description_json, owner_id, experience_years) FROM stdin;
2	Linear regression, logistic regression	<p>Linear regression, logistic regression</p>	35.00	\N	2019-03-18 17:49:20.616771+02	1		t	7	Linear regression, logistic regression	Linear regression, logistic regression	t	standard	{}	1	\N
1	Stats calculation	<p>Stats calculation</p>	12.00	\N	2019-03-07 10:55:12.736489+02	1		t	1	Stats calculation		t	standard	{}	1	\N
111	Machine Learning and AI	<p>Machine Learning and AI<br></p>	30.00	\N	2019-03-17 14:05:51.567995+02	14	"25"=>"82"	t	7	Machine Learning and AI		t	standard	{}	1	\N
72	C# programming	<p>c# programming - all types</p>	3.00	\N	2019-03-16 16:39:28.863888+02	9	"16"=>"3"	t	1	c# programming - all types		t	standard	{}	1	\N
114	Data Engineering	<p>Data Engineering</p>	30.00	\N	2019-03-17 14:08:52.641783+02	11		t	7	Data Engineering		t	standard	{}	1	\N
113	Big Data	<p>Big Data<br></p>	30.00	\N	2019-03-17 14:11:42.657665+02	11		t	7	Big Data		t	standard	{}	1	\N
112	Web development	<p>Classic web development.</p>	30.00	\N	2019-03-17 14:00:59.597731+02	9		t	9	classic web development.		t	standard	{}	1	\N
79	Tableau dashboards	<p>Beautiful visualizations and analytics</p>	3.00	\N	2019-03-17 12:30:44.372021+02	14	"16"=>"51"	t	7	Beautiful visualizations and analytics		t	standard	{}	1	\N
74	Python programming	<p>Python&nbsp;</p>	3.00	\N	2019-03-17 12:25:47.360586+02	9	"16"=>"50"	t	8	Build your data and web applications		t	standard	{}	1	\N
\.


--
-- TOC entry 3361 (class 0 OID 16781)
-- Dependencies: 221
-- Data for Name: skill_skillimage; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY skill_skillimage (id, image, ppoi, alt, sort_order, skill_type_id) FROM stdin;
7	products/Microsoft_.NET_logo_yjeACAr.png	0.5x0.5		0	1
51	products/stats1_kSuP9Ku.jfif	0.5x0.5		0	1
9	products/python_xrOy2uN.jfif	0.5x0.5		0	1
14	products/visualisation_eb1tnh0.jfif	0.5x0.5		0	1
40	products/download.jfif	0.5x0.5		0	1
37	products/classification_DHigUwZ.jfif	0.5x0.5		0	1
44	products/data_MlLpHpu.png	0.5x0.5		0	1
42	products/bigdata_Xqz6b6e.jfif	0.5x0.5		0	1
\.


--
-- TOC entry 3444 (class 0 OID 19509)
-- Dependencies: 304
-- Data for Name: skill_skilltranslation; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY skill_skilltranslation (id, seo_title, seo_description, language_code, name, description, skill_id, description_json) FROM stdin;
\.


--
-- TOC entry 3378 (class 0 OID 17255)
-- Dependencies: 238
-- Data for Name: skill_skilltype; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY skill_skilltype (id, name, has_variants, is_delivery_required, tax_rate, weight) FROM stdin;
1	Statistics	f	f	standard	0
7	Business analysis	t	t	standard	1000
10	Machine learning	f	f	standard	1000
13	Infrastructure support	t	f	standard	1000
11	Database engineering	f	f	standard	1000
9	C# Programming	t	f	standard	1000
8	Python programming	t	f	standard	200
14	Data analysis	t	f	standard	1000
12	Java programming	t	f	standard	500
\.


--
-- TOC entry 3363 (class 0 OID 16790)
-- Dependencies: 223
-- Data for Name: skill_skillvariant; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY skill_skillvariant (id, sku, name, price_override, skill_id, attributes, cost_price, quantity, quantity_allocated, track_inventory, weight) FROM stdin;
210	40636347	2l	7.00	74	"15"=>"48"	2.00	217	6	t	2000
2	40		\N	2		\N	40	0	t	\N
208	45328412	500ml	\N	74	"15"=>"46"	1.00	1214	3	t	1000
209	27512590	1l	5.00	74	"15"=>"47"	1.50	184	9	t	1000
1	2323		\N	1		\N	30	3	t	\N
202	93855755		\N	72		1.00	1000	7	t	0
223	Visualization		\N	79		1.00	1221	10	t	1000
225	Analysis		7.00	79		2.00	228	17	t	2000
224	Insights		5.00	79		1.50	177	2	t	1000
281	java-web		\N	112		10.00	1213	0	t	0
282	Django		\N	112		10.00	2	1	t	0
283	Scala		\N	112		10.00	9818	0	t	0
277	Classification		\N	111		10.00	1	0	t	0
278	Neural Nets		\N	111		10.00	9818	0	t	0
279	NLP		\N	111		10.00	1	0	t	0
280	Image recognition		\N	111		10.00	5794	3	t	0
291	Databases		\N	114		10.00	1213	0	t	0
292	Infrastructure		\N	114		10.00	1	0	t	0
286	Hadoop		\N	113		10.00	1213	0	t	0
287	MongoDB		\N	113		10.00	6	5	t	0
288	Spark		\N	113		10.00	9818	0	t	0
\.


--
-- TOC entry 3446 (class 0 OID 19520)
-- Dependencies: 306
-- Data for Name: skill_skillvarianttranslation; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY skill_skillvarianttranslation (id, language_code, name, skill_variant_id) FROM stdin;
\.


--
-- TOC entry 3365 (class 0 OID 16979)
-- Dependencies: 225
-- Data for Name: skill_variantimage; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY skill_variantimage (id, image_id, variant_id) FROM stdin;
\.


--
-- TOC entry 3453 (class 0 OID 19860)
-- Dependencies: 313
-- Data for Name: social_auth_association; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY social_auth_association (id, server_url, handle, secret, issued, lifetime, assoc_type) FROM stdin;
\.


--
-- TOC entry 3593 (class 0 OID 0)
-- Dependencies: 312
-- Name: social_auth_association_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('social_auth_association_id_seq', 1, false);


--
-- TOC entry 3455 (class 0 OID 19871)
-- Dependencies: 315
-- Data for Name: social_auth_code; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY social_auth_code (id, email, code, verified, "timestamp") FROM stdin;
\.


--
-- TOC entry 3594 (class 0 OID 0)
-- Dependencies: 314
-- Name: social_auth_code_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('social_auth_code_id_seq', 1, false);


--
-- TOC entry 3457 (class 0 OID 19879)
-- Dependencies: 317
-- Data for Name: social_auth_nonce; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY social_auth_nonce (id, server_url, "timestamp", salt) FROM stdin;
\.


--
-- TOC entry 3595 (class 0 OID 0)
-- Dependencies: 316
-- Name: social_auth_nonce_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('social_auth_nonce_id_seq', 1, false);


--
-- TOC entry 3461 (class 0 OID 19921)
-- Dependencies: 321
-- Data for Name: social_auth_partial; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY social_auth_partial (id, token, next_step, backend, data, "timestamp") FROM stdin;
\.


--
-- TOC entry 3596 (class 0 OID 0)
-- Dependencies: 320
-- Name: social_auth_partial_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('social_auth_partial_id_seq', 1, false);


--
-- TOC entry 3459 (class 0 OID 19887)
-- Dependencies: 319
-- Data for Name: social_auth_usersocialauth; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY social_auth_usersocialauth (id, provider, uid, extra_data, user_id) FROM stdin;
\.


--
-- TOC entry 3597 (class 0 OID 0)
-- Dependencies: 318
-- Name: social_auth_usersocialauth_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('social_auth_usersocialauth_id_seq', 1, false);


--
-- TOC entry 3388 (class 0 OID 18523)
-- Dependencies: 248
-- Data for Name: task_fulfillment; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY task_fulfillment (id, tracking_number, shipping_date, order_id, fulfillment_order, status) FROM stdin;
1		2019-03-11 15:00:34.60228+02	1	1	fulfilled
2		2019-03-11 15:30:30.780087+02	2	1	fulfilled
\.


--
-- TOC entry 3390 (class 0 OID 18532)
-- Dependencies: 250
-- Data for Name: task_fulfillmentline; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY task_fulfillmentline (id, order_line_id, quantity, fulfillment_id) FROM stdin;
1	1	1	1
3	3	2	2
\.


--
-- TOC entry 3384 (class 0 OID 18129)
-- Dependencies: 244
-- Data for Name: task_task; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY task_task (id, created, tracking_client_id, user_email, token, billing_address_id, delivery_address_id, user_id, total_net, discount_amount, discount_name, voucher_id, language_code, delivery_price_gross, total_gross, delivery_price_net, status, delivery_method_name, delivery_method_id, display_gross_prices, translated_discount_name, customer_note, weight, checkout_token) FROM stdin;
1	2019-03-11 14:56:02.196447+02	213be289-05be-58de-9fa3-5262acb82625	d_aana@yahoo.com	b106ed88-d245-46cc-be91-7f8956dbb5d2	1	\N	2	12.00	0.00		\N	en	0.00	12.00	0.00	fulfilled	\N	\N	t		test	0	691bb66f-1d04-40b7-8195-7c9ec694b350
2	2019-03-11 15:30:30.63577+02			5cccdd82-f9ac-4e51-a9e2-da75857f504a	13	13	13	424.28	0.00		\N	en	80.28	424.28	80.28	partially fulfilled	DHL	\N	t			9000	
3	2019-03-11 15:30:30.809282+02			a8eeec3c-e1db-43a6-9500-2139eefb7819	\N	\N	1	143.56	0.00		\N	en	13.56	143.56	13.56	unfulfilled	FedEx	\N	t			1500	
\.


--
-- TOC entry 3420 (class 0 OID 19179)
-- Dependencies: 280
-- Data for Name: task_taskevent; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY task_taskevent (id, date, type, task_id, user_id, parameters) FROM stdin;
1	2019-03-11 14:56:02.429762+02	placed	1	\N	{}
2	2019-03-11 14:56:03.761852+02	email_sent	1	\N	{"email": "d_aana@yahoo.com", "email_type": "order_confirmation"}
3	2019-03-11 14:56:29.430645+02	order_paid	1	\N	{}
4	2019-03-11 14:56:29.550372+02	email_sent	1	\N	{"email": "d_aana@yahoo.com", "email_type": "payment_confirmation"}
5	2019-03-11 15:00:34.911415+02	fulfilled_items	1	2	{"quantity": 1}
6	2019-03-11 15:00:35.168752+02	email_sent	1	2	{"email": "d_aana@yahoo.com", "email_type": "shipping_confirmation"}
\.


--
-- TOC entry 3386 (class 0 OID 18142)
-- Dependencies: 246
-- Data for Name: task_taskline; Type: TABLE DATA; Schema: public; Owner: remote_works
--

COPY task_taskline (id, skill_name, skill_sku, quantity, unit_price_net, unit_price_gross, is_delivery_required, task_id, quantity_fulfilled, variant_id, tax_rate, translated_skill_name) FROM stdin;
1	Stats calculation (2323)	2323	1	12.00	12.00	f	1	1	1	0.00	
3	Stats calculation (2323)	2323	3	12.00	12.00	f	2	2	1	0.00	
\.


--
-- TOC entry 3598 (class 0 OID 0)
-- Dependencies: 200
-- Name: userprofile_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('userprofile_address_id_seq', 22, true);


--
-- TOC entry 3599 (class 0 OID 0)
-- Dependencies: 202
-- Name: userprofile_user_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('userprofile_user_addresses_id_seq', 21, true);


--
-- TOC entry 3600 (class 0 OID 0)
-- Dependencies: 204
-- Name: userprofile_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('userprofile_user_groups_id_seq', 1, false);


--
-- TOC entry 3601 (class 0 OID 0)
-- Dependencies: 198
-- Name: userprofile_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('userprofile_user_id_seq', 23, true);


--
-- TOC entry 3602 (class 0 OID 0)
-- Dependencies: 206
-- Name: userprofile_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: remote_works
--

SELECT pg_catalog.setval('userprofile_user_user_permissions_id_seq', 6, true);


--
-- TOC entry 2831 (class 2606 OID 16623)
-- Name: account_customernote account_customernote_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_customernote
    ADD CONSTRAINT account_customernote_pkey PRIMARY KEY (id);


--
-- TOC entry 3125 (class 2606 OID 28231)
-- Name: account_schedule account_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_schedule
    ADD CONSTRAINT account_schedule_pkey PRIMARY KEY (id);


--
-- TOC entry 2800 (class 2606 OID 16663)
-- Name: account_user account_user_token_40f69349_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user
    ADD CONSTRAINT account_user_token_40f69349_uniq UNIQUE (token);


--
-- TOC entry 2790 (class 2606 OID 16433)
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- TOC entry 2795 (class 2606 OID 16462)
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- TOC entry 2798 (class 2606 OID 16441)
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 2792 (class 2606 OID 16431)
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- TOC entry 2785 (class 2606 OID 16448)
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- TOC entry 2787 (class 2606 OID 16423)
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- TOC entry 2899 (class 2606 OID 17082)
-- Name: checkout_cart cart_cart_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY checkout_cart
    ADD CONSTRAINT cart_cart_pkey PRIMARY KEY (token);


--
-- TOC entry 2905 (class 2606 OID 17094)
-- Name: checkout_cartline cart_cartline_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY checkout_cartline
    ADD CONSTRAINT cart_cartline_pkey PRIMARY KEY (id);


--
-- TOC entry 2908 (class 2606 OID 17231)
-- Name: checkout_cartline checkout_cartline_cart_id_variant_id_data_new_de3d8fca_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY checkout_cartline
    ADD CONSTRAINT checkout_cartline_cart_id_variant_id_data_new_de3d8fca_uniq UNIQUE (cart_id, variant_id, data);


--
-- TOC entry 2882 (class 2606 OID 17012)
-- Name: discount_sale_categories discount_sale_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_sale_categories
    ADD CONSTRAINT discount_sale_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 2885 (class 2606 OID 17032)
-- Name: discount_sale_categories discount_sale_categories_sale_id_category_id_be438401_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_sale_categories
    ADD CONSTRAINT discount_sale_categories_sale_id_category_id_be438401_uniq UNIQUE (sale_id, category_id);


--
-- TOC entry 2947 (class 2606 OID 18768)
-- Name: discount_sale_collections discount_sale_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_sale_collections
    ADD CONSTRAINT discount_sale_collections_pkey PRIMARY KEY (id);


--
-- TOC entry 2950 (class 2606 OID 18780)
-- Name: discount_sale_collections discount_sale_collections_sale_id_collection_id_01b57fc3_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_sale_collections
    ADD CONSTRAINT discount_sale_collections_sale_id_collection_id_01b57fc3_uniq UNIQUE (sale_id, collection_id);


--
-- TOC entry 2879 (class 2606 OID 17004)
-- Name: discount_sale discount_sale_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_sale
    ADD CONSTRAINT discount_sale_pkey PRIMARY KEY (id);


--
-- TOC entry 2889 (class 2606 OID 17046)
-- Name: discount_sale_skills discount_sale_products_sale_id_product_id_1c2df1f8_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_sale_skills
    ADD CONSTRAINT discount_sale_products_sale_id_product_id_1c2df1f8_uniq UNIQUE (sale_id, skill_id);


--
-- TOC entry 2891 (class 2606 OID 17020)
-- Name: discount_sale_skills discount_sale_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_sale_skills
    ADD CONSTRAINT discount_sale_skills_pkey PRIMARY KEY (id);


--
-- TOC entry 2952 (class 2606 OID 18843)
-- Name: discount_voucher_categories discount_voucher_categor_voucher_id_category_id_bb5f8954_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_voucher_categories
    ADD CONSTRAINT discount_voucher_categor_voucher_id_category_id_bb5f8954_uniq UNIQUE (voucher_id, category_id);


--
-- TOC entry 2955 (class 2606 OID 18802)
-- Name: discount_voucher_categories discount_voucher_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_voucher_categories
    ADD CONSTRAINT discount_voucher_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 2894 (class 2606 OID 17060)
-- Name: discount_voucher discount_voucher_code_key; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_voucher
    ADD CONSTRAINT discount_voucher_code_key UNIQUE (code);


--
-- TOC entry 2958 (class 2606 OID 18857)
-- Name: discount_voucher_collections discount_voucher_collect_voucher_id_collection_id_736b8f24_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_voucher_collections
    ADD CONSTRAINT discount_voucher_collect_voucher_id_collection_id_736b8f24_uniq UNIQUE (voucher_id, collection_id);


--
-- TOC entry 2961 (class 2606 OID 18810)
-- Name: discount_voucher_collections discount_voucher_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_voucher_collections
    ADD CONSTRAINT discount_voucher_collections_pkey PRIMARY KEY (id);


--
-- TOC entry 2896 (class 2606 OID 17058)
-- Name: discount_voucher discount_voucher_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_voucher
    ADD CONSTRAINT discount_voucher_pkey PRIMARY KEY (id);


--
-- TOC entry 2966 (class 2606 OID 18871)
-- Name: discount_voucher_skills discount_voucher_products_voucher_id_product_id_2b092ec4_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_voucher_skills
    ADD CONSTRAINT discount_voucher_products_voucher_id_product_id_2b092ec4_uniq UNIQUE (voucher_id, skill_id);


--
-- TOC entry 2968 (class 2606 OID 18831)
-- Name: discount_voucher_skills discount_voucher_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_voucher_skills
    ADD CONSTRAINT discount_voucher_skills_pkey PRIMARY KEY (id);


--
-- TOC entry 2970 (class 2606 OID 18883)
-- Name: discount_vouchertranslation discount_vouchertranslat_language_code_voucher_id_af4428b5_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_vouchertranslation
    ADD CONSTRAINT discount_vouchertranslat_language_code_voucher_id_af4428b5_uniq UNIQUE (language_code, voucher_id);


--
-- TOC entry 2972 (class 2606 OID 18881)
-- Name: discount_vouchertranslation discount_vouchertranslation_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_vouchertranslation
    ADD CONSTRAINT discount_vouchertranslation_pkey PRIMARY KEY (id);


--
-- TOC entry 2976 (class 2606 OID 18900)
-- Name: django_celery_results_taskresult django_celery_results_taskresult_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY django_celery_results_taskresult
    ADD CONSTRAINT django_celery_results_taskresult_pkey PRIMARY KEY (id);


--
-- TOC entry 2979 (class 2606 OID 18902)
-- Name: django_celery_results_taskresult django_celery_results_taskresult_task_id_key; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY django_celery_results_taskresult
    ADD CONSTRAINT django_celery_results_taskresult_task_id_key UNIQUE (task_id);


--
-- TOC entry 2780 (class 2606 OID 28163)
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- TOC entry 2782 (class 2606 OID 16413)
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- TOC entry 2778 (class 2606 OID 16405)
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 2982 (class 2606 OID 18912)
-- Name: django_prices_openexchangerates_conversionrate django_prices_openexchangerates_conversionrate_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY django_prices_openexchangerates_conversionrate
    ADD CONSTRAINT django_prices_openexchangerates_conversionrate_pkey PRIMARY KEY (id);


--
-- TOC entry 2984 (class 2606 OID 18914)
-- Name: django_prices_openexchangerates_conversionrate django_prices_openexchangerates_conversionrate_to_currency_key; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY django_prices_openexchangerates_conversionrate
    ADD CONSTRAINT django_prices_openexchangerates_conversionrate_to_currency_key UNIQUE (to_currency);


--
-- TOC entry 2990 (class 2606 OID 18949)
-- Name: django_prices_vatlayer_ratetypes django_prices_vatlayer_ratetypes_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY django_prices_vatlayer_ratetypes
    ADD CONSTRAINT django_prices_vatlayer_ratetypes_pkey PRIMARY KEY (id);


--
-- TOC entry 2988 (class 2606 OID 18938)
-- Name: django_prices_vatlayer_vat django_prices_vatlayer_vat_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY django_prices_vatlayer_vat
    ADD CONSTRAINT django_prices_vatlayer_vat_pkey PRIMARY KEY (id);


--
-- TOC entry 3089 (class 2606 OID 19787)
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- TOC entry 3037 (class 2606 OID 19337)
-- Name: django_site django_site_domain_a2e37b91_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY django_site
    ADD CONSTRAINT django_site_domain_a2e37b91_uniq UNIQUE (domain);


--
-- TOC entry 3039 (class 2606 OID 19335)
-- Name: django_site django_site_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY django_site
    ADD CONSTRAINT django_site_pkey PRIMARY KEY (id);


--
-- TOC entry 2994 (class 2606 OID 18959)
-- Name: impersonate_impersonationlog impersonate_impersonationlog_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY impersonate_impersonationlog
    ADD CONSTRAINT impersonate_impersonationlog_pkey PRIMARY KEY (id);


--
-- TOC entry 3001 (class 2606 OID 18993)
-- Name: menu_menu menu_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY menu_menu
    ADD CONSTRAINT menu_menu_pkey PRIMARY KEY (id);


--
-- TOC entry 3010 (class 2606 OID 19008)
-- Name: menu_menuitem menu_menuitem_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY menu_menuitem
    ADD CONSTRAINT menu_menuitem_pkey PRIMARY KEY (id);


--
-- TOC entry 3015 (class 2606 OID 19072)
-- Name: menu_menuitemtranslation menu_menuitemtranslation_language_code_menu_item__508dcdd8_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY menu_menuitemtranslation
    ADD CONSTRAINT menu_menuitemtranslation_language_code_menu_item__508dcdd8_uniq UNIQUE (language_code, menu_item_id);


--
-- TOC entry 3018 (class 2606 OID 19059)
-- Name: menu_menuitemtranslation menu_menuitemtranslation_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY menu_menuitemtranslation
    ADD CONSTRAINT menu_menuitemtranslation_pkey PRIMARY KEY (id);


--
-- TOC entry 2940 (class 2606 OID 18529)
-- Name: task_fulfillment order_fulfillment_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_fulfillment
    ADD CONSTRAINT order_fulfillment_pkey PRIMARY KEY (id);


--
-- TOC entry 2944 (class 2606 OID 18537)
-- Name: task_fulfillmentline order_fulfillmentline_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_fulfillmentline
    ADD CONSTRAINT order_fulfillmentline_pkey PRIMARY KEY (id);


--
-- TOC entry 2926 (class 2606 OID 18137)
-- Name: task_task order_order_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_task
    ADD CONSTRAINT order_order_pkey PRIMARY KEY (id);


--
-- TOC entry 2931 (class 2606 OID 18139)
-- Name: task_task order_order_token_key; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_task
    ADD CONSTRAINT order_order_token_key UNIQUE (token);


--
-- TOC entry 2935 (class 2606 OID 18147)
-- Name: task_taskline order_ordereditem_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_taskline
    ADD CONSTRAINT order_ordereditem_pkey PRIMARY KEY (id);


--
-- TOC entry 3021 (class 2606 OID 19187)
-- Name: task_taskevent order_orderevent_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_taskevent
    ADD CONSTRAINT order_orderevent_pkey PRIMARY KEY (id);


--
-- TOC entry 2996 (class 2606 OID 18982)
-- Name: page_page page_page_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY page_page
    ADD CONSTRAINT page_page_pkey PRIMARY KEY (id);


--
-- TOC entry 2999 (class 2606 OID 18984)
-- Name: page_page page_page_slug_key; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY page_page
    ADD CONSTRAINT page_page_slug_key UNIQUE (slug);


--
-- TOC entry 3031 (class 2606 OID 19286)
-- Name: page_pagetranslation page_pagetranslation_language_code_page_id_35685962_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY page_pagetranslation
    ADD CONSTRAINT page_pagetranslation_language_code_page_id_35685962_uniq UNIQUE (language_code, page_id);


--
-- TOC entry 3034 (class 2606 OID 19284)
-- Name: page_pagetranslation page_pagetranslation_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY page_pagetranslation
    ADD CONSTRAINT page_pagetranslation_pkey PRIMARY KEY (id);


--
-- TOC entry 3026 (class 2606 OID 19227)
-- Name: payment_payment payment_paymentmethod_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY payment_payment
    ADD CONSTRAINT payment_paymentmethod_pkey PRIMARY KEY (id);


--
-- TOC entry 3029 (class 2606 OID 19238)
-- Name: payment_transaction payment_transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY payment_transaction
    ADD CONSTRAINT payment_transaction_pkey PRIMARY KEY (id);


--
-- TOC entry 3058 (class 2606 OID 19537)
-- Name: skill_attributevaluetranslation product_attributechoicev_language_code_attribute__9b58af18_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_attributevaluetranslation
    ADD CONSTRAINT product_attributechoicev_language_code_attribute__9b58af18_uniq UNIQUE (language_code, attribute_value_id);


--
-- TOC entry 2838 (class 2606 OID 17533)
-- Name: skill_attributevalue product_attributechoicevalue_display_attribute_id_6d8b2d87_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_attributevalue
    ADD CONSTRAINT product_attributechoicevalue_display_attribute_id_6d8b2d87_uniq UNIQUE (name, attribute_id);


--
-- TOC entry 3063 (class 2606 OID 19535)
-- Name: skill_categorytranslation product_categorytranslat_language_code_category_i_f71fd11d_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_categorytranslation
    ADD CONSTRAINT product_categorytranslat_language_code_category_i_f71fd11d_uniq UNIQUE (language_code, category_id);


--
-- TOC entry 2913 (class 2606 OID 18074)
-- Name: skill_collection product_collection_name_key; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_collection
    ADD CONSTRAINT product_collection_name_key UNIQUE (name);


--
-- TOC entry 2919 (class 2606 OID 18097)
-- Name: skill_collection_skills product_collection_produ_collection_id_product_id_abec4cf3_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_collection_skills
    ADD CONSTRAINT product_collection_produ_collection_id_product_id_abec4cf3_uniq UNIQUE (collection_id, skill_id);


--
-- TOC entry 3068 (class 2606 OID 19533)
-- Name: skill_collectiontranslation product_collectiontransl_language_code_collection_b1200cd5_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_collectiontranslation
    ADD CONSTRAINT product_collectiontransl_language_code_collection_b1200cd5_uniq UNIQUE (language_code, collection_id);


--
-- TOC entry 3073 (class 2606 OID 19531)
-- Name: skill_attributetranslation product_productattribute_language_code_product_at_58451db2_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_attributetranslation
    ADD CONSTRAINT product_productattribute_language_code_product_at_58451db2_uniq UNIQUE (language_code, attribute_id);


--
-- TOC entry 3078 (class 2606 OID 19529)
-- Name: skill_skilltranslation product_producttranslati_language_code_product_id_b06ba774_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skilltranslation
    ADD CONSTRAINT product_producttranslati_language_code_product_id_b06ba774_uniq UNIQUE (language_code, skill_id);


--
-- TOC entry 2871 (class 2606 OID 16800)
-- Name: skill_skillvariant product_productvariant_sku_key; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skillvariant
    ADD CONSTRAINT product_productvariant_sku_key UNIQUE (sku);


--
-- TOC entry 3083 (class 2606 OID 19527)
-- Name: skill_skillvarianttranslation product_productvarianttr_language_code_product_va_cf16d8d0_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skillvarianttranslation
    ADD CONSTRAINT product_productvarianttr_language_code_product_va_cf16d8d0_uniq UNIQUE (language_code, skill_variant_id);


--
-- TOC entry 2834 (class 2606 OID 16700)
-- Name: delivery_deliverymethod shipping_shippingmethod_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY delivery_deliverymethod
    ADD CONSTRAINT shipping_shippingmethod_pkey PRIMARY KEY (id);


--
-- TOC entry 3092 (class 2606 OID 19825)
-- Name: delivery_deliverymethodtranslation shipping_shippingmethodt_language_code_shipping_m_70e4f786_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY delivery_deliverymethodtranslation
    ADD CONSTRAINT shipping_shippingmethodt_language_code_shipping_m_70e4f786_uniq UNIQUE (language_code, delivery_method_id);


--
-- TOC entry 3094 (class 2606 OID 19797)
-- Name: delivery_deliverymethodtranslation shipping_shippingmethodtranslation_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY delivery_deliverymethodtranslation
    ADD CONSTRAINT shipping_shippingmethodtranslation_pkey PRIMARY KEY (id);


--
-- TOC entry 3097 (class 2606 OID 19808)
-- Name: delivery_deliveryzone shipping_shippingzone_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY delivery_deliveryzone
    ADD CONSTRAINT shipping_shippingzone_pkey PRIMARY KEY (id);


--
-- TOC entry 3048 (class 2606 OID 19373)
-- Name: site_authorizationkey site_authorizationkey_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY site_authorizationkey
    ADD CONSTRAINT site_authorizationkey_pkey PRIMARY KEY (id);


--
-- TOC entry 3051 (class 2606 OID 19375)
-- Name: site_authorizationkey site_authorizationkey_site_settings_id_name_c5f8d1e6_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY site_authorizationkey
    ADD CONSTRAINT site_authorizationkey_site_settings_id_name_c5f8d1e6_uniq UNIQUE (site_settings_id, name);


--
-- TOC entry 3043 (class 2606 OID 19346)
-- Name: site_sitesettings site_sitesettings_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY site_sitesettings
    ADD CONSTRAINT site_sitesettings_pkey PRIMARY KEY (id);


--
-- TOC entry 3045 (class 2606 OID 19383)
-- Name: site_sitesettings site_sitesettings_site_id_key; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY site_sitesettings
    ADD CONSTRAINT site_sitesettings_site_id_key UNIQUE (site_id);


--
-- TOC entry 3053 (class 2606 OID 19462)
-- Name: site_sitesettingstranslation site_sitesettingstransla_language_code_site_setti_e767d9e7_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY site_sitesettingstranslation
    ADD CONSTRAINT site_sitesettingstransla_language_code_site_setti_e767d9e7_uniq UNIQUE (language_code, site_settings_id);


--
-- TOC entry 3055 (class 2606 OID 19460)
-- Name: site_sitesettingstranslation site_sitesettingstranslation_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY site_sitesettingstranslation
    ADD CONSTRAINT site_sitesettingstranslation_pkey PRIMARY KEY (id);


--
-- TOC entry 2843 (class 2606 OID 16734)
-- Name: skill_attributevalue skill_attributechoicevalue_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_attributevalue
    ADD CONSTRAINT skill_attributechoicevalue_pkey PRIMARY KEY (id);


--
-- TOC entry 3061 (class 2606 OID 19476)
-- Name: skill_attributevaluetranslation skill_attributechoicevaluetranslation_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_attributevaluetranslation
    ADD CONSTRAINT skill_attributechoicevaluetranslation_pkey PRIMARY KEY (id);


--
-- TOC entry 2852 (class 2606 OID 16749)
-- Name: skill_category skill_category_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_category
    ADD CONSTRAINT skill_category_pkey PRIMARY KEY (id);


--
-- TOC entry 3066 (class 2606 OID 19487)
-- Name: skill_categorytranslation skill_categorytranslation_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_categorytranslation
    ADD CONSTRAINT skill_categorytranslation_pkey PRIMARY KEY (id);


--
-- TOC entry 2917 (class 2606 OID 18072)
-- Name: skill_collection skill_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_collection
    ADD CONSTRAINT skill_collection_pkey PRIMARY KEY (id);


--
-- TOC entry 2923 (class 2606 OID 18082)
-- Name: skill_collection_skills skill_collection_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_collection_skills
    ADD CONSTRAINT skill_collection_skills_pkey PRIMARY KEY (id);


--
-- TOC entry 3071 (class 2606 OID 19498)
-- Name: skill_collectiontranslation skill_collectiontranslation_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_collectiontranslation
    ADD CONSTRAINT skill_collectiontranslation_pkey PRIMARY KEY (id);


--
-- TOC entry 2857 (class 2606 OID 16768)
-- Name: skill_skill skill_skill_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skill
    ADD CONSTRAINT skill_skill_pkey PRIMARY KEY (id);


--
-- TOC entry 2863 (class 2606 OID 16776)
-- Name: skill_attribute skill_skillattribute_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_attribute
    ADD CONSTRAINT skill_skillattribute_pkey PRIMARY KEY (id);


--
-- TOC entry 3076 (class 2606 OID 19506)
-- Name: skill_attributetranslation skill_skillattributetranslation_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_attributetranslation
    ADD CONSTRAINT skill_skillattributetranslation_pkey PRIMARY KEY (id);


--
-- TOC entry 2910 (class 2606 OID 17260)
-- Name: skill_skilltype skill_skillclass_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skilltype
    ADD CONSTRAINT skill_skillclass_pkey PRIMARY KEY (id);


--
-- TOC entry 2866 (class 2606 OID 16787)
-- Name: skill_skillimage skill_skillimage_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skillimage
    ADD CONSTRAINT skill_skillimage_pkey PRIMARY KEY (id);


--
-- TOC entry 3081 (class 2606 OID 19517)
-- Name: skill_skilltranslation skill_skilltranslation_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skilltranslation
    ADD CONSTRAINT skill_skilltranslation_pkey PRIMARY KEY (id);


--
-- TOC entry 2873 (class 2606 OID 16798)
-- Name: skill_skillvariant skill_skillvariant_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skillvariant
    ADD CONSTRAINT skill_skillvariant_pkey PRIMARY KEY (id);


--
-- TOC entry 3086 (class 2606 OID 19525)
-- Name: skill_skillvarianttranslation skill_skillvarianttranslation_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skillvarianttranslation
    ADD CONSTRAINT skill_skillvarianttranslation_pkey PRIMARY KEY (id);


--
-- TOC entry 2877 (class 2606 OID 16984)
-- Name: skill_variantimage skill_variantimage_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_variantimage
    ADD CONSTRAINT skill_variantimage_pkey PRIMARY KEY (id);


--
-- TOC entry 3099 (class 2606 OID 19868)
-- Name: social_auth_association social_auth_association_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY social_auth_association
    ADD CONSTRAINT social_auth_association_pkey PRIMARY KEY (id);


--
-- TOC entry 3101 (class 2606 OID 19918)
-- Name: social_auth_association social_auth_association_server_url_handle_078befa2_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY social_auth_association
    ADD CONSTRAINT social_auth_association_server_url_handle_078befa2_uniq UNIQUE (server_url, handle);


--
-- TOC entry 3105 (class 2606 OID 28192)
-- Name: social_auth_code social_auth_code_email_code_801b2d02_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY social_auth_code
    ADD CONSTRAINT social_auth_code_email_code_801b2d02_uniq UNIQUE (email, code);


--
-- TOC entry 3107 (class 2606 OID 19876)
-- Name: social_auth_code social_auth_code_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY social_auth_code
    ADD CONSTRAINT social_auth_code_pkey PRIMARY KEY (id);


--
-- TOC entry 3110 (class 2606 OID 19884)
-- Name: social_auth_nonce social_auth_nonce_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY social_auth_nonce
    ADD CONSTRAINT social_auth_nonce_pkey PRIMARY KEY (id);


--
-- TOC entry 3112 (class 2606 OID 19901)
-- Name: social_auth_nonce social_auth_nonce_server_url_timestamp_salt_f6284463_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY social_auth_nonce
    ADD CONSTRAINT social_auth_nonce_server_url_timestamp_salt_f6284463_uniq UNIQUE (server_url, "timestamp", salt);


--
-- TOC entry 3119 (class 2606 OID 19930)
-- Name: social_auth_partial social_auth_partial_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY social_auth_partial
    ADD CONSTRAINT social_auth_partial_pkey PRIMARY KEY (id);


--
-- TOC entry 3114 (class 2606 OID 19895)
-- Name: social_auth_usersocialauth social_auth_usersocialauth_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY social_auth_usersocialauth
    ADD CONSTRAINT social_auth_usersocialauth_pkey PRIMARY KEY (id);


--
-- TOC entry 3116 (class 2606 OID 19897)
-- Name: social_auth_usersocialauth social_auth_usersocialauth_provider_uid_e6b5e668_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY social_auth_usersocialauth
    ADD CONSTRAINT social_auth_usersocialauth_provider_uid_e6b5e668_uniq UNIQUE (provider, uid);


--
-- TOC entry 2809 (class 2606 OID 16485)
-- Name: account_address userprofile_address_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_address
    ADD CONSTRAINT userprofile_address_pkey PRIMARY KEY (id);


--
-- TOC entry 2812 (class 2606 OID 16493)
-- Name: account_user_addresses userprofile_user_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user_addresses
    ADD CONSTRAINT userprofile_user_addresses_pkey PRIMARY KEY (id);


--
-- TOC entry 2814 (class 2606 OID 16522)
-- Name: account_user_addresses userprofile_user_addresses_user_id_address_id_6cb87bcc_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user_addresses
    ADD CONSTRAINT userprofile_user_addresses_user_id_address_id_6cb87bcc_uniq UNIQUE (user_id, address_id);


--
-- TOC entry 2805 (class 2606 OID 16474)
-- Name: account_user userprofile_user_email_key; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user
    ADD CONSTRAINT userprofile_user_email_key UNIQUE (email);


--
-- TOC entry 2818 (class 2606 OID 16501)
-- Name: account_user_groups userprofile_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user_groups
    ADD CONSTRAINT userprofile_user_groups_pkey PRIMARY KEY (id);


--
-- TOC entry 2821 (class 2606 OID 16548)
-- Name: account_user_groups userprofile_user_groups_user_id_group_id_90ce1781_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user_groups
    ADD CONSTRAINT userprofile_user_groups_user_id_group_id_90ce1781_uniq UNIQUE (user_id, group_id);


--
-- TOC entry 2807 (class 2606 OID 16472)
-- Name: account_user userprofile_user_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user
    ADD CONSTRAINT userprofile_user_pkey PRIMARY KEY (id);


--
-- TOC entry 2823 (class 2606 OID 16562)
-- Name: account_user_user_permissions userprofile_user_user_pe_user_id_permission_id_706d65c8_uniq; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user_user_permissions
    ADD CONSTRAINT userprofile_user_user_pe_user_id_permission_id_706d65c8_uniq UNIQUE (user_id, permission_id);


--
-- TOC entry 2826 (class 2606 OID 16509)
-- Name: account_user_user_permissions userprofile_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user_user_permissions
    ADD CONSTRAINT userprofile_user_user_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 2828 (class 1259 OID 16628)
-- Name: account_customernote_customer_id_ec50cbf6; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX account_customernote_customer_id_ec50cbf6 ON account_customernote USING btree (customer_id);


--
-- TOC entry 2829 (class 1259 OID 16627)
-- Name: account_customernote_date_231c3474; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX account_customernote_date_231c3474 ON account_customernote USING btree (date);


--
-- TOC entry 2832 (class 1259 OID 16634)
-- Name: account_customernote_user_id_b10a6c14; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX account_customernote_user_id_b10a6c14 ON account_customernote USING btree (user_id);


--
-- TOC entry 3123 (class 1259 OID 28239)
-- Name: account_schedule_owner_id_9acfd6a7; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX account_schedule_owner_id_9acfd6a7 ON account_schedule USING btree (owner_id);


--
-- TOC entry 2788 (class 1259 OID 16450)
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX auth_group_name_a6ea08ec_like ON auth_group USING btree (name varchar_pattern_ops);


--
-- TOC entry 2793 (class 1259 OID 16463)
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON auth_group_permissions USING btree (group_id);


--
-- TOC entry 2796 (class 1259 OID 16464)
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON auth_group_permissions USING btree (permission_id);


--
-- TOC entry 2783 (class 1259 OID 16449)
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON auth_permission USING btree (content_type_id);


--
-- TOC entry 2897 (class 1259 OID 17196)
-- Name: cart_cart_billing_address_id_9eb62ddd; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX cart_cart_billing_address_id_9eb62ddd ON checkout_cart USING btree (billing_address_id);


--
-- TOC entry 2900 (class 1259 OID 17202)
-- Name: cart_cart_shipping_address_id_adfddaf9; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX cart_cart_shipping_address_id_adfddaf9 ON checkout_cart USING btree (delivery_address_id);


--
-- TOC entry 2901 (class 1259 OID 17208)
-- Name: cart_cart_shipping_method_id_835c02e0; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX cart_cart_shipping_method_id_835c02e0 ON checkout_cart USING btree (delivery_method_id);


--
-- TOC entry 2902 (class 1259 OID 17107)
-- Name: cart_cart_user_id_9b4220b9; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX cart_cart_user_id_9b4220b9 ON checkout_cart USING btree (user_id);


--
-- TOC entry 2903 (class 1259 OID 17119)
-- Name: cart_cartline_cart_id_c7b9981e; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX cart_cartline_cart_id_c7b9981e ON checkout_cartline USING btree (cart_id);


--
-- TOC entry 2906 (class 1259 OID 17120)
-- Name: cart_cartline_product_id_1a54130f; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX cart_cartline_product_id_1a54130f ON checkout_cartline USING btree (variant_id);


--
-- TOC entry 2880 (class 1259 OID 17034)
-- Name: discount_sale_categories_category_id_64e132af; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX discount_sale_categories_category_id_64e132af ON discount_sale_categories USING btree (category_id);


--
-- TOC entry 2883 (class 1259 OID 17033)
-- Name: discount_sale_categories_sale_id_2aeee4a7; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX discount_sale_categories_sale_id_2aeee4a7 ON discount_sale_categories USING btree (sale_id);


--
-- TOC entry 2945 (class 1259 OID 18782)
-- Name: discount_sale_collections_collection_id_f66df9d7; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX discount_sale_collections_collection_id_f66df9d7 ON discount_sale_collections USING btree (collection_id);


--
-- TOC entry 2948 (class 1259 OID 18781)
-- Name: discount_sale_collections_sale_id_a912da4a; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX discount_sale_collections_sale_id_a912da4a ON discount_sale_collections USING btree (sale_id);


--
-- TOC entry 2886 (class 1259 OID 17048)
-- Name: discount_sale_products_product_id_d42c9636; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX discount_sale_products_product_id_d42c9636 ON discount_sale_skills USING btree (skill_id);


--
-- TOC entry 2887 (class 1259 OID 17047)
-- Name: discount_sale_products_sale_id_10e3a20f; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX discount_sale_products_sale_id_10e3a20f ON discount_sale_skills USING btree (sale_id);


--
-- TOC entry 2953 (class 1259 OID 18845)
-- Name: discount_voucher_categories_category_id_fc9d044a; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX discount_voucher_categories_category_id_fc9d044a ON discount_voucher_categories USING btree (category_id);


--
-- TOC entry 2956 (class 1259 OID 18844)
-- Name: discount_voucher_categories_voucher_id_19a56338; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX discount_voucher_categories_voucher_id_19a56338 ON discount_voucher_categories USING btree (voucher_id);


--
-- TOC entry 2892 (class 1259 OID 17071)
-- Name: discount_voucher_code_ff8dc52c_like; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX discount_voucher_code_ff8dc52c_like ON discount_voucher USING btree (code varchar_pattern_ops);


--
-- TOC entry 2959 (class 1259 OID 18859)
-- Name: discount_voucher_collections_collection_id_b9de6b54; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX discount_voucher_collections_collection_id_b9de6b54 ON discount_voucher_collections USING btree (collection_id);


--
-- TOC entry 2962 (class 1259 OID 18858)
-- Name: discount_voucher_collections_voucher_id_4ce1fde3; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX discount_voucher_collections_voucher_id_4ce1fde3 ON discount_voucher_collections USING btree (voucher_id);


--
-- TOC entry 2963 (class 1259 OID 18873)
-- Name: discount_voucher_products_product_id_4a3131ff; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX discount_voucher_products_product_id_4a3131ff ON discount_voucher_skills USING btree (skill_id);


--
-- TOC entry 2964 (class 1259 OID 18872)
-- Name: discount_voucher_products_voucher_id_8a2e6c3a; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX discount_voucher_products_voucher_id_8a2e6c3a ON discount_voucher_skills USING btree (voucher_id);


--
-- TOC entry 2973 (class 1259 OID 18889)
-- Name: discount_vouchertranslation_voucher_id_288246a9; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX discount_vouchertranslation_voucher_id_288246a9 ON discount_vouchertranslation USING btree (voucher_id);


--
-- TOC entry 2974 (class 1259 OID 18904)
-- Name: django_celery_results_taskresult_hidden_cd77412f; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX django_celery_results_taskresult_hidden_cd77412f ON django_celery_results_taskresult USING btree (hidden);


--
-- TOC entry 2977 (class 1259 OID 18903)
-- Name: django_celery_results_taskresult_task_id_de0d95bf_like; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX django_celery_results_taskresult_task_id_de0d95bf_like ON django_celery_results_taskresult USING btree (task_id varchar_pattern_ops);


--
-- TOC entry 2980 (class 1259 OID 18915)
-- Name: django_prices_openexchan_to_currency_92c4a4e1_like; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX django_prices_openexchan_to_currency_92c4a4e1_like ON django_prices_openexchangerates_conversionrate USING btree (to_currency varchar_pattern_ops);


--
-- TOC entry 2985 (class 1259 OID 18950)
-- Name: django_prices_vatlayer_vat_country_code_858b2cc4; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX django_prices_vatlayer_vat_country_code_858b2cc4 ON django_prices_vatlayer_vat USING btree (country_code);


--
-- TOC entry 2986 (class 1259 OID 18951)
-- Name: django_prices_vatlayer_vat_country_code_858b2cc4_like; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX django_prices_vatlayer_vat_country_code_858b2cc4_like ON django_prices_vatlayer_vat USING btree (country_code varchar_pattern_ops);


--
-- TOC entry 3087 (class 1259 OID 19789)
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX django_session_expire_date_a5c62663 ON django_session USING btree (expire_date);


--
-- TOC entry 3090 (class 1259 OID 19788)
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX django_session_session_key_c0390e0f_like ON django_session USING btree (session_key varchar_pattern_ops);


--
-- TOC entry 3035 (class 1259 OID 19338)
-- Name: django_site_domain_a2e37b91_like; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX django_site_domain_a2e37b91_like ON django_site USING btree (domain varchar_pattern_ops);


--
-- TOC entry 2991 (class 1259 OID 18970)
-- Name: impersonate_impersonationlog_impersonating_id_afd114fc; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX impersonate_impersonationlog_impersonating_id_afd114fc ON impersonate_impersonationlog USING btree (impersonating_id);


--
-- TOC entry 2992 (class 1259 OID 18971)
-- Name: impersonate_impersonationlog_impersonator_id_1ecfe8ce; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX impersonate_impersonationlog_impersonator_id_1ecfe8ce ON impersonate_impersonationlog USING btree (impersonator_id);


--
-- TOC entry 3002 (class 1259 OID 19039)
-- Name: menu_menuitem_category_id_af353a3b; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX menu_menuitem_category_id_af353a3b ON menu_menuitem USING btree (category_id);


--
-- TOC entry 3003 (class 1259 OID 19040)
-- Name: menu_menuitem_collection_id_b913b19e; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX menu_menuitem_collection_id_b913b19e ON menu_menuitem USING btree (collection_id);


--
-- TOC entry 3004 (class 1259 OID 19038)
-- Name: menu_menuitem_level_235a7959; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX menu_menuitem_level_235a7959 ON menu_menuitem USING btree (level);


--
-- TOC entry 3005 (class 1259 OID 19035)
-- Name: menu_menuitem_lft_ee554b30; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX menu_menuitem_lft_ee554b30 ON menu_menuitem USING btree (lft);


--
-- TOC entry 3006 (class 1259 OID 19041)
-- Name: menu_menuitem_menu_id_f466b139; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX menu_menuitem_menu_id_f466b139 ON menu_menuitem USING btree (menu_id);


--
-- TOC entry 3007 (class 1259 OID 19042)
-- Name: menu_menuitem_page_id_a0c8f92d; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX menu_menuitem_page_id_a0c8f92d ON menu_menuitem USING btree (page_id);


--
-- TOC entry 3008 (class 1259 OID 19043)
-- Name: menu_menuitem_parent_id_439f55a5; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX menu_menuitem_parent_id_439f55a5 ON menu_menuitem USING btree (parent_id);


--
-- TOC entry 3011 (class 1259 OID 19036)
-- Name: menu_menuitem_rght_f86bd5c2; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX menu_menuitem_rght_f86bd5c2 ON menu_menuitem USING btree (rght);


--
-- TOC entry 3012 (class 1259 OID 19051)
-- Name: menu_menuitem_sort_order_f96ed184; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX menu_menuitem_sort_order_f96ed184 ON menu_menuitem USING btree (sort_order);


--
-- TOC entry 3013 (class 1259 OID 19037)
-- Name: menu_menuitem_tree_id_0d2e9c9a; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX menu_menuitem_tree_id_0d2e9c9a ON menu_menuitem USING btree (tree_id);


--
-- TOC entry 3016 (class 1259 OID 19078)
-- Name: menu_menuitemtranslation_menu_item_id_3445926c; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX menu_menuitemtranslation_menu_item_id_3445926c ON menu_menuitemtranslation USING btree (menu_item_id);


--
-- TOC entry 2938 (class 1259 OID 18570)
-- Name: order_fulfillment_order_id_02695111; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX order_fulfillment_order_id_02695111 ON task_fulfillment USING btree (order_id);


--
-- TOC entry 2941 (class 1259 OID 18582)
-- Name: order_fulfillmentline_fulfillment_id_68f3291d; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX order_fulfillmentline_fulfillment_id_68f3291d ON task_fulfillmentline USING btree (fulfillment_id);


--
-- TOC entry 2942 (class 1259 OID 18581)
-- Name: order_fulfillmentline_order_line_id_7d40e054; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX order_fulfillmentline_order_line_id_7d40e054 ON task_fulfillmentline USING btree (order_line_id);


--
-- TOC entry 2924 (class 1259 OID 18191)
-- Name: order_order_billing_address_id_8fe537cf; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX order_order_billing_address_id_8fe537cf ON task_task USING btree (billing_address_id);


--
-- TOC entry 2927 (class 1259 OID 18192)
-- Name: order_order_shipping_address_id_57e64931; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX order_order_shipping_address_id_57e64931 ON task_task USING btree (delivery_address_id);


--
-- TOC entry 2928 (class 1259 OID 18605)
-- Name: order_order_shipping_method_id_2a742834; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX order_order_shipping_method_id_2a742834 ON task_task USING btree (delivery_method_id);


--
-- TOC entry 2929 (class 1259 OID 18190)
-- Name: order_order_token_ddb7fb7b_like; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX order_order_token_ddb7fb7b_like ON task_task USING btree (token varchar_pattern_ops);


--
-- TOC entry 2932 (class 1259 OID 18193)
-- Name: order_order_user_id_7cf9bc2b; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX order_order_user_id_7cf9bc2b ON task_task USING btree (user_id);


--
-- TOC entry 2933 (class 1259 OID 18296)
-- Name: order_order_voucher_id_0748ca22; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX order_order_voucher_id_0748ca22 ON task_task USING btree (voucher_id);


--
-- TOC entry 3019 (class 1259 OID 19198)
-- Name: order_orderevent_order_id_09aa7ccd; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX order_orderevent_order_id_09aa7ccd ON task_taskevent USING btree (task_id);


--
-- TOC entry 3022 (class 1259 OID 19199)
-- Name: order_orderevent_user_id_1056ac9c; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX order_orderevent_user_id_1056ac9c ON task_taskevent USING btree (user_id);


--
-- TOC entry 2936 (class 1259 OID 18583)
-- Name: order_orderline_order_id_eb04ec2d; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX order_orderline_order_id_eb04ec2d ON task_taskline USING btree (task_id);


--
-- TOC entry 2937 (class 1259 OID 18621)
-- Name: order_orderline_variant_id_866774cb; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX order_orderline_variant_id_866774cb ON task_taskline USING btree (variant_id);


--
-- TOC entry 2997 (class 1259 OID 18985)
-- Name: page_page_slug_d6b7c8ed_like; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX page_page_slug_d6b7c8ed_like ON page_page USING btree (slug varchar_pattern_ops);


--
-- TOC entry 3032 (class 1259 OID 19292)
-- Name: page_pagetranslation_page_id_60216ef5; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX page_pagetranslation_page_id_60216ef5 ON page_pagetranslation USING btree (page_id);


--
-- TOC entry 3023 (class 1259 OID 19249)
-- Name: payment_paymentmethod_checkout_id_5c0aae3d; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX payment_paymentmethod_checkout_id_5c0aae3d ON payment_payment USING btree (checkout_id);


--
-- TOC entry 3024 (class 1259 OID 19250)
-- Name: payment_paymentmethod_order_id_58acb979; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX payment_paymentmethod_order_id_58acb979 ON payment_payment USING btree (task_id);


--
-- TOC entry 3027 (class 1259 OID 19256)
-- Name: payment_transaction_payment_method_id_d35e75c1; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX payment_transaction_payment_method_id_d35e75c1 ON payment_transaction USING btree (payment_id);


--
-- TOC entry 2858 (class 1259 OID 19642)
-- Name: product_attribute_product_type_id_95b8020e; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_attribute_product_type_id_95b8020e ON skill_attribute USING btree (skill_type_id);


--
-- TOC entry 2859 (class 1259 OID 19648)
-- Name: product_attribute_product_variant_type_id_504d9ada; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_attribute_product_variant_type_id_504d9ada ON skill_attribute USING btree (skill_variant_type_id);


--
-- TOC entry 2860 (class 1259 OID 19641)
-- Name: product_attribute_slug_a2ba35f2; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_attribute_slug_a2ba35f2 ON skill_attribute USING btree (slug);


--
-- TOC entry 3059 (class 1259 OID 19543)
-- Name: product_attributechoiceval_attribute_choice_value_id_71c4c0a7; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_attributechoiceval_attribute_choice_value_id_71c4c0a7 ON skill_attributevaluetranslation USING btree (attribute_value_id);


--
-- TOC entry 2836 (class 1259 OID 16909)
-- Name: product_attributechoicevalue_attribute_id_c28c6c92; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_attributechoicevalue_attribute_id_c28c6c92 ON skill_attributevalue USING btree (attribute_id);


--
-- TOC entry 2839 (class 1259 OID 18103)
-- Name: product_attributechoicevalue_slug_e0d2d25b; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_attributechoicevalue_slug_e0d2d25b ON skill_attributevalue USING btree (slug);


--
-- TOC entry 2840 (class 1259 OID 18102)
-- Name: product_attributechoicevalue_slug_e0d2d25b_like; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_attributechoicevalue_slug_e0d2d25b_like ON skill_attributevalue USING btree (slug varchar_pattern_ops);


--
-- TOC entry 2841 (class 1259 OID 18689)
-- Name: product_attributechoicevalue_sort_order_c4c071c4; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_attributechoicevalue_sort_order_c4c071c4 ON skill_attributevalue USING btree (sort_order);


--
-- TOC entry 2844 (class 1259 OID 16845)
-- Name: product_category_level_b59332d3; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_category_level_b59332d3 ON skill_category USING btree (level);


--
-- TOC entry 2845 (class 1259 OID 16842)
-- Name: product_category_lft_3708054f; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_category_lft_3708054f ON skill_category USING btree (lft);


--
-- TOC entry 2846 (class 1259 OID 16846)
-- Name: product_category_parent_id_f6860923; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_category_parent_id_f6860923 ON skill_category USING btree (parent_id);


--
-- TOC entry 2847 (class 1259 OID 16843)
-- Name: product_category_rght_fcbf9e79; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_category_rght_fcbf9e79 ON skill_category USING btree (rght);


--
-- TOC entry 2848 (class 1259 OID 18105)
-- Name: product_category_slug_e1f8ccc4; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_category_slug_e1f8ccc4 ON skill_category USING btree (slug);


--
-- TOC entry 2849 (class 1259 OID 18104)
-- Name: product_category_slug_e1f8ccc4_like; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_category_slug_e1f8ccc4_like ON skill_category USING btree (slug varchar_pattern_ops);


--
-- TOC entry 2850 (class 1259 OID 16844)
-- Name: product_category_tree_id_f3c46461; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_category_tree_id_f3c46461 ON skill_category USING btree (tree_id);


--
-- TOC entry 3064 (class 1259 OID 19549)
-- Name: product_categorytranslation_category_id_aa8d0917; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_categorytranslation_category_id_aa8d0917 ON skill_categorytranslation USING btree (category_id);


--
-- TOC entry 2911 (class 1259 OID 18083)
-- Name: product_collection_name_03bb818b_like; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_collection_name_03bb818b_like ON skill_collection USING btree (name varchar_pattern_ops);


--
-- TOC entry 2920 (class 1259 OID 18098)
-- Name: product_collection_products_collection_id_0bc817dc; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_collection_products_collection_id_0bc817dc ON skill_collection_skills USING btree (collection_id);


--
-- TOC entry 2921 (class 1259 OID 18099)
-- Name: product_collection_products_product_id_a45a5b06; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_collection_products_product_id_a45a5b06 ON skill_collection_skills USING btree (skill_id);


--
-- TOC entry 2914 (class 1259 OID 18106)
-- Name: product_collection_slug_ec186116; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_collection_slug_ec186116 ON skill_collection USING btree (slug);


--
-- TOC entry 2915 (class 1259 OID 18107)
-- Name: product_collection_slug_ec186116_like; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_collection_slug_ec186116_like ON skill_collection USING btree (slug varchar_pattern_ops);


--
-- TOC entry 3069 (class 1259 OID 19555)
-- Name: product_collectiontranslation_collection_id_cfbbd453; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_collectiontranslation_collection_id_cfbbd453 ON skill_collectiontranslation USING btree (collection_id);


--
-- TOC entry 2853 (class 1259 OID 18014)
-- Name: product_product_category_id_0c725779; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_product_category_id_0c725779 ON skill_skill USING btree (category_id);


--
-- TOC entry 2854 (class 1259 OID 19969)
-- Name: product_product_owner_id_af246414; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_product_owner_id_af246414 ON skill_skill USING btree (owner_id);


--
-- TOC entry 2855 (class 1259 OID 17305)
-- Name: product_product_product_class_id_0547c998; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_product_product_class_id_0547c998 ON skill_skill USING btree (skill_type_id);


--
-- TOC entry 2861 (class 1259 OID 16847)
-- Name: product_productattribute_name_97ca2b51_like; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_productattribute_name_97ca2b51_like ON skill_attribute USING btree (slug varchar_pattern_ops);


--
-- TOC entry 3074 (class 1259 OID 19561)
-- Name: product_productattributetr_product_attribute_id_56b48511; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_productattributetr_product_attribute_id_56b48511 ON skill_attributetranslation USING btree (attribute_id);


--
-- TOC entry 2864 (class 1259 OID 18688)
-- Name: product_productimage_sort_order_dfda9c19; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_productimage_sort_order_dfda9c19 ON skill_skillimage USING btree (sort_order);


--
-- TOC entry 3079 (class 1259 OID 19567)
-- Name: product_producttranslation_product_id_2c2c7532; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_producttranslation_product_id_2c2c7532 ON skill_skilltranslation USING btree (skill_id);


--
-- TOC entry 2868 (class 1259 OID 16860)
-- Name: product_productvariant_product_id_43c5a310; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_productvariant_product_id_43c5a310 ON skill_skillvariant USING btree (skill_id);


--
-- TOC entry 2869 (class 1259 OID 16859)
-- Name: product_productvariant_sku_50706818_like; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_productvariant_sku_50706818_like ON skill_skillvariant USING btree (sku varchar_pattern_ops);


--
-- TOC entry 3084 (class 1259 OID 19573)
-- Name: product_productvarianttranslation_product_variant_id_1b144a85; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_productvarianttranslation_product_variant_id_1b144a85 ON skill_skillvarianttranslation USING btree (skill_variant_id);


--
-- TOC entry 2874 (class 1259 OID 16995)
-- Name: product_variantimage_image_id_bef14106; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_variantimage_image_id_bef14106 ON skill_variantimage USING btree (image_id);


--
-- TOC entry 2875 (class 1259 OID 16996)
-- Name: product_variantimage_variant_id_81123814; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX product_variantimage_variant_id_81123814 ON skill_variantimage USING btree (variant_id);


--
-- TOC entry 2835 (class 1259 OID 19832)
-- Name: shipping_shippingmethod_shipping_zone_id_265b7413; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX shipping_shippingmethod_shipping_zone_id_265b7413 ON delivery_deliverymethod USING btree (delivery_zone_id);


--
-- TOC entry 3095 (class 1259 OID 19826)
-- Name: shipping_shippingmethodtranslation_shipping_method_id_31d925d2; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX shipping_shippingmethodtranslation_shipping_method_id_31d925d2 ON delivery_deliverymethodtranslation USING btree (delivery_method_id);


--
-- TOC entry 3049 (class 1259 OID 19381)
-- Name: site_authorizationkey_site_settings_id_d8397c0f; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX site_authorizationkey_site_settings_id_d8397c0f ON site_authorizationkey USING btree (site_settings_id);


--
-- TOC entry 3040 (class 1259 OID 19394)
-- Name: site_sitesettings_bottom_menu_id_e2a78098; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX site_sitesettings_bottom_menu_id_e2a78098 ON site_sitesettings USING btree (bottom_menu_id);


--
-- TOC entry 3041 (class 1259 OID 19574)
-- Name: site_sitesettings_homepage_collection_id_82f45d33; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX site_sitesettings_homepage_collection_id_82f45d33 ON site_sitesettings USING btree (homepage_collection_id);


--
-- TOC entry 3046 (class 1259 OID 19400)
-- Name: site_sitesettings_top_menu_id_ab6f8c46; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX site_sitesettings_top_menu_id_ab6f8c46 ON site_sitesettings USING btree (top_menu_id);


--
-- TOC entry 3056 (class 1259 OID 19468)
-- Name: site_sitesettingstranslation_site_settings_id_ca085ff6; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX site_sitesettingstranslation_site_settings_id_ca085ff6 ON site_sitesettingstranslation USING btree (site_settings_id);


--
-- TOC entry 2867 (class 1259 OID 28251)
-- Name: skill_skillimage_skill_type_id_31d188e4; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX skill_skillimage_skill_type_id_31d188e4 ON skill_skillimage USING btree (skill_type_id);


--
-- TOC entry 3102 (class 1259 OID 19902)
-- Name: social_auth_code_code_a2393167; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX social_auth_code_code_a2393167 ON social_auth_code USING btree (code);


--
-- TOC entry 3103 (class 1259 OID 19903)
-- Name: social_auth_code_code_a2393167_like; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX social_auth_code_code_a2393167_like ON social_auth_code USING btree (code varchar_pattern_ops);


--
-- TOC entry 3108 (class 1259 OID 19941)
-- Name: social_auth_code_timestamp_176b341f; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX social_auth_code_timestamp_176b341f ON social_auth_code USING btree ("timestamp");


--
-- TOC entry 3120 (class 1259 OID 19952)
-- Name: social_auth_partial_timestamp_50f2119f; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX social_auth_partial_timestamp_50f2119f ON social_auth_partial USING btree ("timestamp");


--
-- TOC entry 3121 (class 1259 OID 19931)
-- Name: social_auth_partial_token_3017fea3; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX social_auth_partial_token_3017fea3 ON social_auth_partial USING btree (token);


--
-- TOC entry 3122 (class 1259 OID 19932)
-- Name: social_auth_partial_token_3017fea3_like; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX social_auth_partial_token_3017fea3_like ON social_auth_partial USING btree (token varchar_pattern_ops);


--
-- TOC entry 3117 (class 1259 OID 19909)
-- Name: social_auth_usersocialauth_user_id_17d28448; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX social_auth_usersocialauth_user_id_17d28448 ON social_auth_usersocialauth USING btree (user_id);


--
-- TOC entry 2810 (class 1259 OID 16524)
-- Name: userprofile_user_addresses_address_id_ad7646b4; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX userprofile_user_addresses_address_id_ad7646b4 ON account_user_addresses USING btree (address_id);


--
-- TOC entry 2815 (class 1259 OID 16523)
-- Name: userprofile_user_addresses_user_id_bb5aa55e; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX userprofile_user_addresses_user_id_bb5aa55e ON account_user_addresses USING btree (user_id);


--
-- TOC entry 2801 (class 1259 OID 16525)
-- Name: userprofile_user_default_billing_address_id_0489abf1; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX userprofile_user_default_billing_address_id_0489abf1 ON account_user USING btree (default_billing_address_id);


--
-- TOC entry 2802 (class 1259 OID 16531)
-- Name: userprofile_user_default_shipping_address_id_aae7a203; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX userprofile_user_default_shipping_address_id_aae7a203 ON account_user USING btree (default_delivery_address_id);


--
-- TOC entry 2803 (class 1259 OID 16510)
-- Name: userprofile_user_email_b0fb0137_like; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX userprofile_user_email_b0fb0137_like ON account_user USING btree (email varchar_pattern_ops);


--
-- TOC entry 2816 (class 1259 OID 16550)
-- Name: userprofile_user_groups_group_id_c7eec74e; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX userprofile_user_groups_group_id_c7eec74e ON account_user_groups USING btree (group_id);


--
-- TOC entry 2819 (class 1259 OID 16549)
-- Name: userprofile_user_groups_user_id_5e712a24; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX userprofile_user_groups_user_id_5e712a24 ON account_user_groups USING btree (user_id);


--
-- TOC entry 2824 (class 1259 OID 16564)
-- Name: userprofile_user_user_permissions_permission_id_1caa8a71; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX userprofile_user_user_permissions_permission_id_1caa8a71 ON account_user_user_permissions USING btree (permission_id);


--
-- TOC entry 2827 (class 1259 OID 16563)
-- Name: userprofile_user_user_permissions_user_id_6d654469; Type: INDEX; Schema: public; Owner: remote_works
--

CREATE INDEX userprofile_user_user_permissions_user_id_6d654469 ON account_user_user_permissions USING btree (user_id);


--
-- TOC entry 3137 (class 2606 OID 16629)
-- Name: account_customernote account_customernote_customer_id_ec50cbf6_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_customernote
    ADD CONSTRAINT account_customernote_customer_id_ec50cbf6_fk_account_user_id FOREIGN KEY (customer_id) REFERENCES account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3138 (class 2606 OID 16635)
-- Name: account_customernote account_customernote_user_id_b10a6c14_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_customernote
    ADD CONSTRAINT account_customernote_user_id_b10a6c14_fk_account_user_id FOREIGN KEY (user_id) REFERENCES account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3210 (class 2606 OID 28240)
-- Name: account_schedule account_schedule_owner_id_9acfd6a7_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_schedule
    ADD CONSTRAINT account_schedule_owner_id_9acfd6a7_fk_account_user_id FOREIGN KEY (owner_id) REFERENCES account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3131 (class 2606 OID 16640)
-- Name: account_user_addresses account_user_address_address_id_d218822a_fk_account_a; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user_addresses
    ADD CONSTRAINT account_user_address_address_id_d218822a_fk_account_a FOREIGN KEY (address_id) REFERENCES account_address(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3132 (class 2606 OID 16645)
-- Name: account_user_addresses account_user_addresses_user_id_2fcc8301_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user_addresses
    ADD CONSTRAINT account_user_addresses_user_id_2fcc8301_fk_account_user_id FOREIGN KEY (user_id) REFERENCES account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3128 (class 2606 OID 16456)
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3127 (class 2606 OID 16451)
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3126 (class 2606 OID 16442)
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3156 (class 2606 OID 17197)
-- Name: checkout_cart cart_cart_billing_address_id_9eb62ddd_fk_account_address_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY checkout_cart
    ADD CONSTRAINT cart_cart_billing_address_id_9eb62ddd_fk_account_address_id FOREIGN KEY (billing_address_id) REFERENCES account_address(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3157 (class 2606 OID 17203)
-- Name: checkout_cart cart_cart_shipping_address_id_adfddaf9_fk_account_address_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY checkout_cart
    ADD CONSTRAINT cart_cart_shipping_address_id_adfddaf9_fk_account_address_id FOREIGN KEY (delivery_address_id) REFERENCES account_address(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3155 (class 2606 OID 17157)
-- Name: checkout_cart cart_cart_user_id_9b4220b9_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY checkout_cart
    ADD CONSTRAINT cart_cart_user_id_9b4220b9_fk_account_user_id FOREIGN KEY (user_id) REFERENCES account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3159 (class 2606 OID 17167)
-- Name: checkout_cartline cart_cartline_cart_id_c7b9981e_fk_cart_cart_token; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY checkout_cartline
    ADD CONSTRAINT cart_cartline_cart_id_c7b9981e_fk_cart_cart_token FOREIGN KEY (cart_id) REFERENCES checkout_cart(token) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3160 (class 2606 OID 17172)
-- Name: checkout_cartline cart_cartline_variant_id_dbca56c9_fk_skill_skillvariant_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY checkout_cartline
    ADD CONSTRAINT cart_cartline_variant_id_dbca56c9_fk_skill_skillvariant_id FOREIGN KEY (variant_id) REFERENCES skill_skillvariant(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3158 (class 2606 OID 17214)
-- Name: checkout_cart checkout_cart_shipping_method_id_9f7efa8a_fk_shipping_; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY checkout_cart
    ADD CONSTRAINT checkout_cart_shipping_method_id_9f7efa8a_fk_shipping_ FOREIGN KEY (delivery_method_id) REFERENCES delivery_deliverymethod(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3151 (class 2606 OID 18731)
-- Name: discount_sale_categories discount_sale_catego_category_id_64e132af_fk_skill_c; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_sale_categories
    ADD CONSTRAINT discount_sale_catego_category_id_64e132af_fk_skill_c FOREIGN KEY (category_id) REFERENCES skill_category(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3152 (class 2606 OID 18736)
-- Name: discount_sale_categories discount_sale_categories_sale_id_2aeee4a7_fk_discount_sale_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_sale_categories
    ADD CONSTRAINT discount_sale_categories_sale_id_2aeee4a7_fk_discount_sale_id FOREIGN KEY (sale_id) REFERENCES discount_sale(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3173 (class 2606 OID 18774)
-- Name: discount_sale_collections discount_sale_collec_collection_id_f66df9d7_fk_skill_c; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_sale_collections
    ADD CONSTRAINT discount_sale_collec_collection_id_f66df9d7_fk_skill_c FOREIGN KEY (collection_id) REFERENCES skill_collection(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3174 (class 2606 OID 18769)
-- Name: discount_sale_collections discount_sale_collections_sale_id_a912da4a_fk_discount_sale_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_sale_collections
    ADD CONSTRAINT discount_sale_collections_sale_id_a912da4a_fk_discount_sale_id FOREIGN KEY (sale_id) REFERENCES discount_sale(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3153 (class 2606 OID 18741)
-- Name: discount_sale_skills discount_sale_produc_skill_id_d42c9636_fk_skill_p; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_sale_skills
    ADD CONSTRAINT discount_sale_produc_skill_id_d42c9636_fk_skill_p FOREIGN KEY (skill_id) REFERENCES skill_skill(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3154 (class 2606 OID 18746)
-- Name: discount_sale_skills discount_sale_skills_sale_id_10e3a20f_fk_discount_sale_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_sale_skills
    ADD CONSTRAINT discount_sale_skills_sale_id_10e3a20f_fk_discount_sale_id FOREIGN KEY (sale_id) REFERENCES discount_sale(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3176 (class 2606 OID 18837)
-- Name: discount_voucher_categories discount_voucher_cat_category_id_fc9d044a_fk_skill_c; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_voucher_categories
    ADD CONSTRAINT discount_voucher_cat_category_id_fc9d044a_fk_skill_c FOREIGN KEY (category_id) REFERENCES skill_category(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3175 (class 2606 OID 18832)
-- Name: discount_voucher_categories discount_voucher_cat_voucher_id_19a56338_fk_discount_; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_voucher_categories
    ADD CONSTRAINT discount_voucher_cat_voucher_id_19a56338_fk_discount_ FOREIGN KEY (voucher_id) REFERENCES discount_voucher(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3178 (class 2606 OID 18851)
-- Name: discount_voucher_collections discount_voucher_col_collection_id_b9de6b54_fk_skill_c; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_voucher_collections
    ADD CONSTRAINT discount_voucher_col_collection_id_b9de6b54_fk_skill_c FOREIGN KEY (collection_id) REFERENCES skill_collection(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3177 (class 2606 OID 18846)
-- Name: discount_voucher_collections discount_voucher_col_voucher_id_4ce1fde3_fk_discount_; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_voucher_collections
    ADD CONSTRAINT discount_voucher_col_voucher_id_4ce1fde3_fk_discount_ FOREIGN KEY (voucher_id) REFERENCES discount_voucher(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3180 (class 2606 OID 18865)
-- Name: discount_voucher_skills discount_voucher_pro_skill_id_4a3131ff_fk_skill_p; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_voucher_skills
    ADD CONSTRAINT discount_voucher_pro_skill_id_4a3131ff_fk_skill_p FOREIGN KEY (skill_id) REFERENCES skill_skill(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3179 (class 2606 OID 18860)
-- Name: discount_voucher_skills discount_voucher_pro_voucher_id_8a2e6c3a_fk_discount_; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_voucher_skills
    ADD CONSTRAINT discount_voucher_pro_voucher_id_8a2e6c3a_fk_discount_ FOREIGN KEY (voucher_id) REFERENCES discount_voucher(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3181 (class 2606 OID 18884)
-- Name: discount_vouchertranslation discount_vouchertran_voucher_id_288246a9_fk_discount_; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY discount_vouchertranslation
    ADD CONSTRAINT discount_vouchertran_voucher_id_288246a9_fk_discount_ FOREIGN KEY (voucher_id) REFERENCES discount_voucher(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3182 (class 2606 OID 18960)
-- Name: impersonate_impersonationlog impersonate_imperson_impersonating_id_afd114fc_fk_account_u; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY impersonate_impersonationlog
    ADD CONSTRAINT impersonate_imperson_impersonating_id_afd114fc_fk_account_u FOREIGN KEY (impersonating_id) REFERENCES account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3183 (class 2606 OID 18965)
-- Name: impersonate_impersonationlog impersonate_imperson_impersonator_id_1ecfe8ce_fk_account_u; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY impersonate_impersonationlog
    ADD CONSTRAINT impersonate_imperson_impersonator_id_1ecfe8ce_fk_account_u FOREIGN KEY (impersonator_id) REFERENCES account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3187 (class 2606 OID 19010)
-- Name: menu_menuitem menu_menuitem_category_id_af353a3b_fk_skill_category_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY menu_menuitem
    ADD CONSTRAINT menu_menuitem_category_id_af353a3b_fk_skill_category_id FOREIGN KEY (category_id) REFERENCES skill_category(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3188 (class 2606 OID 19015)
-- Name: menu_menuitem menu_menuitem_collection_id_b913b19e_fk_skill_collection_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY menu_menuitem
    ADD CONSTRAINT menu_menuitem_collection_id_b913b19e_fk_skill_collection_id FOREIGN KEY (collection_id) REFERENCES skill_collection(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3184 (class 2606 OID 19020)
-- Name: menu_menuitem menu_menuitem_menu_id_f466b139_fk_menu_menu_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY menu_menuitem
    ADD CONSTRAINT menu_menuitem_menu_id_f466b139_fk_menu_menu_id FOREIGN KEY (menu_id) REFERENCES menu_menu(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3185 (class 2606 OID 19025)
-- Name: menu_menuitem menu_menuitem_page_id_a0c8f92d_fk_page_page_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY menu_menuitem
    ADD CONSTRAINT menu_menuitem_page_id_a0c8f92d_fk_page_page_id FOREIGN KEY (page_id) REFERENCES page_page(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3186 (class 2606 OID 19030)
-- Name: menu_menuitem menu_menuitem_parent_id_439f55a5_fk_menu_menuitem_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY menu_menuitem
    ADD CONSTRAINT menu_menuitem_parent_id_439f55a5_fk_menu_menuitem_id FOREIGN KEY (parent_id) REFERENCES menu_menuitem(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3189 (class 2606 OID 19073)
-- Name: menu_menuitemtranslation menu_menuitemtransla_menu_item_id_3445926c_fk_menu_menu; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY menu_menuitemtranslation
    ADD CONSTRAINT menu_menuitemtransla_menu_item_id_3445926c_fk_menu_menu FOREIGN KEY (menu_item_id) REFERENCES menu_menuitem(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3170 (class 2606 OID 18565)
-- Name: task_fulfillment order_fulfillment_order_id_02695111_fk_order_order_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_fulfillment
    ADD CONSTRAINT order_fulfillment_order_id_02695111_fk_order_order_id FOREIGN KEY (order_id) REFERENCES task_task(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3172 (class 2606 OID 18576)
-- Name: task_fulfillmentline order_fulfillmentlin_fulfillment_id_68f3291d_fk_order_ful; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_fulfillmentline
    ADD CONSTRAINT order_fulfillmentlin_fulfillment_id_68f3291d_fk_order_ful FOREIGN KEY (fulfillment_id) REFERENCES task_fulfillment(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3171 (class 2606 OID 18571)
-- Name: task_fulfillmentline order_fulfillmentlin_order_line_id_7d40e054_fk_order_ord; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_fulfillmentline
    ADD CONSTRAINT order_fulfillmentlin_order_line_id_7d40e054_fk_order_ord FOREIGN KEY (order_line_id) REFERENCES task_taskline(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3164 (class 2606 OID 18594)
-- Name: task_task order_order_billing_address_id_8fe537cf_fk_account_address_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_task
    ADD CONSTRAINT order_order_billing_address_id_8fe537cf_fk_account_address_id FOREIGN KEY (billing_address_id) REFERENCES account_address(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3165 (class 2606 OID 18600)
-- Name: task_task order_order_shipping_address_id_57e64931_fk_account_address_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_task
    ADD CONSTRAINT order_order_shipping_address_id_57e64931_fk_account_address_id FOREIGN KEY (delivery_address_id) REFERENCES account_address(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3167 (class 2606 OID 19172)
-- Name: task_task order_order_shipping_method_id_2a742834_fk_shipping_; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_task
    ADD CONSTRAINT order_order_shipping_method_id_2a742834_fk_shipping_ FOREIGN KEY (delivery_method_id) REFERENCES delivery_deliverymethod(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3163 (class 2606 OID 18415)
-- Name: task_task order_order_user_id_7cf9bc2b_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_task
    ADD CONSTRAINT order_order_user_id_7cf9bc2b_fk_account_user_id FOREIGN KEY (user_id) REFERENCES account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3166 (class 2606 OID 19109)
-- Name: task_task order_order_voucher_id_0748ca22_fk_discount_voucher_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_task
    ADD CONSTRAINT order_order_voucher_id_0748ca22_fk_discount_voucher_id FOREIGN KEY (voucher_id) REFERENCES discount_voucher(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3190 (class 2606 OID 19188)
-- Name: task_taskevent order_orderevent_order_id_09aa7ccd_fk_order_order_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_taskevent
    ADD CONSTRAINT order_orderevent_order_id_09aa7ccd_fk_order_order_id FOREIGN KEY (task_id) REFERENCES task_task(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3191 (class 2606 OID 19193)
-- Name: task_taskevent order_orderevent_user_id_1056ac9c_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_taskevent
    ADD CONSTRAINT order_orderevent_user_id_1056ac9c_fk_account_user_id FOREIGN KEY (user_id) REFERENCES account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3168 (class 2606 OID 18589)
-- Name: task_taskline order_orderline_order_id_eb04ec2d_fk_order_order_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_taskline
    ADD CONSTRAINT order_orderline_order_id_eb04ec2d_fk_order_order_id FOREIGN KEY (task_id) REFERENCES task_task(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3169 (class 2606 OID 19210)
-- Name: task_taskline order_orderline_variant_id_866774cb_fk_skill_p; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY task_taskline
    ADD CONSTRAINT order_orderline_variant_id_866774cb_fk_skill_p FOREIGN KEY (variant_id) REFERENCES skill_skillvariant(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3195 (class 2606 OID 19287)
-- Name: page_pagetranslation page_pagetranslation_page_id_60216ef5_fk_page_page_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY page_pagetranslation
    ADD CONSTRAINT page_pagetranslation_page_id_60216ef5_fk_page_page_id FOREIGN KEY (page_id) REFERENCES page_page(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3192 (class 2606 OID 19318)
-- Name: payment_payment payment_payment_checkout_id_1f32e1ab_fk_checkout_cart_token; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY payment_payment
    ADD CONSTRAINT payment_payment_checkout_id_1f32e1ab_fk_checkout_cart_token FOREIGN KEY (checkout_id) REFERENCES checkout_cart(token) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3193 (class 2606 OID 19323)
-- Name: payment_payment payment_payment_order_id_22b45881_fk_order_order_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY payment_payment
    ADD CONSTRAINT payment_payment_order_id_22b45881_fk_order_order_id FOREIGN KEY (task_id) REFERENCES task_task(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3194 (class 2606 OID 19313)
-- Name: payment_transaction payment_transaction_payment_id_df9808d7_fk_payment_payment_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY payment_transaction
    ADD CONSTRAINT payment_transaction_payment_id_df9808d7_fk_payment_payment_id FOREIGN KEY (payment_id) REFERENCES payment_payment(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3205 (class 2606 OID 19625)
-- Name: skill_attributetranslation product_attributetra_attribute_id_238dabfc_fk_product_a; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_attributetranslation
    ADD CONSTRAINT product_attributetra_attribute_id_238dabfc_fk_product_a FOREIGN KEY (attribute_id) REFERENCES skill_attribute(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3208 (class 2606 OID 19827)
-- Name: delivery_deliverymethodtranslation shipping_shippingmet_shipping_method_id_31d925d2_fk_shipping_; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY delivery_deliverymethodtranslation
    ADD CONSTRAINT shipping_shippingmet_shipping_method_id_31d925d2_fk_shipping_ FOREIGN KEY (delivery_method_id) REFERENCES delivery_deliverymethod(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3139 (class 2606 OID 19833)
-- Name: delivery_deliverymethod shipping_shippingmet_shipping_zone_id_265b7413_fk_shipping_; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY delivery_deliverymethod
    ADD CONSTRAINT shipping_shippingmet_shipping_zone_id_265b7413_fk_shipping_ FOREIGN KEY (delivery_zone_id) REFERENCES delivery_deliveryzone(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3200 (class 2606 OID 19376)
-- Name: site_authorizationkey site_authorizationke_site_settings_id_d8397c0f_fk_site_site; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY site_authorizationkey
    ADD CONSTRAINT site_authorizationke_site_settings_id_d8397c0f_fk_site_site FOREIGN KEY (site_settings_id) REFERENCES site_sitesettings(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3197 (class 2606 OID 19395)
-- Name: site_sitesettings site_sitesettings_bottom_menu_id_e2a78098_fk_menu_menu_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY site_sitesettings
    ADD CONSTRAINT site_sitesettings_bottom_menu_id_e2a78098_fk_menu_menu_id FOREIGN KEY (bottom_menu_id) REFERENCES menu_menu(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3199 (class 2606 OID 19575)
-- Name: site_sitesettings site_sitesettings_homepage_collection__82f45d33_fk_skill_c; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY site_sitesettings
    ADD CONSTRAINT site_sitesettings_homepage_collection__82f45d33_fk_skill_c FOREIGN KEY (homepage_collection_id) REFERENCES skill_collection(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3196 (class 2606 OID 19389)
-- Name: site_sitesettings site_sitesettings_site_id_64dd8ff8_fk_django_site_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY site_sitesettings
    ADD CONSTRAINT site_sitesettings_site_id_64dd8ff8_fk_django_site_id FOREIGN KEY (site_id) REFERENCES django_site(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3198 (class 2606 OID 19401)
-- Name: site_sitesettings site_sitesettings_top_menu_id_ab6f8c46_fk_menu_menu_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY site_sitesettings
    ADD CONSTRAINT site_sitesettings_top_menu_id_ab6f8c46_fk_menu_menu_id FOREIGN KEY (top_menu_id) REFERENCES menu_menu(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3201 (class 2606 OID 19463)
-- Name: site_sitesettingstranslation site_sitesettingstra_site_settings_id_ca085ff6_fk_site_site; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY site_sitesettingstranslation
    ADD CONSTRAINT site_sitesettingstra_site_settings_id_ca085ff6_fk_site_site FOREIGN KEY (site_settings_id) REFERENCES site_sitesettings(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3145 (class 2606 OID 19654)
-- Name: skill_attribute skill_attribute_skill_type_id_95b8020e_fk_skill_p; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_attribute
    ADD CONSTRAINT skill_attribute_skill_type_id_95b8020e_fk_skill_p FOREIGN KEY (skill_type_id) REFERENCES skill_skilltype(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3146 (class 2606 OID 19659)
-- Name: skill_attribute skill_attribute_skill_variant_type_504d9ada_fk_skill_p; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_attribute
    ADD CONSTRAINT skill_attribute_skill_variant_type_504d9ada_fk_skill_p FOREIGN KEY (skill_variant_type_id) REFERENCES skill_skilltype(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3140 (class 2606 OID 19595)
-- Name: skill_attributevalue skill_attributecho_attribute_id_c28c6c92_fk_skill_a; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_attributevalue
    ADD CONSTRAINT skill_attributecho_attribute_id_c28c6c92_fk_skill_a FOREIGN KEY (attribute_id) REFERENCES skill_attribute(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3202 (class 2606 OID 19630)
-- Name: skill_attributevaluetranslation skill_attributeval_attribute_value_id_8b2cb275_fk_skill_a; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_attributevaluetranslation
    ADD CONSTRAINT skill_attributeval_attribute_value_id_8b2cb275_fk_skill_a FOREIGN KEY (attribute_value_id) REFERENCES skill_attributevalue(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3141 (class 2606 OID 17954)
-- Name: skill_category skill_category_parent_id_f6860923_fk_skill_category_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_category
    ADD CONSTRAINT skill_category_parent_id_f6860923_fk_skill_category_id FOREIGN KEY (parent_id) REFERENCES skill_category(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3203 (class 2606 OID 19544)
-- Name: skill_categorytranslation skill_categorytran_category_id_aa8d0917_fk_skill_c; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_categorytranslation
    ADD CONSTRAINT skill_categorytran_category_id_aa8d0917_fk_skill_c FOREIGN KEY (category_id) REFERENCES skill_category(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3161 (class 2606 OID 18086)
-- Name: skill_collection_skills skill_collection_p_collection_id_0bc817dc_fk_skill_c; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_collection_skills
    ADD CONSTRAINT skill_collection_p_collection_id_0bc817dc_fk_skill_c FOREIGN KEY (collection_id) REFERENCES skill_collection(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3162 (class 2606 OID 18091)
-- Name: skill_collection_skills skill_collection_p_skill_id_a45a5b06_fk_skill_p; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_collection_skills
    ADD CONSTRAINT skill_collection_p_skill_id_a45a5b06_fk_skill_p FOREIGN KEY (skill_id) REFERENCES skill_skill(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3204 (class 2606 OID 19550)
-- Name: skill_collectiontranslation skill_collectiontr_collection_id_cfbbd453_fk_skill_c; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_collectiontranslation
    ADD CONSTRAINT skill_collectiontr_collection_id_cfbbd453_fk_skill_c FOREIGN KEY (collection_id) REFERENCES skill_collection(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3143 (class 2606 OID 28203)
-- Name: skill_skill skill_skill_category_id_0284a83d_fk_skill_category_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skill
    ADD CONSTRAINT skill_skill_category_id_0284a83d_fk_skill_category_id FOREIGN KEY (category_id) REFERENCES skill_category(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3144 (class 2606 OID 28208)
-- Name: skill_skill skill_skill_owner_id_4ce68a42_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skill
    ADD CONSTRAINT skill_skill_owner_id_4ce68a42_fk_account_user_id FOREIGN KEY (owner_id) REFERENCES account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3142 (class 2606 OID 18040)
-- Name: skill_skill skill_skill_skill_type_id_4bfbbfda_fk_skill_p; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skill
    ADD CONSTRAINT skill_skill_skill_type_id_4bfbbfda_fk_skill_p FOREIGN KEY (skill_type_id) REFERENCES skill_skilltype(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3147 (class 2606 OID 28252)
-- Name: skill_skillimage skill_skillimage_skill_type_id_31d188e4_fk_skill_skilltype_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skillimage
    ADD CONSTRAINT skill_skillimage_skill_type_id_31d188e4_fk_skill_skilltype_id FOREIGN KEY (skill_type_id) REFERENCES skill_skilltype(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3206 (class 2606 OID 19562)
-- Name: skill_skilltranslation skill_skilltrans_skill_id_2c2c7532_fk_skill_p; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skilltranslation
    ADD CONSTRAINT skill_skilltrans_skill_id_2c2c7532_fk_skill_p FOREIGN KEY (skill_id) REFERENCES skill_skill(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3148 (class 2606 OID 16854)
-- Name: skill_skillvariant skill_skillvaria_skill_id_43c5a310_fk_skill_p; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skillvariant
    ADD CONSTRAINT skill_skillvaria_skill_id_43c5a310_fk_skill_p FOREIGN KEY (skill_id) REFERENCES skill_skill(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3207 (class 2606 OID 19568)
-- Name: skill_skillvarianttranslation skill_skillvaria_skill_variant_id_1b144a85_fk_skill_p; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_skillvarianttranslation
    ADD CONSTRAINT skill_skillvaria_skill_variant_id_1b144a85_fk_skill_p FOREIGN KEY (skill_variant_id) REFERENCES skill_skillvariant(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3149 (class 2606 OID 18004)
-- Name: skill_variantimage skill_variantimage_image_id_bef14106_fk_skill_p; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_variantimage
    ADD CONSTRAINT skill_variantimage_image_id_bef14106_fk_skill_p FOREIGN KEY (image_id) REFERENCES skill_skillimage(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3150 (class 2606 OID 18009)
-- Name: skill_variantimage skill_variantimage_variant_id_81123814_fk_skill_p; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY skill_variantimage
    ADD CONSTRAINT skill_variantimage_variant_id_81123814_fk_skill_p FOREIGN KEY (variant_id) REFERENCES skill_skillvariant(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3209 (class 2606 OID 28186)
-- Name: social_auth_usersocialauth social_auth_usersocialauth_user_id_17d28448_fk_account_user_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY social_auth_usersocialauth
    ADD CONSTRAINT social_auth_usersocialauth_user_id_17d28448_fk_account_user_id FOREIGN KEY (user_id) REFERENCES account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3129 (class 2606 OID 16603)
-- Name: account_user userprofile_user_default_billing_addr_0489abf1_fk_userprofi; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user
    ADD CONSTRAINT userprofile_user_default_billing_addr_0489abf1_fk_userprofi FOREIGN KEY (default_billing_address_id) REFERENCES account_address(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3130 (class 2606 OID 16608)
-- Name: account_user userprofile_user_default_shipping_add_aae7a203_fk_userprofi; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user
    ADD CONSTRAINT userprofile_user_default_shipping_add_aae7a203_fk_userprofi FOREIGN KEY (default_delivery_address_id) REFERENCES account_address(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3134 (class 2606 OID 16542)
-- Name: account_user_groups userprofile_user_groups_group_id_c7eec74e_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user_groups
    ADD CONSTRAINT userprofile_user_groups_group_id_c7eec74e_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3133 (class 2606 OID 16537)
-- Name: account_user_groups userprofile_user_groups_user_id_5e712a24_fk_userprofile_user_id; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user_groups
    ADD CONSTRAINT userprofile_user_groups_user_id_5e712a24_fk_userprofile_user_id FOREIGN KEY (user_id) REFERENCES account_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3136 (class 2606 OID 16556)
-- Name: account_user_user_permissions userprofile_user_use_permission_id_1caa8a71_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user_user_permissions
    ADD CONSTRAINT userprofile_user_use_permission_id_1caa8a71_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3135 (class 2606 OID 16551)
-- Name: account_user_user_permissions userprofile_user_use_user_id_6d654469_fk_userprofi; Type: FK CONSTRAINT; Schema: public; Owner: remote_works
--

ALTER TABLE ONLY account_user_user_permissions
    ADD CONSTRAINT userprofile_user_use_user_id_6d654469_fk_userprofi FOREIGN KEY (user_id) REFERENCES account_user(id) DEFERRABLE INITIALLY DEFERRED;


-- Completed on 2019-05-26 20:54:21

--
-- PostgreSQL database dump complete
--

