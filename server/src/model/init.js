const poolPromise = require('./db');
const {v4: uuid} = require('uuid');

const queries = {
    cleardb: `DROP TABLE IF EXISTS mods, users, snippets, categories,
                            languages, coworkersRules, notifications;`,

    createUsers: `CREATE TABLE users (
        id varchar(100) PRIMARY KEY,
        user varchar(100) UNIQUE NOT NULL,
        passwd varchar(100) NOT NULL,
        avatar varchar(100),
        descr varchar(1000),
        createDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    createMods: `CREATE TABLE mods (
        id varchar(100) PRIMARY KEY,
        user varchar(100) UNIQUE NOT NULL,
        passwd varchar(100) NOT NULL,
        createDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    createCoworkers: `CREATE TABLE coworkersRules (
        user varchar(100) NOT NULL,
        coworker varchar(100) NOT NULL,
        generic json NOT NULL,
        exceptions json NOT NULL,
        createDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        lastModified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
        ceateDate dateTime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        lastModified dateTime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        language varchar(100) NOT NULL,
        categories varchar(1000),
        INDEX title_index (title),
        CONSTRAINT fk_snippets_users FOREIGN KEY(user) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_snippets_language FOREIGN KEY(language) REFERENCES languages(name)
    );`,

    createCategories: `CREATE TABLE categories (
        name varchar(100) PRIMARY KEY NOT NULL,
        id varchar(100) UNIQUE NOT NULL
    );`,

    createLanguages: `CREATE TABLE languages(
        name varchar(100) PRIMARY KEY NOT NULL,
        id varchar(100) UNIQUE NOT NULL
    );`,

    createNotifications: `CREATE TABLE notifications (
        id varchar(100) PRIMARY KEY,
        user varchar(100) NOT NULL,
        type varchar(20) NOT NULL,
        message varchar(1000) NOT NULL,
        isRead tinyInt  NOT NULL,
        createDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_notifications_users FOREIGN KEY(user)
        REFERENCES users(id) ON DELETE CASCADE
    );`,

    insertMods: `
    INSERT INTO
        mods (id, user, passwd, avatar)
    VALUES
        (
            '${uuid()}',
            'moderator',
            '$2a$10$L612B2ckWsoZgWRPaYi6JuOgVCC8w6EvGJSL67Qw99yLCDKfIPbW2',
            'http://127.0.0.1:2000/media/avatars/moderator.jpeg'
        );`,

    insertUsers: `
        INSERT INTO
            users (id, user, passwd, avatar, descr)
        VALUES   
            (
                ?,
                'venego',
                '$2b$10$ZwjIliPoQ5Exets.CIQbs.MV0ap50GN9vUmTojQuwKJT5oPpkIDVi',
                ?,
                'my name is venego and this profile a collection of art. my snippets are so valuable you should create a script to add them to your IDE each time you install it on a new setup.'

            ),
            (
                ?,
                '3disa',
                '$2a$10$2ez/Hwk0h6lVG8m2fQJBU.IcXRBpjKmhCSFCbvbXXl6QL4fqykBLW',
                ?,
                'my name is 3disa and this profile a collection of art. my snippets are so valuable you should create a script to add them to your IDE each time you install it on a new setup.'
            ),
            (
                ?,
                'm9ila',
                '$2a$10$j7.gQk2JlsdxIQVGdMeHaO8S6TCcgHn7Z3qvgmk/XwxDzlem7B7Su',
                ?,
                'my name is m9ila and this profile a collection of art. my snippets are so valuable you should create a script to add them to your IDE each time you install it on a new setup.'
            ),
            (
                ?,
                '3sila',
                '$2a$10$o4Gk9LHIOzuTlNdK2lYQi.yTXHMhXZXbXuLkzVPnhL4Tqf.A6v81m',
                ?,
                'my name is 3sila and this profile a collection of art. my snippets are so valuable you should create a script to add them to your IDE each time you install it on a new setup.' 
            );`,

    insertNotifications: `INSERT INTO notifications
                      (id, user, type, message, isRead)
                      VALUES (?, ?, 'info', 'this is a default/test notification', 0)`,

    insertLanguages: `insert into
        languages(id, name)
        values
          ('${uuid()}', ?),
          ('${uuid()}', ?),
          ('${uuid()}', ?),
          ('${uuid()}', ?)
        ;`,
    insertCategories: `insert into
        categories(id, name)
        values
          ('${uuid()}', ?),
          ('${uuid()}', ?),
          ('${uuid()}', ?),
          ('${uuid()}', ?)
        ;`,

    insertSnippets: `INSERT INTO
        snippets (
            id,
            user,
            isPrivate,
            title,
            descr,
            snippet,
            author,
            language,
            categories
        )
        VALUES
        (
            '${uuid()}',
            ?,
            0,
            'Debouncer Model',
            'This is a debouncer model where you can initialize multiple debounced actions, and they are going to be stored in a list untill you decide to run or delete them',
            'const debouncedActionsList = {};\n\nconst init = (key, func, delay = 500) => {\n\tlet timer;\n\tdebouncedActionsList[key] = (...args) => {\n\t\tif (timer) {\n\t\t\tclearTimeout(timer);\n\t\t}\n\t\ttimer = setTimeout(() => {\n\t\t\tfunc(...args);\n\t\t}, delay);\n\t};\n};\nconst clear = (key) => {\n\tdelete debouncedActionsList[key];\n};\nconst run = (key, ...args) => {\n\tdebouncedActionsList[key](...args);\n};\n\nexport default {init, run, clear};',
            ?,
            'javascript',
            'performance'
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?,
            'javascript',
            'performance'
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?,
            'javascript',
            'genericAbstraction'
        ),
        (
            '${uuid()}',
            ?,
            1,
            'react functional component',
            'use this to create a react functional component',
            'import react from "react";\nexport default function Component(props){\n\treturn (<p>Component</p>);\n}',
            ?,
            'javascript',
            'genericAbstraction'
        ),
        (
            '${uuid()}',
            ?,
            0,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?,
            'javascript',
            'genericAbstraction'
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?,
            'javascript',
            'genericAbstraction'
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?,
            'javascript',
            'genericAbstraction'
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?,
            'javascript',
            'genericAbstraction'
        ),
        (
            '${uuid()}',
            ?,
            0,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?,
            'javascript',
            'genericAbstraction'
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?,
            'javascript',
            'genericAbstraction'
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?,
            'javascript',
            'genericAbstraction'
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?,
            'javascript',
            'genericAbstraction'
        ),
        (
            '${uuid()}',
            ?,
            0,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?,
            'javascript',
            'genericAbstraction'
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?,
            'javascript',
            'genericAbstraction'
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?,
            'javascript',
            'genericAbstraction'
        ),
        (
            '${uuid()}',
            ?,
            1,
            'snippet for reversing a string',
            'just a little snippet for reversing a string in js',
            'let str = "be a string";\nstr = str.split(" ").reverse().join(" ");',
            ?,
            'javascript',
            'genericAbstraction'
        );`,
};

const restart = async () => {
    // console.log('l334 init.js: ');
    let response = await poolPromise(queries.cleardb);
    response = await poolPromise(queries.createMods);
    if (!response) return false;

    response = await poolPromise(queries.insertMods);
    if (!response) return false;

    response = await poolPromise(queries.createUsers);
    if (!response) return false;

    // order matters
    const usersIds = [uuid(), uuid(), uuid(), uuid()];
    const avatarsPath = 'http://127.0.0.1:2000/media/avatars/';
    response = await poolPromise(queries.insertUsers, [
        usersIds[0],
        `${avatarsPath}venego.jpeg`,
        usersIds[1],
        `${avatarsPath}3disa.jpeg`,
        usersIds[2],
        `${avatarsPath}m9ila.jpeg`,
        usersIds[3],
        `${avatarsPath}3sila.jpeg`,
    ]);
    console.log(response);
    if (!response) return false;

    response = await poolPromise(queries.createLanguages);
    if (!response) return false;
    response = await poolPromise(queries.createCategories);
    if (!response) return false;
    response = await poolPromise(queries.insertLanguages, ['cpp', 'lua', 'javascript', 'python']);
    if (!response) return false;
    response = await poolPromise(queries.insertCategories, [
        'performance',
        'genericAbstraction',
        'reactSnippet',
        'testing',
    ]);
    if (!response) return false;
    response = await poolPromise(queries.createSnippets);
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
    if (!response) return false;

    response = await poolPromise(queries.insertNotifications, [uuid(), usersIds[0]]);
    response = await poolPromise(queries.insertNotifications, [uuid(), usersIds[1]]);
    response = await poolPromise(queries.insertNotifications, [uuid(), usersIds[2]]);
    response = await poolPromise(queries.insertNotifications, [uuid(), usersIds[3]]);
    // console.log(response);
    if (!response) return false;

    return true;
};

module.exports = {
    restart,
};
