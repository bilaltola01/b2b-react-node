"use strict";

const DBLayer = require('../DBLayer');
const db = new DBLayer().connection;
const dateUtils = require('../shared/date-utils');

const Flag = require('./flag.model');

///////////////////
// TODO: Permissions
// Add a language should only be accessible from OM admins
///////////////////

// Create new language in the database
// Returns a resolved Promise containing its id
let Language = class {

};

Language.create = (obj) => {
  let language = obj;
  language.Date = dateUtils.toMysqlDate(new Date());

  console.log(language);
  return db('Language').insert(language);
};


// Update new language in the database
// Returns a resolved Promise containing the new language
Language.update = (id, obj) => {
  let language = obj;
  language.DateUpdated = dateUtils.toMysqlDate(new Date());

  return Language.getById(id).update(language).then(res => {
    return Language.getById(id);
  });
};

// Get a language by id
// Returns a Promise
Language.getById = (id) => {
  return db('Language').where({
    LanguageID: id
  }).first('*');
};


// Get a language by conditions object:
// {
//    key: value
// }
// Returns a Promise
Language.get = (conditions) => {
  return db('Language').where(conditions).select('*');
};

// Get all languages
// Returns a Promise
Language.getAll = () => {
  return db.select('*').from('Language');
};

Language.getAllWithDetails = () => {
  return Language.getAll().then(languages => {
    return Promise.all(languages.map(lang => {
      return createLanguage(lang, Flag.get({FlagID: lang.FlagID}));
    }));
  });
};

function createLanguage (languageObj, flagsPromise) {
  return new Promise((resolve, reject) => {
    let obj = languageObj;
    flagsPromise.then(flag => {
      obj.Flag = (flag && flag.length > 0) ? flag[0] : {};
      resolve(obj);
    });
  });
}


module.exports = Language;
