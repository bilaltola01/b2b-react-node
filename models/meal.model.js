"use strict";

const DBLayer = require('../DBLayer');
const db = DBLayer.connection;
const dateUtils = require('../shared/date-utils');


// Create new meal in the database
// Returns a resolved Promise containing its id
let Meal = class {

};

Meal.create = (obj) => {
  let meal = obj;
  meal.Date = dateUtils.toMysqlDate(new Date());

  console.log(meal);
  return db('Meal').insert(meal);
};


// Update new meal in the database
// Returns a resolved Promise containing the new language
Meal.update = (id, obj) => {
  let meal = obj;
  meal.DateUpdated = dateUtils.toMysqlDate(new Date());

  return Meal.getById(id).update(meal).then(res => {
    return Meal.getById(id);
  });
};

// Remove meal in the database
// Returns a resolved Promise containing the number of rows affected
Meal.remove = (id) => {
  return db('Meal').where({
    MealID: id
  }).first('*').del();
};

// Get a meal by id
// Returns a Promise
Meal.getById = (id) => {
  return db('Meal').where({
    MealID: id
  }).first('*');
};


// Get a menu by conditions object:
// {
//    key: value
// }
// Returns a Promise
Meal.get = (conditions) => {
  return db('Meal').where(conditions).select('*');
};

// Get all meals
// Returns a Promise
Meal.getAll = () => {
  return db.select('*').from('Meal');
};

// Get all meals per MenuCategory
// Returns a Promise
Meal.getAllByBranch = (id) => {
  return db('Meal').where({
    MenuCategoryID: id
  });
};


module.exports = Meal;
