const poolPromise = require('./db');

const getUser = (usr) => poolPromise(`select * from users where user = ?`, [usr]);

const getMod = (usr) => poolPromise(`select * from mods where user = ?`, [usr]);

const readAll = () => poolPromise(`select user from users;`);

const createUser = (usr, pass) =>
    poolPromise(`insert into users (user, passwd) values (?, ?)`, [usr, pass]);

const deleteUsers = () => poolPromise(`delete from users where 1=1`);

module.exports = {
    readAll,
    getUser,
    getMod,
};
