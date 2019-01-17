"use strict";

const rp = require('request-promise-native');

const constants = require('../constants');
const DBLayer = require('../DBLayer');
const db = DBLayer.connection;
const dateUtils = require('../shared/date-utils');

let MenuBranch = class {

};

/**
 * @description Insert/Create Menu Branch 
 * @param {obj.MenuId} number Linked to Menu.MenuID
 * @param {obj.BranchID} number Linked to Menu.MenuID
 * @return {QueryBuilder}
 */
MenuBranch.create = (obj) => {
  let menu = obj;
  menu.Date = dateUtils.toMysqlDate(new Date());

  // console.log(menu);
  return db('MenuBranch').insert(menu).returning('MenuID');
};

/**
 * @description Remove Menu Branch 
 * @param {obj.MenuId} number Linked to Menu.MenuID
 * @param {obj.BranchID} number Linked to Menu.MenuID
 * @return {QueryBuilder|Promise<any>}
 */
MenuBranch.remove = (obj) => {
  return db('MenuBranch').where({
    MenuID: obj.MenuID,
    BranchID: obj.BranchID,
  }).first('*').del();
};

/**
 * @description Get All
 * @return {QueryBuilder|Promise<any>}
 */
MenuBranch.getAll = () => {
  return db.select('*').from('MenuBranch');
};

/**
 * @description Get All by BranchId
 * @param {id} Number BranchID
 * @return {QueryBuilder|Promise<any>}
 */
MenuBranch.getAllByBranch = (id) => {
  return db('MenuBranch').where({
    BranchID: id
  });
};

/**
 * @description Get All by MenuID
 * @param {id} Number MenuID
 * @return {QueryBuilder|Promise<any>}
 */
MenuBranch.getAllByMenu = (id) => {
  return db('MenuBranch').where({
      MenuID: id
  });
};
module.exports = MenuBranch;
