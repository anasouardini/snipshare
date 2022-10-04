const poolPromise = require('./db');

const userExists = (usr) => {
    const query = `select * from users where user = '${usr}'`;
    return poolPromise(query);
};

const readUser = (usr) => {};

const readAll = () => poolPromise(`select user from users;`);

const createUser = (usr, pass) =>
    poolPromise(`insert into users (user, passwd) values (?, ?)`, [usr, pass]);

const deleteUsers = () => poolPromise(`delete from users where 1=1`);

module.exports = {
    userExists,
    readUser,
    readAll,
    createUser,
    deleteUsers,
};
