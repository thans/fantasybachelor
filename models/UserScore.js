var Database = require('../database.js');
var moment = require('moment');
var async = require('async');
var _ = require('underscore');

module.exports.UserScore = Database.MySQL.Model.extend({
    tableName: 'userScores',

    // Relations
    user: function() {
        return this.belongsTo(Database.User);
    }
});

module.exports.UserScores = Database.MySQL.Collection.extend({
    model: module.exports.UserScore
});

module.exports.UserScore.calculateScore = function(userId, success, failure) {
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
                    success(score);
                }
            });
        });
}

module.exports.UserScore.getScore = function(userId, success, failure) {
    new Database.UserScores()
        .query('where', 'user_id', '=', userId)
        .fetchOne()
        .then(function(userScore) {
            if (userScore === undefined || userScore === null) { // No record
                Database.UserScore.calculateScore(userId, function(score) {
                    Database.Weeks.getCurrentWeek(function(currentWeek) {
                        var expires;
                        if (currentWeek) {
                            expires = currentWeek.get('scoresAvailableDatetime');
                        } else {
                            expires = moment().add('weeks', 1).valueOf();
                        }
                        new Database.UserScore({
                            score: score,
                            user_id: userId,
                            updatedTimestamp: new Date(),
                            expiresTimestamp: expires
                        }).save().then(function() {
                                success(score);
                            }, failure);
                    }, failure);
                }, failure);
            } else if (moment().isBefore(userScore.get('expiresTimestamp'))) { // Get Cached value
                success(userScore.get('score'));
            } else {
                Database.UserScore.calculateScore(userId, function(score) { // Recalculate
                    Database.Weeks.getCurrentWeek(function(currentWeek) {
                        if (currentWeek) {
                            userScore.set('expiresTimestamp', currentWeek.get('scoresAvailableDatetime'));
                        } else {
                            userScore.set('expiresTimestamp', moment().add('weeks', 1).valueOf());
                        }
                        userScore.set('score', score);
                        userScore.set('updatedTimestamp', new Date());
                        userScore.save().then(function() {
                            success(score);
                        }, failure);
                    }, failure);
                }, failure);
            }
        }, failure);
}