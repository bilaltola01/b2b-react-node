const constants = require('./constants');

let DBConnecter = class {
	constructor(host, port, db, user, pwd, has_ssl) {
		this.connection = require('knex')({
		 	client: constants.DB_TYPE,
		 	debug: true,
			connection: {
		    	host: host || constants.DB_URL,
		    	port: port || constants.DB_PORT,
		    	user: user || constants.DB_USER,
		    	password: pwd || constants.DB_PWD,
		    	database: db || constants.DB_NAME
			},
			//acquireConnectionTimeout: 10000,
			//ssl: has_ssl,
			//pool: { min: 0, max: 7 }
		});
	}
};

module.exports = DBConnecter;