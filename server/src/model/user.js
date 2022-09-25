const pool = require('./db');

const userExists = (username) => {
	const query = `SELECT FROM users WHERE user = ${username}`;
	return pool
		.execute(query)
		.then((res) => res)
		.catch((err) => err);
};

module.exports = {
	userExists,
};
