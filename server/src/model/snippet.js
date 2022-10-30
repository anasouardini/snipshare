const {v4: uuid} = require('uuid');
const poolPromise = require('./db');

const getAllSnippets = () => {
    return poolPromise(`select * from snippets;`);
};
const getUserSnippets = (usr) => {
    return poolPromise(`select * from snippets where user = ?`, [usr]);
};
const getSnippet = (usr, snipID) =>
    poolPromise(`select * from snippets where user = ? and id = ?`, [usr, snipID]);

const deleteSnippet = (usr, snipID) =>
    poolPromise(`delete from snippets where user = ? and id = ?`, [usr, snipID]);

const createSnippet = (props) => {
    console.log(props);
    return poolPromise(
        `INSERT INTO
        snippets (id, user, isPrivate, title, descr, snippet, author)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            uuid(),
            props.owner,
            Number(props.isPrivate),
            props.title,
            props.descr,
            props.snippet,
            props.author,
        ]
    );
};
const editSnippet = (owner, props, snippetID) =>
    poolPromise(
        `UPDATE
            snippets SET title=?, descr=?, snippet=?, isPrivate=?
            WHERE user=? AND id=?;`,
        [props.title, props.descr, props.snippet, Number(props.isPrivate), owner, snippetID]
    );

module.exports = {
    getAllSnippets,
    getUserSnippets,
    getSnippet,
    createSnippet,
    deleteSnippet,
    editSnippet,
};
