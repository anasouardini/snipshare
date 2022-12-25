const poolPromise = require('./db');

const getAllCategories = ()=>{

    const query = `select name from categories`;
    return poolPromise(query, [])
}

module.exports = {getAllCategories}
