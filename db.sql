CREATE DATABASE test;

CREATE TABLE public."user" (
	id uuid NOT NULL,
	nome varchar NULL,
	email varchar NULL,
	senha varchar NULL,
	CONSTRAINT user_pk PRIMARY KEY (id)
);
