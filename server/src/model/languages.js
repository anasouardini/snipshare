const poolPromise = require('./db');

const getAllLanguages = () => {
    const query = `select name from languages`;
    return poolPromise(query, []);
};

module.exports = {getAllLanguages};
