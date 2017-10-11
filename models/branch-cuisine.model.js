"use strict";

const DBLayer = require('../DBLayer');
const db = DBLayer.connection;
const dateUtils = require('../shared/date-utils');

const Cuisine = require('./cuisine.model');

// Create new cuisine language in the database
// Returns a resolved Promise containing its id
let BranchCuisine = class {

};

BranchCuisine.create = (obj) => {
  let cuisine = obj;
  cuisine.Date = dateUtils.toMysqlDate(new Date());

  console.log(cuisine);
  return db('BranchCuisine').insert(cuisine);
};

BranchCuisine.createAll = (cuisines) => {
  if (!cuisines || cuisines.length <= 0) {
    console.error('No cuisines specified');
    return Promise.resolve([]);
  }

  return Promise.all(cuisines.map(cuisine => {
    return BranchCuisine.create({
      BranchID: cuisine.BranchID,
      CuisineID: cuisine.CuisineID
    });
  }));
};


// Update cuisine in the database
// Returns a resolved Promise containing the new cuisine
BranchCuisine.update = (id, obj) => {
  let cuisine = obj;
  cuisine.DateUpdated = dateUtils.toMysqlDate(new Date());

  return BranchCuisine.getById(id).update(cuisine).then(res => {
    return BranchCuisine.getById(id);
  });
};

BranchCuisine.updateAll = (cuisines) => {
  if (!cuisines || cuisines.length <= 0) {
    return Promise.reject('No cuisines specified');
  }

  return Promise.all(cuisines.map(cuisine => {
    return BranchCuisine.update(cuisine.BranchCuisineID, {
      BranchID: cuisine.BranchID,
      CuisineID: cuisine.CuisineID
    });
  }));
};



// Remove cuisine in the database
// Returns a resolved Promise containing the number of rows affected
BranchCuisine.remove = (id) => {
  return db('BranchCuisine').where({
    BranchCuisineID: id
  }).first('*').del();
};

// Get a cuisine by id
// Returns a Promise
BranchCuisine.getById = (id) => {
  return db('BranchCuisine').where({
    BranchCuisineID: id
  }).first('*');
};


// Get a cuisine by conditions object:
// {
//    key: value
// }
// Returns a Promise
BranchCuisine.get = (conditions) => {
  return db('BranchCuisine').where(conditions).select('*');
};

BranchCuisine.getWithDetails = (conditions) => {
  return db('BranchCuisine').where(conditions).select('*').then(branchCuisines => {
    if (!branchCuisines || branchCuisines.length <= 0) {
      return Promise.resolve(branchCuisines);
    }

    return Promise.all(branchCuisines.map(branchCuisine => {
      return createBranchCuisine(branchCuisine, Cuisine.get({CuisineID: branchCuisine.CuisineID}));
    }));
  });
};

// Get all cuisines
// Returns a Promise
BranchCuisine.getAll = () => {
  return db.select('*').from('BranchCuisine');
};

function createBranchCuisine (branchCuisine, cuisinePromise) {
  return new Promise((resolve, reject) => {
    cuisinePromise.then(cuisine => {
      let obj = branchCuisine;
      obj.Cuisine = cuisine[0];
      resolve(obj);
    }).catch(err => {
      reject(err);
    });
  });
}


module.exports = BranchCuisine;
