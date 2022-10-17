const poolPromise = require('./db');

const readAllRules = (props) => {
    if (props.coworker) {
        return poolPromise(`select * from coworkersRules where coworker = ?`, [props.coworker]);
    }

    if (props.owner) {
        return poolPromise(`select * from coworkersRules where user = ?`, [props.owner]);
    }
};

const readCoworkerRules = (owner, coworker) => {
    return poolPromise(`select * from coworkersRules where user = ? and coworker = ?`, [
        owner,
        coworker,
    ]);
};

const create = (owner, rulesObj) => {
    return poolPromise(
        `insert into coworkersRules (user, coworker, generic, exceptions) values (?, ?, ?, ?);`,
        [
            owner,
            rulesObj.coworker,
            JSON.stringify(rulesObj.generic),
            JSON.stringify(rulesObj.exceptions),
        ]
    );
};

const update = (owner, rulesObj) => {
    return poolPromise(
        `update coworkersRules set generic=?, exceptions=? where coworker = ? and user = ?`,
        [
            JSON.stringify(rulesObj.generic),
            JSON.stringify(rulesObj.exceptions),
            rulesObj.coworker,
            owner,
        ]
    );
};

const remove = (owner, rulesObj) => {
    return poolPromise(`delete from coworkersRules where coworker = ? and user = ?`, [
        rulesObj.coworker,
        owner,
    ]);
};

module.exports = {
    readAllRules,
    readCoworkerRules,
    create,
    update,
    remove,
};
