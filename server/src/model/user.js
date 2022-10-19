const poolPromise = require('./db');

const getUser = (usr) => poolPromise(`select * from users where user = ?`, [usr]);

const getMod = (usr) => poolPromise(`select * from mods where user = ?`, [usr]);

const readAll = () => poolPromise(`select user from users;`);

const createUser = (usr, pass) =>
    poolPromise(`insert into users (user, passwd) values (?, ?)`, [usr, pass]);

const deleteUser = (usr) => poolPromise(`delete from users where user=?`, [usr]);

module.exports = {
    readAll,
    getUser,
    getMod,
    createUser,
    deleteUser,
};
