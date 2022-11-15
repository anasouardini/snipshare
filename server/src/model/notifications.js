const poolPromise = require('./db');
const {v4: uuid} = require('uuid');

const add = ({user, type, message, read}) => {
    return poolPromise(
        `INSERT INTO notifications (id, user, type, message, isRead)
        VALUES (?, ?, ?, ?, ?)`,
        [uuid(), user, type, message, Number(read)]
    );
};

const read = ({user}) => {
    //todo: get only the last 10 ro so
    return poolPromise(`SELECT message FROM notifications WHERE user=?;`, [user]);
};

module.exports = {add, read};
