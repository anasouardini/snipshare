const poolPromise = require('./db');

const getAllSnippets = () => {
    let query = `select * from snippets`;
    // if (title) query += ` title=?`;

    return poolPromise(query);
};
const getUserSnippets = ({user}) => {
    let query = `select * from snippets where user = ?`;
    // if (title) query += ` title=?`;
    return poolPromise(query, [user]);
};
const getSnippet = (usr, snipID) => {
    let query = `select * from snippets where user=? and id=?`;
    return poolPromise(query, [usr, snipID]);
};

const deleteSnippet = (usr, snipID) =>
    poolPromise(`delete from snippets where user = ? and id = ?`, [usr, snipID]);

const createSnippet = (props) => {
    // console.log(props);
    return poolPromise(
        `INSERT INTO
        snippets (id, user, isPrivate, title, descr, snippet, author)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            props.id,
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
