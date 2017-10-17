"use strict";

const DBLayer = require('../DBLayer');
const db = DBLayer.connection;
const dateUtils = require('../shared/date-utils');

const Language = require('./language.model');

// Create new branch language in the database
// Returns a resolved Promise containing its id
let BranchLanguage = class {

};

BranchLanguage.create = (obj) => {
  let language = obj;
  language.Date = dateUtils.toMysqlDate(new Date());

  console.log(language);
  return db('BranchLanguage').insert(language).returning('BranchLanguageID');
};

BranchLanguage.createAll = (languages) => {
  if (!languages || languages.length <= 0) {
    console.error('No languages specified');
    return Promise.resolve([]);
  }

  return Promise.all(languages.map(language => {
    return BranchLanguage.create({
      BranchID: language.BranchID,
      LanguageID: language.LanguageID
    });
  }));
};


// Update language in the database
// Returns a resolved Promise containing the new language
BranchLanguage.update = (id, obj) => {
  let language = obj;
  language.DateUpdated = dateUtils.toMysqlDate(new Date());

  return BranchLanguage.getById(id).update(language).then(res => {
    return BranchLanguage.getById(id);
  });
};

BranchLanguage.updateAll = (languages) => {
  if (!languages || languages.length <= 0) {
    return Promise.reject('No languages specified');
  }

  return Promise.all(languages.map(language => {
    return BranchLanguage.update(language.BranchLanguageID, {
      BranchID: language.BranchID,
      LanguageID: language.LanguageID
    });
  }));
}


// Remove language in the database
// Returns a resolved Promise containing the number of rows affected
BranchLanguage.remove = (id) => {
  return db('BranchLanguage').where({
    BranchLanguageID: id
  }).first('*').del();
};

// Get a language by id
// Returns a Promise
BranchLanguage.getById = (id) => {
  return db('BranchLanguage').where({
    BranchLanguageID: id
  }).first('*');
};


// Get a language by conditions object:
// {
//    key: value
// }
// Returns a Promise
BranchLanguage.get = (conditions) => {
  return db('BranchLanguage').where(conditions).select('*');
};

BranchLanguage.getWithDetails = (conditions) => {
  return db('BranchLanguage').where(conditions).select('*').then(branchLanguages => {
    if (!branchLanguages || branchLanguages.length <= 0) {
      return Promise.resolve(branchLanguages);
    }

    return Promise.all(branchLanguages.map(branchLanguage => {
      return createBranchLanguage(branchLanguage, Language.get({LanguageID: branchLanguage.LanguageID}));
    }));
  });
};

// Get all languages
// Returns a Promise
BranchLanguage.getAll = () => {
  return db.select('*').from('BranchLanguage');
};

function createBranchLanguage (branchLanguage, languagePromise) {
  return new Promise((resolve, reject) => {
    languagePromise.then(lang => {
      let obj = branchLanguage;
      obj.Language = lang[0];
      resolve(obj);
    }).catch(err => {
      reject(err);
    });
  });
}


module.exports = BranchLanguage;
