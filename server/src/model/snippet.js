const {v4: uuid} = require('uuid');
const poolPromise = require('./db');

const getAllSnippets = (usr) => {
    return poolPromise(`select * from snippets;`);
};
const getUserSnippets = (usr) => {
    return poolPromise(`select * from snippets where user = ?`, [usr]);
};
const getSnippet = (usr, snipID) =>
    poolPromise(`select * from snippets where user = ? and id = ?`, [usr, snipID]);

const deleteSnippet = (usr, snipID) =>
    poolPromise(`delete from snippets where user = ? and id = ?`, [usr, snipID]);

const createSnippet = (props) =>
    poolPromise(
        `INSERT INTO
        snippets (id, user, isPrivate, title, descr, snippet)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            uuid(),
            props.user,
            props.isPrivate ? Number(props.isPrivate) : 0,
            props.title,
            props.descr,
            props.snippet,
        ]
    );
const editSnippet = (owner, props, snippetID) =>
    poolPromise(
        `UPDATE
            snippets SET title=?, descr=?, snippet=?, isPrivate=?
            WHERE user=? AND id=?;`,
        [props.title, props.descr, '', Number(props.isPrivate), owner, snippetID]
    );

module.exports = {
    getAllSnippets,
    getUserSnippets,
    getSnippet,
    createSnippet,
    deleteSnippet,
    editSnippet,
};
