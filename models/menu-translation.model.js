"use strict";

const rp = require('request-promise-native');

const DBLayer = require('../DBLayer');
const db = new DBLayer().connection;
const dateUtils = require('../shared/date-utils');

const SANDBOX_TOKEN = 'ACE563CA-FF89-4C7D-8DDF-35B5F11CFA21';
const TRANSLATION_ENV = 'sandbox';
const TRANSLATION_URL = 'https://' + TRANSLATION_ENV + '.strakertranslations.com/v3/translate';

///////////////////
// TODO: Menu
// Add a menu should only be accessible from OM admins
///////////////////

// Create new menu in the database
// Returns a resolved Promise containing its id
let MenuTranslation = class {

};

MenuTranslation.create = (obj) => {
  let menu = {
    title: obj.title,
    sl: obj.sl,
    tl: obj.tl,
    payload: obj.payload
  };

  console.log(menu);

  // Send a req to the Staker server to translate
  const options = {
    method: 'POST',
    uri: TRANSLATION_URL + '/text',
    body: menu,
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
      MenuID: obj.menuId,
      PropKey: obj.key,
      Title: menu.title,
      JobNumber: res.job_key,
      WordCount: parseInt(res.wordcount, 10),
      BranchLanguageName: menu.tl,
      Status: 'PENDING',
      OriginalText: menu.payload,
      Date: dateUtils.toMysqlDate(new Date())
    };

    return db('MenuTranslation').insert(dbObj);
  }).catch((err) => {
    console.error(err);
  });
};


// Update new menu in the database
// Returns a resolved Promise containing the new language
MenuTranslation.update = (id, obj) => {
  let menu = obj;
  menu.DateUpdated = dateUtils.toMysqlDate(new Date());

  return MenuTranslation.getById(id).update(menu).then(res => {
    return MenuTranslation.getById(id);
  });
};

// Remove menu in the database
// Returns a resolved Promise containing the number of rows affected
MenuTranslation.remove = (id) => {
  return db('MenuTranslation').where({
    MenuTranslationID: id
  }).first('*').del();
};

// Get a menu by id
// Returns a Promise
MenuTranslation.getById = (id) => {
  return db('MenuTranslation').where({
    MenuTranslationID: id
  }).first('*');
};


// Get a menu by conditions object:
// {
//    key: value
// }
// Returns a Promise
MenuTranslation.get = (conditions) => {
  return db('MenuTranslation').where(conditions).select('*');
};

// Get all menus
// Returns a Promise
MenuTranslation.getAll = () => {
  return db.select('*').from('MenuTranslation');
};



module.exports = MenuTranslation;
