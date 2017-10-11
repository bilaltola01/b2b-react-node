const constants = require('./constants');

let DBConnecter = class {
	constructor(host, port, db, user, pwd, has_ssl) {
		this.connection = require('knex')({
		 	client: constants.DB_TYPE,
			debug: true,
			connection: (constants.DB_URL === 'localhost') ? {
			    host: constants.DB_URL,
			    user: constants.DB_USER,
			    password: constants.DB_PWD,
			    database: constants.DB_NAME
			} : process.env.DATABASE_URL,
	  		acquireConnectionTimeout: 10000,
			ssl: has_ssl,
			//pool: { min: 0, max: 7 }
		});
	}
};

module.exports = DBConnecter;