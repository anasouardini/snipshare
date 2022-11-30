const poolPromise = require('./db');

const getUser = (user) => poolPromise(`SELECT * FROM users WHERE user=?`, [user]);
const getUserById = (id) => poolPromise(`SELECT * FROM users WHERE id=?`, [id]);

const getMod = (user) => poolPromise(`SELECT * FROM mods WHERE user=?`, [user]);

const readAll = () => poolPromise(`SELECT user FROM users;`);

const createUser = ({id, user, pass}) =>
    poolPromise(`INSERT INTO users (id, user, passwd) VALUES (?, ?, ?)`, [id, user, pass]);

const deleteUser = (user) => poolPromise(`DELETE FROM users WHERE user=?`, [user]);

const editUser = (user, {newUsername, newDescription, newAvatar}) => {
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
