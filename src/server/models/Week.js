/**
 * A {@link Week} models a week on the show, or more specifically a round of eliminations.
 */
var Database = require('../database.js');
var moment = require('moment');
var async = require('async');
var _ = require('underscore');
var Q = require('q');

module.exports.Week = Database.MySQL.Model.extend({
    tableName: 'weeks',
    hasTimestamps : true,

    // Relations
    scoringOpportunities: function() {
        return this.hasMany(Database.ScoringOpportunity);
    },
    predictions: function() {
        return this.hasMany(Database.Prediction).through(Database.ScoringOpportunity);
    },
    eliminations: function() {
        return this.hasMany(Database.Elimination);
    }

});

module.exports.Weeks = Database.MySQL.Collection.extend({
    model: module.exports.Week
});

/**
 * Determines if every user is still able to make {@link Predictions} for the given {@link Week}.
 * @param weekId The ID of the {@link Week}
 * @returns {Promise}
 */
module.exports.Weeks.isSelectionOpen = function(weekId) {
    var deferred = Q.defer();
    new Database.Week({id: weekId})
        .fetch()
        .then(function(week) {
            deferred.resolve(moment().isAfter(week.get('openDatetime')) && moment().isBefore(week.get('closeDatetime')));
        }, deferred.reject);
    return deferred.promise;
};

/**
 * Gets all of the data for every {@link Week} including related data such as the {@link User}'s selections.
 * @param userId The ID of the {@link User}
 * @returns {Promise}
 */
module.exports.Weeks.getExtended = function(userId) {
    var deferred = Q.defer();
    var extendedWeeks = {};
    new Database.Weeks()
        .fetch({withRelated: ['eliminations', 'scoringOpportunities']})
        .then(function(weeks) {
            weeks.sortBy(function(week) {
                return week.number;
            });

            // Initialize weeks
            async.each(weeks.toArray(), function(week, callback) {
                extendedWeeks[week.id] = {
                    id: week.id,
                    name: week.get('name'),
                    number: week.get('number'),
                    openTime: week.get('openDatetime'),
                    closeTime: week.get('closeDatetime'),
                    scoresAvailableTime: week.get('scoresAvailableDatetime'),
                    remainingContestants: [],
                    selectedContestants: [],
                    eliminatedContestants: [],
                    numberOfSelections: week.related('scoringOpportunities').size()
                };
                callback();
            }, function() {

                // Record eliminations
                async.each(weeks.toArray(), function(week, callback) {
                    week.related('eliminations').each(function(elimination) {
                        extendedWeeks[week.id].eliminatedContestants.push(elimination.get('contestant_id'));
                    });
                    callback();
                }, function() {

                    // Record selections
                    async.each(weeks.toArray(), function(week, callback) {
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

                            extendedWeeks = _.values(extendedWeeks);
                            // Add all contestants to remainingContestants
                            new Database.Contestants()
                                .query('where', 'id', '!=', BACH_ID)
                                .fetch()
                                .then(function(contestants) {
                                    _.each(extendedWeeks, function(week) {
                                        contestants.each(function(contestant) {
                                            week.remainingContestants.push(contestant.id);
                                        });
                                    });

                                    // Remove eliminated contestants from remainingContestants
                                    _.each(extendedWeeks, function(week) {
                                        var filtered = _.filter(_.values(extendedWeeks), function(weekCandidate) {return weekCandidate.number > week.number;});
                                        _.each(filtered, function(weekToRemoveEliminated) {
                                            weekToRemoveEliminated.remainingContestants = _.difference(weekToRemoveEliminated.remainingContestants, week.eliminatedContestants);
                                        });
                                    });

                                    // Calculate Multipliers
                                    _.each(extendedWeeks, function(week, i) {
                                        var remainingContestantsWithMultipliers = [];
                                        var lastWeek = extendedWeeks[i-1];
                                        _.each(week.remainingContestants, function(contestant) {
                                            var multiplier = 1;
                                            if (lastWeek && _.contains(lastWeek.selectedContestants, contestant)) {
                                                multiplier = _.findWhere(lastWeek.remainingContestants, {id: contestant}).multiplier + 1;
                                            }
                                            remainingContestantsWithMultipliers.push({id: contestant, multiplier: multiplier});
                                        });
                                        week.remainingContestants = remainingContestantsWithMultipliers;

                                        // Add multipliers to selectedContestants
                                        var selectedContestantsWithMultipliers = [];
                                        _.each(week.selectedContestants, function(contestantId) {
                                            selectedContestantsWithMultipliers.push(_.findWhere(week.remainingContestants, {id : contestantId}));
                                        });
                                        week.selectedContestants = selectedContestantsWithMultipliers;

                                        // Add multipliers to eliminatedContestants
                                        var eliminatedContestantsWithMultipliers = [];
                                        _.each(week.eliminatedContestants, function(contestantId) {
                                            eliminatedContestantsWithMultipliers.push(_.findWhere(week.eliminatedContestants, {id : contestantId}));
                                        });
                                        week.eliminatedContestants = eliminatedContestantsWithMultipliers;
                                    });

                                    deferred.resolve(extendedWeeks);
                                }, deferred.reject);
                        }
                    });
                });
            });
        }, deferred.reject);
    return deferred.promise;
};

