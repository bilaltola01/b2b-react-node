const constants = require('./constants');

var pg = require('pg');
pg.types.setTypeParser(20, 'text', parseInt);
var knex = require('knex')({
 	client: constants.DB_TYPE,
	debug: true,
	connection: (constants.DB_URL === 'localhost') ? {
	    host: constants.DB_URL,
	    user: constants.DB_USER,
	    password: constants.DB_PWD,
	    database: constants.DB_NAME
	} : constants.DATABASE_URL,
	acquireConnectionTimeout: 10000,
	ssl: true,
	//pool: { min: 0, max: 7 }
});

let DBConnecter = class {
	constructor(host, port, db, user, pwd, has_ssl) {
		this.connection = knex;
	}
};

module.exports = DBConnecter;