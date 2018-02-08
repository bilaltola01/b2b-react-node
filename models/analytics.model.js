"use strict";

const DBLayer = require('../DBLayer');
const db = DBLayer.connection;
const dateUtils = require('../shared/date-utils');


const Profile = require('./profile.model');

// Create new analytic entry in the database
// Returns a resolved Promise containing its id
let Analytics = class {

};

Analytics.create = (obj) => {
  let companyId;
  let analytic = {
    CompanyID: obj.companyId,
    Event: obj.event,
    EventType: obj.type,
    Title: obj.title,
    EventIDType: obj.type + 'ID',
    EventID: obj.id,
    Date: dateUtils.toMysqlDate(new Date()),
  };

  return db('Analytics').insert(analytic).returning('AnalyticsID');
};

/*
{
    event: 'mapRestaurantMenusClick',
    type: 'Branch',
    id: restaurant.BranchID,
    title: restaurant.Name,
}
*/

// Get a Analytic by id
// Returns a Promise
Analytics.getById = (id) => {
  return db('Analytics').where({
    AnalyticsID: id
  }).first('*');
};


// Get an Analytic by conditions object:
// {
//    key: value
// }
// Returns a Promise
Analytics.get = (conditions) => {
  return db('Analytics').where(conditions).select('*');
};

// Get all analytics
// Returns a Promise
Analytics.getAll = () => {
  return db.select('*').from('Analytics');
};

module.exports = Analytics;
