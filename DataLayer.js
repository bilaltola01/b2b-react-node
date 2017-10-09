"use strict";
const db_util = require('./DBConnecter');
const constants = require('../constants');

const shared = require('./shared/handlers');

class DatabaseLayer {
    constructor() {
        this.db_util = db_util;
        this.init(constants.DB_URL);
    }
    //
    /** Initialise Database layer */
    //
    init(db_path) {
        // Setup Database  
        this.db_util.connect(db_path, (err, db) => {
            if (err) {
                console.log('ERROR connecting to: ' + db_path + '. ' + err);
                return shared.handleError(err);
            }
            console.log('Successfully connected to: ' + db_path);
            //this.delete(this.db_util, 'Action');
            //this.delete(this.db_util, HISTORICAL_DATA_MODEL);
            // Init database with data if empty
            this.initMockData(db);
            // Init historical data if empty
            // TODO: abstract historical data to make it more generic
            this.initHistoricalData(db, {
                model: {
                    parent: HISTORICAL_DATA_MODEL,
                    child: HISTORICAL_DATA_CHILD_MODEL
                },
                symbols: constants.BASE_SYMBOLS,
                startDate: constants.BASE_START_DATE
            });
        });
    }
    //
    /** Initialize the database with static data models */
    //
    initMockData(db) {
        // Extract models from matching files and save them into the DB 
        fileHelper.searchFiles('src/server/data/*.js', (file) => {
            return file.replace('src/server', '.');
        }).then((files) => {
            if (!files) {
                return;
            }
            files.forEach((file) => {
                require(file).objects.forEach((obj) => {
                    modelHelper.isModelEmpty(this.db_util, obj.name).then((res) => {
                        if (res) {
                            modelHelper.saveObjects(this.db_util, obj.name, obj.items);
                        }
                    }).catch((err) => {
                        shared.handleError(err);
                    });
                });
            });
        });
    }
    //
    /** Initialize the database with historical quotes */
    //
    initHistoricalData(db, options) {
        modelHelper.isModelEmpty(this.db_util, options.model.parent).then((res) => {
            if (!res) {
                return null;
            }
            return this.getHistoricalData(options.symbols, options.startDate);
        }).then((histories) => {
            if (histories) {
                return this.saveHistoricalData(JSON.stringify(histories), options.model.child);
            }
        }).then((quotes) => {
            arrayHelper.flatten(quotes).forEach((quote) => {
                let id = quote.asset ? quote.asset._id : null;
                this.save(this.db_util, options.model.parent, new assetHistory({
                    assetId: id,
                    symbol: quote.data.Symbol,
                    date: quote.data.Date,
                    open: quote.data.Open,
                    high: quote.data.High,
                    low: quote.data.Low,
                    close: quote.data.Close
                }));
            });
        }).catch((err) => {
            shared.handleError(err);
        });
    }
    //
    /** Get historical data from the database */
    //
    getHistoricalData(symbols, startDate) {
        return Promise.all(this.getSymbols(symbols, startDate));
    }
    getSymbols(symbols, startDate) {
        return symbols.map((symbol) => {
            return Promise.all(this.getSymbolData(symbol, startDate));
        });
    }
    getSymbolData(symbol, startDate) {
        return quoteHelper.getSymbolDateArray(startDate).map((date) => {
            return quoteHelper.getSymbolHistory(symbol, date).then((res) => {
                return formatHelper.tryParseJSON(res);
            });
        });
    }
    //
    /** Save historical data in the database */
    //
    saveHistoricalData(responses, model) {
        return Promise.all(this.parseHistoricalData(responses, model));
    }
    //
    /** Parse historical data */
    //
    //TODO: Abstract this method so that this class doesn't depend on the parsing.
    parseHistoricalData(responses, model) {
        return arrayHelper.flatten(formatHelper.tryParseJSON(responses)).filter((history) => {
            return history.query.count > 0;
        }).map((history) => {
            return Promise.all(history.query.results.quote.map((quote) => {
                return {
                    asset: this.getModel(model, { 'symbol': quote.Symbol }),
                    data: quote
                };
            }));
        });
    }
    //
    /** Generic method to get a model that satisfies the conditions specified */
    //
    getModel(targetModel, conditions) {
        return new Promise((resolve, reject) => {
            this.db_util.model(targetModel).findOne(conditions, (err, res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    //
    /** Delete a model in the database */
    //
    delete(db_util, model) {
        modelHelper.deleteModel(db_util, model);
    }
    //
    /** Generic method to save an object of a certain model */
    //
    save(db_util, model, obj) {
        modelHelper.saveObject(db_util, model, obj);
    }
}

module.exports = DatabaseLayer;