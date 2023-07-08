const poolPromise = require('./db');
const vars = require('../vars.js');

const getUser = (user) => poolPromise(`SELECT * FROM users WHERE user=?`, [user]);
const getUserById = (id) => poolPromise(`SELECT * FROM users WHERE id=?`, [id]);

const getMod = (user) => poolPromise(`SELECT * FROM mods WHERE user=?`, [user]);

const readAll = () => poolPromise(`SELECT user FROM users;`);

const createUser = ({ id, usr, pass }) =>
    poolPromise(`INSERT INTO users (id, user, passwd, avatar, descr) VALUES (?, ?, ?, ?, ?)`,
        [id, usr, pass, `${vars.serverAddress}/media/avatars/default.png`, `Hi, my name is ${usr}`]);

const deleteUser = (user) => poolPromise(`DELETE FROM users WHERE user=?`, [user]);

const editUser = (user, { newUsername, newDescription, newAvatar }) => {
    if (newUsername) {
        return poolPromise(`update users set user=? where user=?`, [
            newUsername,
            user,
        ]);
    } else if (newDescription) {
        return poolPromise(`update users set descr=? where user=?`, [
            newDescription,
            user,
        ]);
    } else if (newAvatar) {
        return poolPromise(`update users set avatar=? where user=?`, [
            newAvatar,
            user,
        ]);
    }
};

module.exports = {
    readAll,
    getUser,
    getUserById,
    getMod,
    createUser,
    deleteUser,
    editUser,
};
