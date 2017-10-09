"use strict";

const DBLayer = require('../DBLayer');
const db = new DBLayer().connection;
const dateUtils = require('../shared/date-utils');

// Create new category in the database
// Returns a resolved Promise containing its id
let MenuCategory = class {

};

MenuCategory.create = (obj) => {
  let category = obj;
  category.Date = dateUtils.toMysqlDate(new Date());

  console.log(category);
  return db('MenuCategory').insert(category);
};


// Update new catgory in the database
// Returns a resolved Promise containing the new language
MenuCategory.update = (id, obj) => {
  let category = obj;
  category.DateUpdated = dateUtils.toMysqlDate(new Date());

  return MenuCategory.getById(id).update(category).then(res => {
    return MenuCategory.getById(id);
  });
};

// Remove category in the database
// Returns a resolved Promise containing the number of rows affected
MenuCategory.remove = (id) => {
  return db('MenuCategory').where({
    MenuCategoryID: id
  }).first('*').del();
};

// Get a category by id
// Returns a Promise
MenuCategory.getById = (id) => {
  return db('MenuCategory').where({
    MenuCategoryID: id
  }).first('*');
};


// Get a category by conditions object:
// {
//    key: value
// }
// Returns a Promise
MenuCategory.get = (conditions) => {
  return db('MenuCategory').where(conditions).select('*');
};

// Get all categories
// Returns a Promise
MenuCategory.getAll = () => {
  return db.select('*').from('MenuCategory');
};

// Get all categories per branchID
// Returns a Promise
MenuCategory.getAllByBranch = (id) => {
  return db('MenuCategory').where({
    MenuCategoryID: id
  });
};


module.exports = MenuCategory;
