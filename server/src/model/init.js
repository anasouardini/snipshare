const poolPromise = require('./db');
const {v4: uuid} = require('uuid');

const queries = {
    cleardb: 'DROP TABLE IF EXISTS admin, users, snippets, coworkersRules;',

    createUsers: `CREATE TABLE users (
        user varchar(100) PRIMARY KEY,
        passwd varchar(100) NOT NULL
    );`,

    createMods: `CREATE TABLE mods (
        user varchar(100) PRIMARY KEY,
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
        isPrivate tinyint NOT NULL
    );`,

    insertMods: `
    INSERT INTO
        mods (user, passwd)
    VALUES
        (
            'moderator',
            '$2a$10$L612B2ckWsoZgWRPaYi6JuOgVCC8w6EvGJSL67Qw99yLCDKfIPbW2'
        );`,

    insertUsers: `
        INSERT INTO
            users (user, passwd)
        VALUES   
            (
                'venego',
                '$2b$10$ZwjIliPoQ5Exets.CIQbs.MV0ap50GN9vUmTojQuwKJT5oPpkIDVi'
            ),
            (
                '3disa',
                '$2a$10$j7.gQk2JlsdxIQVGdMeHaO8S6TCcgHn7Z3qvgmk/XwxDzlem7B7Su'
            ),
            (
                'm9ila',
                '$2a$10$j7.gQk2JlsdxIQVGdMeHaO8S6TCcgHn7Z3qvgmk/XwxDzlem7B7Su'
            ),
            (
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
            snippet
        )
        VALUES
        (
            '${uuid()}',
            'venego',
            0,
            'venego snippet 1',
            'I am planning to add a feature where you can have a snippet in your workflow, and have an option to share it with a co-worker.
            or keep it private which is the default value.',
            'const variable="this is the coolest snippet ever"\nconsole.log("msg: ", variable)'
        ),
        (
            '${uuid()}',
            'venego',
            1,
            'venego snippet 4',
            'I am planning to add a feature where you can have a snippet in your workflow, and have an option to share it with a co-worker.
            or keep it private which is the default value.',
            'const variable="this is the coolest snippet ever"\nconsole.log("msg: ", variable)'
        ),
        (
            '${uuid()}',
            'venego',
            1,
            'venego snippet 2',
            'I am planning to add a feature where you can have a snippet in your workflow, and have an option to share it with a co-worker.
            or keep it private which is the default value.',
            'const variable="this is the coolest snippet ever"\nconsole.log("msg: ", variable)'
        ),
        (
            '${uuid()}',
            'venego',
            1,
            'venego snippet 3',
            'I am planning to add a feature where you can have a snippet in your workflow, and have an option to share it with a co-worker.
            or keep it private which is the default value.',
            'const variable="this is the coolest snippet ever"\nconsole.log("msg: ", variable)'
        ),


        (
            '${uuid()}',
            '3sila',
            0,
            '3sila snippet 1',
            'I am planning to add a feature where you can have a snippet in your workflow, and have an option to share it with a co-worker.
            or keep it private which is the default value.',
            'const variable="this is the coolest snippet ever"\nconsole.log("msg: ", variable)'
        ),
        (
            '${uuid()}',
            '3sila',
            1,
            '3sila snippet 4',
            'I am planning to add a feature where you can have a snippet in your workflow, and have an option to share it with a co-worker.
            or keep it private which is the default value.',
            'const variable="this is the coolest snippet ever"\nconsole.log("msg: ", variable)'
        ),
        (
            '${uuid()}',
            '3sila',
            1,
            '3sila snippet 2',
            'I am planning to add a feature where you can have a snippet in your workflow, and have an option to share it with a co-worker.
            or keep it private which is the default value.',
            'const variable="this is the coolest snippet ever"\nconsole.log("msg: ", variable)'
        ),
        (
            '${uuid()}',
            '3sila',
            1,
            '3sila snippet 3',
            'I am planning to add a feature where you can have a snippet in your workflow, and have an option to share it with a co-worker.
            or keep it private which is the default value.',
            'const variable="this is the coolest snippet ever"\nconsole.log("msg: ", variable)'
        ),


        (
            '${uuid()}',
            'm9ila',
            0,
            'm9ila snippet 1',
            'I am planning to add a feature where you can have a snippet in your workflow, and have an option to share it with a co-worker.
            or keep it private which is the default value.',
            'const variable="this is the coolest snippet ever"\nconsole.log("msg: ", variable)'
        ),
        (
            '${uuid()}',
            'm9ila',
            1,
            'm9ila snippet 4',
            'I am planning to add a feature where you can have a snippet in your workflow, and have an option to share it with a co-worker.
            or keep it private which is the default value.',
            'const variable="this is the coolest snippet ever"\nconsole.log("msg: ", variable)'
        ),
        (
            '${uuid()}',
            'm9ila',
            1,
            'm9ila snippet 2',
            'I am planning to add a feature where you can have a snippet in your workflow, and have an option to share it with a co-worker.
            or keep it private which is the default value.',
            'const variable="this is the coolest snippet ever"\nconsole.log("msg: ", variable)'
        ),
        (
            '${uuid()}',
            'm9ila',
            1,
            'm9ila snippet 3',
            'I am planning to add a feature where you can have a snippet in your workflow, and have an option to share it with a co-worker.
            or keep it private which is the default value.',
            'const variable="this is the coolest snippet ever"\nconsole.log("msg: ", variable)'
        ),


        (
            '${uuid()}',
            '3disa',
            0,
            '3disa snippet 1',
            'I am planning to add a feature where you can have a snippet in your workflow, and have an option to share it with a co-worker.
            or keep it private which is the default value.',
            'const variable="this is the coolest snippet ever"\nconsole.log("msg: ", variable)'
        ),
        (
            '${uuid()}',
            '3disa',
            1,
            '3disa snippet 4',
            'I am planning to add a feature where you can have a snippet in your workflow, and have an option to share it with a co-worker.
            or keep it private which is the default value.',
            'const variable="this is the coolest snippet ever"\nconsole.log("msg: ", variable)'
        ),
        (
            '${uuid()}',
            '3disa',
            1,
            '3disa snippet 2',
            'I am planning to add a feature where you can have a snippet in your workflow, and have an option to share it with a co-worker.
            or keep it private which is the default value.',
            'const variable="this is the coolest snippet ever"\nconsole.log("msg: ", variable)'
        ),
        (
            '${uuid()}',
            '3disa',
            1,
            '3disa snippet 3',
            'I am planning to add a feature where you can have a snippet in your workflow, and have an option to share it with a co-worker.
            or keep it private which is the default value.',
            'const variable="this is the coolest snippet ever"\nconsole.log("msg: ", variable)'
        )

        ;`,
};

const restart = async () => {
    const response =
        (await poolPromise(queries.cleardb)) &&
        (await poolPromise(queries.createMods)) &&
        (await poolPromise(queries.insertMods)) &&
        (await poolPromise(queries.createUsers)) &&
        (await poolPromise(queries.insertUsers)) &&
        (await poolPromise(queries.createSnippets)) &&
        (await poolPromise(queries.insertSnippets)) &&
        (await poolPromise(queries.createCoworkers)) &&
        true;

    // const response = poolPromise(queries.insertUsers);

    return response;
};

module.exports = {
    restart,
};
