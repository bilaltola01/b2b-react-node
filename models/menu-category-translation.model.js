"use strict";

const rp = require('request-promise-native');

const DBLayer = require('../DBLayer');
const db = new DBLayer().connection;
const dateUtils = require('../shared/date-utils');

const SANDBOX_TOKEN = 'ACE563CA-FF89-4C7D-8DDF-35B5F11CFA21';
const TRANSLATION_ENV = 'sandbox';
const TRANSLATION_URL = 'https://' + TRANSLATION_ENV + '.strakertranslations.com/v3/translate';

// Create new category in the database
// Returns a resolved Promise containing its id
let MenuCategoryTranslation = class {

};

MenuCategoryTranslation.create = (obj) => {
  let category = {
    title: obj.title,
    sl: obj.sl,
    tl: obj.tl,
    payload: obj.payload
  };

  console.log(category);

  // Send a req to the Staker server to translate
  const options = {
    method: 'POST',
    uri: TRANSLATION_URL + '/text',
    body: category,
    json: true,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Authorization": "Bearer " + SANDBOX_TOKEN
    }
  };

  return rp(options).then((res) => {
    console.log(res);

    if (!res || !res.success) {
      return Promise.reject(res);
    }

    // If successful, update the db entry with the translation PENDING
    let dbObj = {
      MenuCategoryID: obj.categoryId,
      PropKey: obj.key,
      Title: category.title,
      JobNumber: res.job_key,
      WordCount: parseInt(res.wordcount, 10),
      BranchLanguageName: category.tl,
      Status: 'PENDING',
      OriginalText: category.payload,
      Date: dateUtils.toMysqlDate(new Date())
    };

    return db('MenuCategoryTranslation').insert(dbObj);
  }).catch((err) => {
    console.error(err);
  });
};


// Update new catgory in the database
// Returns a resolved Promise containing the new language
MenuCategoryTranslation.update = (id, obj) => {
  let category = obj;
  category.DateUpdated = dateUtils.toMysqlDate(new Date());

  return MenuCategoryTranslation.getById(id).update(category).then(res => {
    return MenuCategoryTranslation.getById(id);
  });
};

// Remove category in the database
// Returns a resolved Promise containing the number of rows affected
MenuCategoryTranslation.remove = (id) => {
  return db('MenuCategoryTranslation').where({
    MenuCategoryTranslationID: id
  }).first('*').del();
};

// Get a category by id
// Returns a Promise
MenuCategoryTranslation.getById = (id) => {
  return db('MenuCategoryTranslation').where({
    MenuCategoryTranslationID: id
  }).first('*');
};


// Get a category by conditions object:
// {
//    key: value
// }
// Returns a Promise
MenuCategoryTranslation.get = (conditions) => {
  return db('MenuCategoryTranslation').where(conditions).select('*');
};

// Get all categories
// Returns a Promise
MenuCategoryTranslation.getAll = () => {
  return db.select('*').from('MenuCategoryTranslation');
};

// Get all categories per branchID
// Returns a Promise
MenuCategoryTranslation.getAllByBranch = (id) => {
  return db('MenuCategoryTranslation').where({
    MenuCategoryTranslationID: id
  });
};


module.exports = MenuCategoryTranslation;
