"use strict";

const rp = require('request-promise-native');

const DBLayer = require('../DBLayer');
const db = new DBLayer().connection;
const dateUtils = require('../shared/date-utils');

const SANDBOX_TOKEN = 'ACE563CA-FF89-4C7D-8DDF-35B5F11CFA21';
const TRANSLATION_ENV = 'sandbox';
const TRANSLATION_URL = 'https://' + TRANSLATION_ENV + '.strakertranslations.com/v3/translate';

// Create new meal in the database
// Returns a resolved Promise containing its id
let MealTranslation = class {

};

MealTranslation.create = (obj) => {
  let meal = {
    title: obj.title,
    sl: obj.sl,
    tl: obj.tl,
    payload: obj.payload
  };

  console.log(meal);

  // Send a req to the Staker server to translate
  const options = {
    method: 'POST',
    uri: TRANSLATION_URL + '/text',
    body: meal,
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
      MealID: obj.mealId,
      PropKey: obj.key,
      Title: meal.title,
      JobNumber: res.job_key,
      WordCount: parseInt(res.wordcount, 10),
      BranchLanguageName: meal.tl,
      Status: 'PENDING',
      OriginalText: meal.payload,
      Date: dateUtils.toMysqlDate(new Date())
    };

    return db('MealTranslation').insert(dbObj);
  }).catch((err) => {
    console.error(err);
  });
};


// Update new meal in the database
// Returns a resolved Promise containing the new language
MealTranslation.update = (id, obj) => {
  let meal = obj;
  meal.DateUpdated = dateUtils.toMysqlDate(new Date());

  return MealTranslation.getById(id).update(meal).then(res => {
    return MealTranslation.getById(id);
  });
};

// Remove meal in the database
// Returns a resolved Promise containing the number of rows affected
MealTranslation.remove = (id) => {
  return db('MealTranslation').where({
    MealTranslationID: id
  }).first('*').del();
};

// Get a meal by id
// Returns a Promise
MealTranslation.getById = (id) => {
  return db('MealTranslation').where({
    MealTranslationID: id
  }).first('*');
};


// Get a menu by conditions object:
// {
//    key: value
// }
// Returns a Promise
MealTranslation.get = (conditions) => {
  return db('MealTranslation').where(conditions).select('*');
};

// Get all meals
// Returns a Promise
MealTranslation.getAll = () => {
  return db.select('*').from('MealTranslation');
};

// Get all meals per MenuCategory
// Returns a Promise
MealTranslation.getAllByBranch = (id) => {
  return db('MealTranslation').where({
    MealTranslationID: id
  });
};


module.exports = MealTranslation;
