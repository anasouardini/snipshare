DROP DATABASE scrapeyard;

CREATE DATABASE scrapeyard;

USE scrapeyard;

-- SCHEMA
CREATE TABLE admin (
    user varchar(100) PRIMARY KEY,
    passwd varchar(100) NOT NULL
);

CREATE TABLE users (
    user varchar(100) PRIMARY KEY,
    passwd varchar(100) NOT NULL
);

CREATE TABLE snippets (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    user varchar(100) NOT NULL,
    isPrivate tinyint NOT NULL,
    coworkers json NOT NULL,
    img varchar(50) NOT NULL,
    title varchar(200) NOT NULL,
    descr varchar(1000) NOT NULL,
    snippet varchar(5000) NOT NULL
);

-- DATA
INSERT INTO
    admin (user, passwd)
VALUES
    (
        'admin',
        '$2a$10$SAP3XbtuVJY8BpOpp.JR3OtiWtAJRNK2A8DOshVn2/sH1DnylE4ke'
    );

INSERT INTO
    users (user, passwd)
VALUES
    (
        'venego',
        '$2b$10$ZwjIliPoQ5Exets.CIQbs.MV0ap50GN9vUmTojQuwKJT5oPpkIDVi'
    ),
    (
        'm9ila',
        '$2a$10$j7.gQk2JlsdxIQVGdMeHaO8S6TCcgHn7Z3qvgmk/XwxDzlem7B7Su'
    ),
    (
        '3sila',
        '$2a$10$o4Gk9LHIOzuTlNdK2lYQi.yTXHMhXZXbXuLkzVPnhL4Tqf.A6v81m'
    );

INSERT INTO
    snippets (
        user,
        isPrivate,
        coworkers,
        img,
        title,
        descr,
        snippet
    )
VALUES
    (
        'venego',
        1,
        '[{"user": "admin", "actions":["read", "edit", "delete"]},
        {"user": "*", "actions":["read"]},
        {"user": "m9ila", "actions":["read"]}]',
        '',
        'my cool api routes',
        'I am planning to add a feature where you can have a snippet in your workflow, and have an option to share it with a co-worker.
        or keep it private which is the default value.
        however the admin may need to check the snippet you have posted, and has the ability to delete or make a snippet private depending on the content of it.',
        ''
    ),
    (
        'venego',
        1,
        '[{"user": "admin", "actions":["read", "edit", "delete"]},
        {"user": "*", "actions":["read"]},
        {"user": "3sila", "actions":["read", "edit"]}]',
        '',
        'my cool api routes 2',
        'I am planning to add a feature where you can have a snippet in your workflow, and have an option to share it with a co-worker.
        or keep it private which is the default value.
        however the admin may need to check the snippet you have posted, and has the ability to delete or make a snippet private depending on the content of it.',
        ''
    ),
    (
        'venego',
        0,
        '[{"user": "admin", "actions":["read", "edit", "delete"]},
        {"user": "*", "actions":["read"]}]',
        '',
        'my cool api routes 3',
        'I am planning to add a feature where you can have a snippet in your workflow, and have an option to share it with a co-worker.
        or keep it private which is the default value.
        however the admin may need to check the snippet you have posted, and has the ability to delete or make a snippet private depending on the content of it.',
        ''
    );