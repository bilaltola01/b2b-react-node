const knex = require('knex');
const constants = require('./constants');

let DBConnecter = {
	connect: (host, db, user, pwd) => {
		return knex({
		 	client: constants.DB_TYPE,
			connection: {
		    	host: host,
		    	user: user,
		    	password: pwd,
		    	database: db
			}
		});
	}
};

module.exports = DBConnecter;