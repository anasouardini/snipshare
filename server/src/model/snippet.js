const poolPromise = require('./db');

//todo: specify the number of items from the db in the query
const getAllSnippets = ({title}) => {
    let query = `select * from snippets`;
    if(title != '%undefined%'){
      query += ` WHERE title LIKE ?`
    }
    return poolPromise(query, [title]);
};
const getUserSnippets = ({user, title}) => {
    let query = `select * from snippets where user = ?`;
    if(title != '%undefined%'){
      query += ` AND title LIKE ?`
    }
    return poolPromise(query, [user, title]);
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
