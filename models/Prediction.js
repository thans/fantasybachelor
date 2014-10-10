/**
 * A {@link Prediction} is a selection made by a user. The user can choose a contestant that they think will not be
 * eliminated in the given week.
 */
var Database = require('../database.js');
var Q = require('q');

module.exports.Prediction = Database.MySQL.Model.extend({
    tableName: 'predictions',
    hasTimestamps : true,

    // Relations
    user: function() {
        return this.belongsTo(Database.User);
    },
    contestant: function() {
        return this.hasOne(Database.Contestant);
    }
});

module.exports.Predictions = Database.MySQL.Collection.extend({
    model: module.exports.Prediction
});

/**
 * Removes the {@link Prediction} with the matching parameters from the database.
 * @param userId The matching ID of the {@link User}.
 * @param weekId The matching ID of the {@link Week}.
 * @param contestantId The matching ID of the {@link Contestant}.
 * @returns {Promise}
 */
module.exports.Predictions.removePrediction = function(userId, weekId, contestantId) {
    var deferred = Q.defer();
    new Database.Week({id: weekId})
        .predictions()
        .query({where: {user_id: userId, contestant_id: contestantId}})
        .fetchOne()
        .then(function(prediction) {
            prediction.destroy().then(deferred.resolve, deferred.reject);
        }, deferred.reject);
    return deferred.promise;
};

/**
 * Creates the {@link Prediction} with the matching parameters in the database
 * if there is an open {@link ScoringOpportunity} it can be linked to.
 * @param userId The ID of the {@link User}.
 * @param weekId The ID of the {@link Week}.
 * @param contestantId The ID of the {@link Contestant}.
 * @returns {Promise}
 */
module.exports.Predictions.makePrediction = function(userId, weekId, contestantId) {
    var deferred = Q.defer();

    // Verify week is open
    Database.Weeks.isSelectionOpen(weekId).then(function(selectionOpen) {
        if (!selectionOpen) {
            deferred.reject('Sorry, but selection for this week is closed.');
        } else {

            // Verify contestant hasn't already been picked
            Database.Prediction.hasBeenPredicted(userId, weekId, contestantId).then(function(hasBeenPredicted) {
                if (hasBeenPredicted) {
                    deferred.reject('Sorry, but you have already selected this contestant');
                } else {

                    // Find open scoringOpportunities
                    Database.ScoringOpportunities.getOpen(userId, weekId).then(function(scoringOpportunities) {
                        if (scoringOpportunities.size() == 0) {
                            deferred.reject('You can\'t make any more picks this week. Sorry.');
                        } else {

                            // Create new pick
                            new Database.Prediction({
                                user_id: userId,
                                scoringOpportunity_id: scoringOpportunities.at(0).get('id'),
                                contestant_id: contestantId
                            }).save().then(deferred.resolve, deferred.reject)
                        }
                    }).fail(deferred.reject);
                }
            }).fail(deferred.reject);
        }
    }).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Determines if a {@link Prediction} with the matching parameters is in the database.
 * @param userId The ID of the {@link User}.
 * @param weekId The ID of the {@link Week}.
 * @param contestantId The ID of the {@link Contestant}.
 * @returns {Promise}
 */
module.exports.Prediction.hasBeenPredicted = function(userId, weekId, contestantId) {
    var deferred = Q.defer();
    new Database.Week({id: weekId})
        .predictions()
        .query({where: {user_id: userId, contestant_id: contestantId}})
        .fetchOne()
        .then(function(prediction) {
            deferred.resolve(prediction !== undefined && prediction !== null);
        }, deferred.reject);
    return deferred.promise;
};

// Create table if it does not exist.
var knex = Database.MySQL.knex;
var tableName = module.exports.Prediction.prototype.tableName;
knex.schema.hasTable(tableName).then(function(tableExists) {
    if (tableExists) { return; }
    knex.schema.createTable(tableName, function(table) {
        table.increments('id').primary();
        table.integer('user_id')
            .unsigned()
            .references('id')
            .inTable('users')
            .notNullable();
        table.integer('contestant_id')
            .unsigned()
            .references('id')
            .inTable('contestants')
            .notNullable();
        table.integer('scoringOpportunity_id')
            .unsigned()
            .references('id')
            .inTable('scoringOpportunities')
            .notNullable();
        table.timestamps();
    }).then(function() {
        console.log('Created ' + tableName + ' table');
    });
});