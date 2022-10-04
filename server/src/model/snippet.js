const poolPromise = require('./db');

const getSnippets = (usr) => poolPromise(`select * from snippets where user = ?`, [usr]);
const getSnippet = (usr, snipID) =>
    poolPromise(`select * from snippets where user = ? and id = ?`, [usr, snipID]);
const deleteSnippet = (usr, snipID) =>
    poolPromise(`delete from snippets where user = ? and id = ?`, [usr, snipID]);
const createSnippet = (usr, props) =>
    poolPromise(
        `INSERT INTO
        snippets (user, isPrivate, coworkers, img, title, descr, snippet)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            props.user,
            props.isPrivate,
            props.coworkers,
            props.img,
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
