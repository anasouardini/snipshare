const mysql2 = require('mysql2');

require('dotenv').config();

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

const poolPromise = (query, params) =>
  pool
    .promise()
    .query(query, params)
    .then((res) => res)
    .catch((err) => ({ err }));

module.exports = poolPromise;
