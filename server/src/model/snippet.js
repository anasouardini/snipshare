const {v4: uuid} = require('uuid');
const poolPromise = require('./db');

const getSnippets = (usr) => poolPromise(`select * from snippets where user = ?`, [usr]);
const getSnippet = (usr, snipID) =>
    poolPromise(`select * from snippets where user = ? and id = ?`, [usr, snipID]);
const deleteSnippet = (usr, snipID) =>
    poolPromise(`delete from snippets where user = ? and id = ?`, [usr, snipID]);
const createSnippet = (props) =>
    poolPromise(
        `INSERT INTO
        snippets (id, user, isPrivate, coworkers, title, descr, snippet)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            uuid(),
            props.user,
            Number(props.isPrivate),
            JSON.stringify({
                ...props.coworkers,
                admin: {user: 'admin', actions: ['read', 'edit', 'create']},
            }),
            props.title,
            props.descr,
            props.snippet,
        ]
    );
const editSnippet = (owner, props) =>
    poolPromise(
        `UPDATE
            snippets SET title=?, descr=?, snippet=?
            WHERE user=? AND id=?;`,
        [props.title, props.descr, props.snippet, owner, props.id]
    );

module.exports = {
    getSnippets,
    getSnippet,
    createSnippet,
    deleteSnippet,
    editSnippet,
};
