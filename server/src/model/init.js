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
        UNIQUE(user, coworker),
        CONSTRAINT fk_coworkerRules_users FOREIGN KEY(user)
        REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_coworkerRules_coworkers FOREIGN KEY(coworker)
        REFERENCES users(id) ON DELETE CASCADE
    );`,

    createSnippets: `CREATE TABLE snippets (
        id varchar(100) PRIMARY KEY,
        user varchar(100) NOT NULL,
        title varchar(200) NOT NULL,
        descr varchar(1000) NOT NULL,
        snippet varchar(5000) NOT NULL,
        isPrivate tinyint NOT NULL,
        author varchar(100) NOT NULL,
        INDEX title_index (title),
        CONSTRAINT fk_snippets_users FOREIGN KEY(user) REFERENCES users(id) ON DELETE CASCADE
    );`,
    createNotifications: `CREATE TABLE notifications (
        id varchar(100) PRIMARY KEY,
        user varchar(100) NOT NULL,
        type varchar(20) NOT NULL,
        message varchar(1000) NOT NULL,
        isRead tinyInt  NOT NULL,
        creatDate dateTime NOT NULL,
        CONSTRAINT fk_notifications_users FOREIGN KEY(user) REFERENCES users(id) ON DELETE CASCADE
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
                ?,
                'venego',
                '$2b$10$ZwjIliPoQ5Exets.CIQbs.MV0ap50GN9vUmTojQuwKJT5oPpkIDVi'
            ),
            (
                ?,
                '3disa',
                '$2a$10$2ez/Hwk0h6lVG8m2fQJBU.IcXRBpjKmhCSFCbvbXXl6QL4fqykBLW'
            ),
            (
                ?,
                'm9ila',
                '$2a$10$j7.gQk2JlsdxIQVGdMeHaO8S6TCcgHn7Z3qvgmk/XwxDzlem7B7Su'
            ),
            (
                ?,
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
            ?,
            0,
            'Debouncer Model',
            'This is a debouncer model where you can initialize multiple debounced actions, and they are going to be stored in a list untill you decide to run or delete them',
            'const debouncedActionsList = {};\n\nconst init = (key, func, delay = 500) => {\n\tlet timer;\n\tdebouncedActionsList[key] = (...args) => {\n\t\tif (timer) {\n\t\t\tclearTimeout(timer);\n\t\t}\n\t\ttimer = setTimeout(() => {\n\t\t\tfunc(...args);\n\t\t}, delay);\n\t};\n};\nconst clear = (key) => {\n\tdelete debouncedActionsList[key];\n};\nconst run = (key, ...args) => {\n\tdebouncedActionsList[key](...args);\n};\n\nexport default {init, run, clear};',
            ?
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?
        ),
        (
            '${uuid()}',
            ?,
            1,
            'react functional component',
            'use this to create a react functional component',
            'import react from "react";\nexport default function Component(props){\n\treturn (<p>Component</p>);\n}',
            ?
        ),
        (
            '${uuid()}',
            ?,
            0,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?
        ),
        (
            '${uuid()}',
            ?,
            0,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?
        ),
        (
            '${uuid()}',
            ?,
            0,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?
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

    // order matters
    const usersIds = [uuid(), uuid(), uuid(), uuid()];
    response = await poolPromise(queries.insertUsers, usersIds);
    // console.log(response);
    if (!response) return false;

    response = await poolPromise(queries.createSnippets);
    // console.log(response);
    if (!response) return false;

    response = await poolPromise(queries.createNotifications);
    if (!response) return false;

    // order matters
    /*   for each snippet, there is an author and an owner.
     *   4 snippets for each owner(and author in this case)
     *   there for the Array(8)*/
    response = await poolPromise(queries.insertSnippets, [
        ...[
            usersIds[0],
            usersIds[1],

            usersIds[0],
            usersIds[2],

            usersIds[0],
            usersIds[0],

            usersIds[0],
            usersIds[3],
        ],
        // ...Array(8)
        //     .fill('')
        //     .map(() => usersIds[0]),
        ...Array(8)
            .fill('')
            .map(() => usersIds[1]),
        ...Array(8)
            .fill('')
            .map(() => usersIds[2]),
        ...Array(8)
            .fill('')
            .map(() => usersIds[3]),
    ]);
    if (!response) return false;

    response = await poolPromise(queries.createCoworkers);
    // console.log(response);
    if (!response) return false;

    return true;
};

module.exports = {
    restart,
};
