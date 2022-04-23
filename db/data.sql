DROP DATABASE IF EXISTS hackunt;

CREATE DATABASE hackunt;

USE hackunt;

CREATE TABLE user_account (
	id VARCHAR(255) NOT NULL,
	user_email VARCHAR(255) NOT NULL,
	user_password VARCHAR(255) NOT NULL,
	user_full_name VARCHAR(255) NOT NULL,
	user_avatar VARCHAR(255) NOT NULL,
	PRIMARY KEY (id)
);


CREATE TABLE meeting (
	id BIGINT NOT NULL AUTO_INCREMENT,
	meeting_title VARCHAR(255) NOT NULL,
	meeting_uid VARCHAR(255) NOT NULL,
	created_by VARCHAR(255) NOT NULL,
	PRIMARY KEY (id)
);