/**
 * Gets the {@link Week} that is currently open for {@link Predictions} or is currently airing.
 * @returns {Promise}
 */
module.exports.Weeks.getCurrentWeek = function() {
    var deferred = Q.defer();
    new Database.Weeks().fetch().then(function(weeks) {
        deferred.resolve(weeks.find(function(week) {
            return moment().isAfter(week.get('openDatetime')) && moment().isBefore(week.get('scoresAvailableDatetime'));
        }));
    }, deferred.reject);
    return deferred.promise;
};

/**
 * Gets the number of {@link Predictions} {@link User}s made for each {@link Contestant} by {@link Week}
 * @returns {Promise}
 */
module.exports.Weeks.getWeeklyPredictions = function() {
    var deferred = Q.defer();
    new Database.Weeks().fetch({withRelated: ['scoringOpportunities']}).then(function(weeks) {
        weeks.sortBy(function(week) {
            return week.number;
        });

        // Remove weeks not scored (should be done in query)
        weeks = weeks.filter(function(week) {
            return moment().isAfter(week.get('scoresAvailableDatetime'));
        });

        var contestantsAndWeekCount = {};
        var finalData = [];

        async.each(weeks, function(week, callback) {
            week.load({predictions: function(qb) {}})
                .then(function(week) {
                    week.related('predictions').each(function(prediction) {
                        if (contestantsAndWeekCount[prediction.attributes.contestant_id]) {

                            // adjust for 0 based index
                            contestantsAndWeekCount[prediction.get('contestant_id')][week.get('number') - 1]++;
                        } else {

                            // initilize array of correct size to all 0
                            contestantsAndWeekCount[prediction.get('contestant_id')] = Array.apply(null, new Array(weeks.length)).map(Number.prototype.valueOf,0);
                        }
                    });
                    callback();
                }, callback);
        }, function(err) {
            if (err) {
                deferred.reject(err);
            } else {
                new Database.Contestants()
                    .query('where', 'id', '!=', BACH_ID)
                    .fetch()
                    .then(function(contestants) {
                        contestants.each(function(contestant) {
                            finalData.push({
                                name: contestant.get('name'),
                                data: contestantsAndWeekCount[contestant.get('id')]
                            });
                        });
                        deferred.resolve(finalData);
                    });
            }
        });
    }, deferred.reject);
    deferred.promise;
};

// Create table if it does not exist.
var knex = Database.MySQL.knex;
var tableName = module.exports.Week.prototype.tableName;
knex.schema.hasTable(tableName).then(function(tableExists) {
    if (tableExists) { return; }
    knex.schema.createTable(tableName, function(table) {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
        table.integer('number').notNullable();
        table.dateTime('openDatetime').notNullable();
        table.dateTime('closeDatetime').notNullable();
        table.dateTime('scoresAvailableDatetime').notNullable();
        table.timestamps();
    }).then(function() {
        console.log('Created ' + tableName + ' table');
    });
});