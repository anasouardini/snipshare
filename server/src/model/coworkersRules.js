const poolPromise = require('./db');

const readAllRules = (coworker) => {
    const query = `select * from coworkersRules where coworker = '${coworker}'`;
    return poolPromise(query);
};

const readUserRules = (owner, coworker) => {
    const query = `select * from coworkersRules where user = '${owner}' and coworker = '${coworker}'`;
    return poolPromise(query);
};

module.exports = {
    readAllRules,
    readUserRules,
};
