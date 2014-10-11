/**
 * A {@link UserScore} models the score of a {@link User}. It is separate from a {@link User} for caching purposes.
 */
var Database = require('../database.js');
var moment = require('moment');
var async = require('async');
var _ = require('underscore');
var Q = require('q');

module.exports.UserScore = Database.MySQL.Model.extend({
    tableName: 'userScores',
    hasTimestamps : true,

    // Relations
    user: function() {
        return this.belongsTo(Database.User);
    }
});

module.exports.UserScores = Database.MySQL.Collection.extend({
    model: module.exports.UserScore
});

/**
 * Ignores the cached score, and recalculates the score from the {@link User}'s predictions.
 * @param userId The ID of the {@link User}
 * @returns {Promise}
 */
module.exports.UserScore.calculateScore = function(userId) {
    var deferred = Q.defer();
    var extendedWeeks = {};
    new Database.Weeks()
        .fetch({withRelated: ['eliminations', 'scoringOpportunities']})
        .then(function(weeks) {

            // Sort weeks
            weeks.sortBy(function(week) {
                return week.number;
            });

            // Remove weeks not scored (should be done in query)
            weeks = weeks.filter(function(week) {
                return moment().isAfter(week.get('scoresAvailableDatetime'));
            });

            // Initialize extended weeks
            _.each(weeks, function(week) {
                extendedWeeks[week.id] = {
                    selectedContestants: [],
                    eliminatedContestants: []
                };
            });

            // Record selections
            async.each(weeks, function(week, callback) {
                week.load({predictions: function(qb) {
                    qb.where('predictions.user_id', '=', userId);
                }})
                .then(function(week) {
                    week.related('predictions').each(function(prediction) {
                        extendedWeeks[week.id].selectedContestants.push(prediction.get('contestant_id'));
                    });
                    callback();
                }, callback)
            }, function(err) {
                if (err) {
                    deferred.reject(err);
                } else {

                    // Record eliminations
                    _.each(weeks, function(week) {
                        week.related('eliminations').each(function(elimination) {
                            extendedWeeks[week.id].eliminatedContestants.push(elimination.get('contestant_id'));
                        });
                    });

                    extendedWeeks = _.values(extendedWeeks);

                    // Remove eliminatedContestants from selectedContestants
                    _.each(extendedWeeks, function(week) {
                        week.scoringContestants = _.difference(week.selectedContestants, week.eliminatedContestants);
                    });

                    // Calculate Score
                    var score = 0;
                    _.each(extendedWeeks, function(week, i) {
                        var multipliers = [];
                        if (i === 0) {
                            _.each(week.scoringContestants, function(contestant) {
                                multipliers.push({id: contestant, multiplier: 1});
                                score += 1;
                            });
                        } else {
                            var lastWeek = extendedWeeks[i-1];
                            _.each(week.scoringContestants, function(contestant) {
                                if (_.contains(lastWeek.scoringContestants, contestant)) {
                                    var lastMultiplier = _.find(lastWeek.multipliers, function(multiplier) { return multiplier.id === contestant; }).multiplier;
                                    multipliers.push({id: contestant, multiplier: lastMultiplier + 1});
                                    score += lastMultiplier + 1;
                                } else {
                                    multipliers.push({id: contestant, multiplier: 1});
                                    score += 1;
                                }
                            });
                        }
                        week.multipliers = multipliers;
                    });
                    deferred.resolve(score);
                }
            });
        });
    return deferred.promise;
};

/**
 * Gets the score for a {@link User} recalcuating only if the cached value is expired.
 * @param userId The ID of the {@link User}
 * @returns {Promise}
 */
module.exports.UserScore.getScore = function(userId) {
    var deferred = Q.defer();
    new Database.UserScores()
        .query('where', 'user_id', '=', userId)
        .fetchOne()
        .then(function(userScore) {
            if (userScore === undefined || userScore === null) { // No record
                Database.UserScore.calculateScore(userId).then(function(score) {
                    Database.Weeks.getCurrentWeek().then(function(currentWeek) {
                        var expires;
                        if (currentWeek) {
                            expires = currentWeek.get('scoresAvailableDatetime');
                        } else {
                            expires = moment().add('weeks', 1).valueOf();
                        }
                        new Database.UserScore({
                            score: score,
                            user_id: userId,
                            expires_at: expires
                        }).save().then(function() {
                            deferred.resolve(score);
                        }, deferred.reject);
                    }).fail(deferred.reject);
                }).fail(deferred.reject);
            } else if (moment().isBefore(userScore.get('expires_at'))) { // Get Cached value
                deferred.resolve(userScore.get('score'));
            } else {
                Database.UserScore.calculateScore(userId).then(function(score) { // Recalculate
                    Database.Weeks.getCurrentWeek().then(function(currentWeek) {
                        if (currentWeek) {
                            userScore.set('expires_at', currentWeek.get('scoresAvailableDatetime'));
                        } else {
                            userScore.set('expires_at', moment().add('weeks', 1).valueOf());
                        }
                        userScore.set('score', score);
                        userScore.save().then(function() {
                            deferred.resolve(score);
                        }, deferred.reject);
                    }).fail(deferred.reject);
                }).fail(deferred.reject);
            }
        }, deferred.reject);
    return deferred.promise;
};

// Create table if it does not exist.
var knex = Database.MySQL.knex;
var tableName = module.exports.UserScore.prototype.tableName;
knex.schema.hasTable(tableName).then(function(tableExists) {
    if (tableExists) { return; }
    knex.schema.createTable(tableName, function(table) {
        table.increments('id').primary();
        table.integer('score').notNullable();
        table.dateTime('expires_at').notNullable();
        table.integer('user_id')
            .unsigned()
            .references('id')
            .inTable('users')
            .notNullable();
        table.timestamps();
    }).then(function() {
        console.log('Created ' + tableName + ' table');
    });
});