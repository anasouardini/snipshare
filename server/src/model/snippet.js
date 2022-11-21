const poolPromise = require('./db');

//todo: specify the number of items from the db in the query
const getAllSnippets = ({title}) => {
  // console.log(title)
    let query = `SELECT s.*, u.user AS user, uu.user AS author
                FROM snippets s
                INNER JOIN users u ON s.user=u.id
                INNER JOIN users uu ON s.author=uu.id`;
    if (title != '%undefined%') {
        query += ` WHERE s.title LIKE ?`;
    }
    return poolPromise(query, [title]);
};
const getUserSnippets = ({user, title}) => {
    let query = `SELECT s.*, u.user AS user, uu.user AS author
                FROM snippets s
                INNER JOIN users u ON s.user=u.id
                INNER JOIN users uu ON s.author=uu.id
                WHERE u.user = ?`;
    if (title != '%undefined%') {
        query += ` AND s.title LIKE ?`;
    }
    return poolPromise(query, [user, title]);
};

// individual snippet
const getSnippet = (user, snipID) => {
    let query = `SELECT s.*, u.user AS user, uu.user AS author
                FROM snippets s 
                INNER JOIN users u ON s.user=u.id
                INNER JOIN users uu ON s.author=uu.id
                WHERE u.user=? AND s.id=?`;
    return poolPromise(query, [user, snipID]);
};

const deleteSnippet = (user, snipID) =>
    poolPromise(
        `DELETE FROM snippets WHERE user IN (SELECT id FROM users WHERE user=?) AND id=?`,
        [user, snipID]
    );

const createSnippet = (props) => {
    return poolPromise(
        `INSERT INTO
        snippets (id, user, isPrivate, title, descr, snippet, author)
        SELECT ?, u.id, ?, ?, ?, ?, uu.id
        FROM users u
        INNER JOIN users uu ON u.user=? AND uu.user=?
        `,
        [
            props.id,
            Number(props.isPrivate),
            props.title,
            props.descr,
            props.snippet,
            props.owner,
            props.author,
        ]
    );
};
const editSnippet = (owner, props, snippetID) =>
    poolPromise(
        `UPDATE
            snippets SET title=?, descr=?, snippet=?, isPrivate=?
              WHERE user IN (SELECT id FROM users WHERE user=?) AND id=?;`,
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
