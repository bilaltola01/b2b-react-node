const knex = require('knex');
const constants = require('./constants');

let DBConnecter = {
	connect: (host, port, db, user, pwd, has_ssl) => {
		return knex({
		 	client: constants.DB_TYPE,
			connection: (constants.HOST === 'localhost') ? {
		    	host: host || constants.DB_URL,
		    	port: port || constants.DB_PORT,
		    	user: user || constants.DB_USER,
		    	password: pwd || constants.DB_PWD,
		    	database: db || constants.DB_NAME,
		    	ssl: has_ssl || constants.DB_SSL_ENABLED
			} : constants.DB_STRING,
			ssl: has_ssl
		});
	}
};

module.exports = DBConnecter;