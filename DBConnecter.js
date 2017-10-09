const knex = require('knex');

let DBConnecter = {
	connect: (host, db, user, pwd) => {
		return knex({
		 	client: 'mysql',
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