"use strict";

const DBLayer = require('../DBLayer');
const db = DBLayer.connection;
const dateUtils = require('../shared/date-utils');

const MenuTranslation = require('./menu-translation.model');
const MealTranslation = require('./meal-translation.model');
const MenuCategoryTranslation = require('./menu-category-translation.model');

// Update translation status in the database
// Returns a resolved Promise containing its id
let TranslationCallback = class {

};

TranslationCallback.create = (query, obj) => {
  let job = obj[0];
  let type = query ? query.type : '';

  console.log(job);
  console.log(type);

  return update(type, job);
};

function update (type, job) {
  switch (type) {
    case 'meal':
      return updateObjectTranslation(MealTranslation, 'MealTranslationID',job);
    case 'menucategory':
      return updateObjectTranslation(MenuCategoryTranslation, 'MenuCategoryTranslationID', job);
    case 'menu':
      return updateObjectTranslation(MenuTranslation, 'MenuTranslationID', job);
    default:
      return updateObjectTranslation(MenuTranslation, 'MenuTranslationID', job);
  }
}

function updateObjectTranslation (component, idStr, job) {
  return component.get({
    JobNumber: job.job_key
  }).then(translation => {
    return updateTranslation(translation[0], component, idStr, job);
  }).catch((err) => {
    console.error(err);
  });
}

function updateTranslation (translation, component, idStr, job) {
  // If successful, update the db entry with the translation PENDING
  let id = translation[idStr];
  let dbObj = {
    Status: job.status,
    JobNumber: job.job_key
  };

  if (job.wordcount) {
    dbObj.WordCount = job.wordcount;
  }

  if (job.translation_type === 'text') {
    if (job.translated_text && job.translated_text.length > 0 && job.translated_text[0].translation) {
      dbObj.Text = job.translated_text[0].translation;
    }
  }

  if (job.translation_type === 'file') {
    if (job.translated_file && job.translated_file.length > 0 && job.translated_file[0].download_url) {
      dbObj.Url = job.translated_file[0].download_url;
    }
  }

  return component.update(id, dbObj);
}

module.exports = TranslationCallback;
