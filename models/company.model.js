"use strict";

const DBLayer = require('../DBLayer');
const constants = require('../constants');
//const db = DBLayer.connection;
const cryptUtils = require('../shared/crypt-utils');
const dateUtils = require('../shared/date-utils');

var db = require('knex')({
  client: constants.DB_TYPE,
  debug: true,
  connection: {
      host: constants.DB_URL,
      user: constants.DB_USER,
      password: constants.DB_PWD,
      database: constants.DB_NAME
  },
  //acquireConnectionTimeout: 10000,
  //ssl: has_ssl,
  //pool: { min: 0, max: 7 }
});

// Create new company in the database
// Returns a resolved Promise containing its id
let Company = class {

};

Company.create = (obj) => {
  let company = obj;
  company.Date = dateUtils.toMysqlDate(new Date());

  return cryptUtils.generateHash(obj.Pwd).then(res => {
    company.Pwd = res;
    console.log(company);
    return db('Company').insert(company);
  });
};

// Update new company in the database
// Returns a resolved Promise containing the new company
Company.update = (id, obj) => {
  let company = obj;
  company.DateUpdated = dateUtils.toMysqlDate(new Date());

  return Company.getById(id).update(company).then(res => {
    return Company.getById(id);
  });
};

// Get a company by id
// Returns a Promise
Company.getById = (id) => {
  return db('Company').where({
    CompanyID: id
  }).first('CompanyID',
    'Name',
    'Website',
    'Email',
    'Description',
    'LogoPath',
    'LogoAltDesc',
    'Tel',
    'Twitter',
    'Facebook',
    'Youtube',
    'Instagram'
  );
};

// Get a company by email
// Returns a Promise
Company.getByEmail = (email) => {
  return db('Company').where({
    Email: email
  }).first('CompanyID',
    'Name',
    'Website',
    'Email',
    'Description',
    'LogoPath',
    'LogoAltDesc',
    'Tel',
    'Twitter',
    'Facebook',
    'Youtube',
    'Instagram'
  );
};

Company.getByEmailPwd = (email) => {
  return db('Company').where({
    Email: email
  }).first('CompanyID', 'Name', 'Website', 'Email', 'Pwd');
};

Company.emailExists = (email) => {
  return db('Company').where({
    Email: email
  }).first('CompanyID', 'Name', 'Website', 'Email').then(company => { return !!company; });
};

// Get a company by conditions object:
// {
//    key: value
// }
// Returns a Promise
Company.get = (conditions) => {
  return db('Company').where(conditions).select(
    'CompanyID',
    'Name',
    'Website',
    'Email',
    'Description',
    'LogoPath',
    'LogoAltDesc',
    'Tel',
    'Twitter',
    'Facebook',
    'Youtube',
    'Instagram'
  );
};

// Get all companies
// Returns a Promise
Company.getAll = () => {
  return db.select(
    'CompanyID',
    'Name',
    'Website',
    'Email',
    'Description',
    'LogoPath',
    'LogoAltDesc',
    'Tel',
    'Twitter',
    'Facebook',
    'Youtube',
    'Instagram'
  ).from('Company');
};

// Authenticate a company
// Returns a Promise containing the result of the comparison
Company.auth = (email, pwd) => {
  return Company.getByEmailPwd(email).then(company => {
    return cryptUtils.checkPwd(pwd, company.Pwd);
  });
};

module.exports = Company;
