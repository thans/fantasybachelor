var Database = require('../database.js');
var moment = require('moment');
var async = require('async');
var _ = require('underscore');

module.exports.Week = Database.MySQL.Model.extend({
    tableName: 'week',

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

module.exports.Weeks.isSelectionOpen = function(weekId, success, failure) {
    new Database.Week({id: weekId})
        .fetch()
        .then(function(week) {
            success(moment().isAfter(week.get('openDatetime')) && moment().isBefore(week.get('closeDatetime')));
        }, failure);
};

module.exports.Weeks.getExtended = function(userId, success, failure) {
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
                            qb.where('prediction.user_id', '=', userId);
                        }})
                            .then(function(week) {
                                week.related('predictions').each(function(prediction) {
                                    extendedWeeks[week.id].selectedContestants.push(prediction.get('contestant_id'));
                                });
                                callback();
                            }, callback)
                    }, function(err) {
                        if (err) {
                            failure(err);
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
                                        if (i === 0) {
                                            _.each(week.remainingContestants, function(contestant) {
                                                remainingContestantsWithMultipliers.push({id: contestant, multiplier: 1});
                                            });
                                        } else {
                                            var lastWeek = extendedWeeks[i-1];
                                            _.each(week.remainingContestants, function(contestant) {
                                                if (_.contains(lastWeek.selectedContestants, contestant)) {
                                                    remainingContestantsWithMultipliers.push({id: contestant, multiplier: _.find(lastWeek.remainingContestants, function(remainingContestant) { return remainingContestant.id === contestant; }).multiplier + 1});
                                                } else {
                                                    remainingContestantsWithMultipliers.push({id: contestant, multiplier: 1});
                                                }
                                            });
                                        }
                                        week.remainingContestants = remainingContestantsWithMultipliers;
                                    });

                                    success(extendedWeeks);
                                }, failure);
                        }
                    });
                });
            });
        }, failure);
};

module.exports.Weeks.getCurrentWeek = function(success, failure) {
    new Database.Weeks().fetch().then(function(weeks) {
        success(weeks.find(function(week) {
            return moment().isAfter(week.get('openDatetime')) && moment().isBefore(week.get('scoresAvailableDatetime'));
        }));
    }, failure);
};


module.exports.Weeks.getWeeklyPredictions = function(success, failure) {
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
                failure(err);
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
                        success(finalData);
                    });
            }
        });
    }, failure);
};