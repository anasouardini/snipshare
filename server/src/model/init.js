const poolPromise = require('./db');
const {v4: uuid} = require('uuid');

const queries = {
    cleardb: 'DROP TABLE IF EXISTS mods, users, snippets, coworkersRules, notifications;',

    createUsers: `CREATE TABLE users (
        id varchar(100) PRIMARY KEY,
        user varchar(100) UNIQUE NOT NULL,
        passwd varchar(100) NOT NULL
    );`,

    createMods: `CREATE TABLE mods (
        id varchar(100) PRIMARY KEY,
        user varchar(100) UNIQUE NOT NULL,
        passwd varchar(100) NOT NULL
    );`,

    createCoworkers: `CREATE TABLE coworkersRules (
        user varchar(100) NOT NULL,
        coworker varchar(100) NOT NULL,
        generic json NOT NULL,
        exceptions json NOT NULL,
        PRIMARY KEY(user, coworker)
    );`,

    createSnippets: `CREATE TABLE snippets (
        id varchar(100) PRIMARY KEY,
        user varchar(100) NOT NULL,
        title varchar(200) NOT NULL,
        descr varchar(1000) NOT NULL,
        snippet varchar(5000) NOT NULL,
        isPrivate tinyint NOT NULL,
        author varchar(100) NOT NULL,
        INDEX title_index (title)
    );`,
    createNotifications: `CREATE TABLE notifications (
        id varchar(100) PRIMARY KEY,
        user varchar(100) NOT NULL,
        type varchar(20) NOT NULL,
        message varchar(1000) NOT NULL,
        isRead tinyInt  NOT NULL,
        creatDate dateTime NOT NULL
    );`,

    insertMods: `
    INSERT INTO
        mods (id, user, passwd)
    VALUES
        (
            '${uuid()}',
            'moderator',
            '$2a$10$L612B2ckWsoZgWRPaYi6JuOgVCC8w6EvGJSL67Qw99yLCDKfIPbW2'
        );`,

    insertUsers: `
        INSERT INTO
            users (id, user, passwd)
        VALUES   
            (
                '${uuid()}',
                'venego',
                '$2b$10$ZwjIliPoQ5Exets.CIQbs.MV0ap50GN9vUmTojQuwKJT5oPpkIDVi'
            ),
            (
                '${uuid()}',
                '3disa',
                '$2a$10$j7.gQk2JlsdxIQVGdMeHaO8S6TCcgHn7Z3qvgmk/XwxDzlem7B7Su'
            ),
            (
                '${uuid()}',
                'm9ila',
                '$2a$10$j7.gQk2JlsdxIQVGdMeHaO8S6TCcgHn7Z3qvgmk/XwxDzlem7B7Su'
            ),
            (
                '${uuid()}',
                '3sila',
                '$2a$10$o4Gk9LHIOzuTlNdK2lYQi.yTXHMhXZXbXuLkzVPnhL4Tqf.A6v81m'
            );`,

    insertSnippets: `INSERT INTO
        snippets (
            id,
            user,
            isPrivate,
            title,
            descr,
            snippet,
            author
        )
        VALUES
        (
            '${uuid()}',
            'venego',
            0,
            'Debouncer Model',
            'This is a debouncer model where you can initialize multiple debounced actions, and they are going to be stored in a list untill you decide to run or delete them',
            'const debouncedActionsList = {};\n\nconst init = (key, func, delay = 500) => {\n\tlet timer;\n\tdebouncedActionsList[key] = (...args) => {\n\t\tif (timer) {\n\t\t\tclearTimeout(timer);\n\t\t}\n\t\ttimer = setTimeout(() => {\n\t\t\tfunc(...args);\n\t\t}, delay);\n\t};\n};\nconst clear = (key) => {\n\tdelete debouncedActionsList[key];\n};\nconst run = (key, ...args) => {\n\tdebouncedActionsList[key](...args);\n};\n\nexport default {init, run, clear};',
            'venego'
        ),
        (
            '${uuid()}',
            'venego',
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
           'venego'
        ),
        (
            '${uuid()}',
            'venego',
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            'venego'
        ),
        (
            '${uuid()}',
            'venego',
            1,
            'react functional component',
            'use this to create a react functional component',
            'import react from "react";\nexport default function Component(props){\n\treturn (<p>Component</p>);\n}',
            'venego'
        ),
        (
            '${uuid()}',
            '3sila',
            0,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            '3sila'
        ),
        (
            '${uuid()}',
            '3sila',
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            '3sila'
        ),
        (
            '${uuid()}',
            '3sila',
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            '3sila'
        ),
        (
            '${uuid()}',
            '3sila',
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            '3sila'
        ),
        (
            '${uuid()}',
            'm9ila',
            0,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            'm9ila'
        ),
        (
            '${uuid()}',
            'm9ila',
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            'm9ila'
        ),
        (
            '${uuid()}',
            'm9ila',
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            'm9ila'
        ),
        (
            '${uuid()}',
            'm9ila',
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            'm9ila'
        ),
        (
            '${uuid()}',
            '3disa',
            0,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            '3disa'
        ),
        (
            '${uuid()}',
            '3disa',
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            '3disa'
        ),
        (
            '${uuid()}',
            '3disa',
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            '3disa'
        ),
        (
            '${uuid()}',
            '3disa',
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            '3disa'
        );`,
};

const restart = async () => {
    let response = await poolPromise(queries.cleardb);
    response = await poolPromise(queries.createMods);
    if (!response) return false;

    response = await poolPromise(queries.insertMods);
    if (!response) return false;

    response = await poolPromise(queries.createUsers);
    if (!response) return false;

    response = await poolPromise(queries.insertUsers);
    // console.log(response);
    if (!response) return false;

    response = await poolPromise(queries.createSnippets);
    if (!response) return false;

    response = await poolPromise(queries.createNotifications);
    if (!response) return false;

    response = await poolPromise(queries.insertSnippets);
    if (!response) return false;

    response = await poolPromise(queries.createCoworkers);
    if (!response) return false;

    return true;
};

module.exports = {
    restart,
};
