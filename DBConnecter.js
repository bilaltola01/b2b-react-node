const knex = require('knex');
const constants = require('./constants');

let DBConnecter = {
	connect: (host, db, user, pwd) => {
		return knex({
		 	client: constants.DB_TYPE,
			connection: {
		    	host: host || constants.DB_URL,
		    	user: user || constants.DB_USER,
		    	password: pwd || constants.DB_PWD,
		    	database: db || constants.DB_NAME
			}
		});
	}
};

module.exports = DBConnecter;