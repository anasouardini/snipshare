const poolPromise = require('./db');

const getUser = (usr) => poolPromise(`SELECT * FROM users WHERE user = ?`, [usr]);

const getMod = (usr) => poolPromise(`SELECT * FROM mods WHERE user = ?`, [usr]);

const readAll = () => poolPromise(`SELECT user FROM users;`);

const createUser = (usr, pass) =>
    poolPromise(`INSERT INTO users (user, passwd) VALUES (?, ?)`, [usr, pass]);

const deleteUser = (usr) => poolPromise(`DELETE FROM users WHERE user=?`, [usr]);

module.exports = {
    readAll,
    getUser,
    getMod,
    createUser,
    deleteUser,
};
