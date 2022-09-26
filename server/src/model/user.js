const pool = require('./db');

const userExists = (usr) => {
	const query = `select * from users where user = '${usr}'`;
	return pool
		.execute(query)
		.then((res) => res)
		.catch((err) => err);
};

const createUser = (usr, pass) => {
	const query = `insert into users (user, passwd) values ('${usr}', '${pass}')`;
	return pool
		.execute(query)
		.then((res) => res)
		.catch((err) => err);
};

const deleteUsers = () => {
	const query = `delete from users where 1=1`;
	return pool
		.execute(query)
		.then((res) => res)
		.catch((err) => err);
};

module.exports = {
	userExists,
	createUser,
	deleteUsers,
};
