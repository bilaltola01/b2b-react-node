"use strict";
const db_util = require('./DBConnecter');
const constants = require('./constants');

const shared = require('./shared/handlers');

let DBLayer = class {
    constructor() {
        this.util = db_util;
        // Connect to the Database
        this.connection = null;
        if (!this.connection) {
            this.connection = this.util.connect();
        }
    }
};

module.exports = DBLayer;