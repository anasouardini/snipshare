const poolPromise = require('./db');
const {v4: uuid} = require('uuid');

const add = ({user, type, message, read}) => {
    return poolPromise(
        `INSERT INTO notifications (id, user, type, message, isRead)
        select ?, id, ?, ?, ? from users
        where user=?;`,
        [uuid(), type, message, Number(read), user]
    );
};

const checkUnread = ({user}) => {
    return poolPromise(
        `SELECT n.id, n.type, n.message, n.isRead
         FROM notifications n
         inner join users u on n.user=u.id
         WHERE u.user=? AND isRead=0;`,
        [user]
    );
};

const read = ({user}) => {
    //todo: get only the last 10 ro so
    return poolPromise(
        `SELECT n.id, n.type, n.message, n.isRead FROM notifications n
         inner join users u on n.user=u.id
         WHERE u.user=?
         ORDER BY n.createDate DESC;`,
        [user]
    );
};

const markAllRead = ({user}) => {
    return poolPromise(
        `UPDATE notifications n
         INNER JOIN users u ON n.user=u.id
         SET n.isRead=1
         WHERE u.user=?`,
        [user]
    );
};

module.exports = {add, checkUnread, read, markAllRead};
