var orm = require("orm");
var utils = require('./utils');
var _ = require("underscore");
var moment = require('moment');
exports.orm = orm;

exports.getExpressConnection = function() {
    console.log('Starting database connection on: ' + getConnectionUrl());
    return orm.express(getConnectionUrl(), {

        define: function(db, models) {
            models.user = db.define('user', {
                firstName: 'text',
                lastName: 'text',
                fbId: 'number'
            }, {
                methods: {
                    fullName: function() {
                        return this.firstName + ' ' + this.lastName;
                    }
                }
            });
            models.user.login = function(user, callback) {
                models.user.find({fbId: user.fbId}, function(err, users) {
                    if (err) throw err;

                    if (users.length > 0) {
                        models.userScores.getScore(users[0].id, function(userScore) {
                            users[0].score = userScore;
                            callback(users[0]);
                        });
                    } else {
                        models.user.create({
                            firstName: user.firstName,
                            lastName: user.lastName,
                            fbId: user.fbId
                        }, function(err, user) {
                            if (err) throw err;

                            // Create a score of 0 for the user
                            models.week.getEndOfCurrentWeek(function(endOfWeek) {
                                models.userScores.create({
                                    updatedTimestamp: getSQLDateTime(new Date()),
                                    expiresTimestamp: endOfWeek,
                                    user_id: user.id,
                                    score: 0
                                }, function(error, scores) {
                                    if (error) throw error;
                                    user.score = 0;
                                    callback(user);
                                });
                            });
                        });
                    }
                });
            };
            models.user.getAll = function(callback) {
                models.user.find({}, function(err, users) {
                    if (err) throw err;
                    callback(users);
                });
            }
            models.user.getAllWithScore = function(callback) {
                models.user.find({}, function(err, users) {
                    if (err) throw err;
                    var i = 0;
                    var next = function() {
                        if (i < users.length) {
                            models.userScores.getScore(users[i].id, function(score) {
                                users[i].score = score;
                                i++;
                                next();
                            })
                        } else {
                            callback(_.sortBy(users, function(user) { return -user.score; }));
                        }
                    }
                    next();
                });
            }

            models.week = db.define('week', {
                name: 'text',
                number: 'number',
                openDatetime: 'date',
                closeDatetime: 'date',
                scoresAvailableDatetime: 'date'
            }, {
                autoFetch : true,
                methods: {
                    isCurrent: function() {
                        var today = new Date();
                        return today > this.open_datetime && today < this.close_datetime;
                    }
                }
            });

            models.week.getWeeks = function(userId, callback) {
                var weeksProcessed = [];
                //var numWeeks;
                //var numEliminationsRemaining;
                models.week.find({}, function(err, weeks) {
                    if (err) throw err;
                    //numWeeks = weeks.length;
                    //numEliminationsRemaining =
                    _.each(weeks, function(week) {
                        var weekProcessed = {
                            id: week.id,
                            name: week.name,
                            openTime: week.openDatetime,
                            closeTime: week.closeDatetime,
                            scoresAvailableTime: week.scoresAvailableDatetime,
                            remainingContestants: [],
                            selectedContestants: [],
                            eliminatedContestants: [],
                            numberOfSelections: 6
                        };

                        // Get eliminatedContestants
                        weeksProcessed.push(weekProcessed);
                        _.each(week.eliminations, function(elimination) {
                            weekProcessed.eliminatedContestants.push(elimination.contestant_id);
                        });
                    });

                    // Add all contestants to remainingContestants
                    models.contestant.find({}, function(err, contestants) {
                        if (err) throw err;
                        var filtered = _.filter(contestants, function(contestant) {return contestant.id != 15;});
                        _.each(filtered, function(contestant) {
                            _.each(weeksProcessed, function(week) {
                                week.remainingContestants.push(contestant.id);
                            });
                        });

                        // Get selectedContestants
                        models.prediction.find({user_id: userId}, function(err, predictions) {
                            if (err) throw err;
                            _(predictions).each(function(prediction) {
                                _(weeksProcessed).find(function(week) { return week.id === prediction.scoringOpportunity.week_id; }).selectedContestants.push(prediction.contestant.id);
                            });

                            // Remove eliminatedContestants from remainingContestants
                            _(weeksProcessed).each(function(week) {
                                var filtered = _(weeksProcessed).filter(function(weekCandidate) {return weekCandidate.id > week.id;});
                                _(filtered).each(function(weekToRemoveEliminated) {
                                    weekToRemoveEliminated.remainingContestants = _(weekToRemoveEliminated.remainingContestants).difference(week.eliminatedContestants);
                                });
                            });

                            // Calculate Multipliers
                            _(weeksProcessed).each(function(week, i) {
                                var remainingContestantsWithMultipliers = [];
                                if (i === 0) {
                                    _(week.remainingContestants).each(function(contestant) {
                                        remainingContestantsWithMultipliers.push({id: contestant, multiplier: 1});
                                    });
                                } else {
                                    var lastWeek = weeksProcessed[i-1];
                                    _(week.remainingContestants).each(function(contestant) {
                                        if (_(lastWeek.selectedContestants).contains(contestant)) {
                                            remainingContestantsWithMultipliers.push({id: contestant, multiplier: _(lastWeek.remainingContestants).find(function(remainingContestant) { return remainingContestant.id === contestant; }).multiplier + 1});
                                        } else {
                                            remainingContestantsWithMultipliers.push({id: contestant, multiplier: 1});
                                        }
                                    });
                                }
                                week.remainingContestants = remainingContestantsWithMultipliers;
                            })
                            callback(weeksProcessed);
                        });
                    });
                });
            }

            models.week.getEndOfCurrentWeek = function(callback) {
                var today = new Date();
                var foundMatch = false;
                models.week.find({}).each(function(oneWeek) {
                    if (new Date(oneWeek.openDatetime) < today && new Date(oneWeek.scoresAvailableDatetime) > today && !foundMatch) {
                        foundMatch = true;
                        callback(oneWeek.scoresAvailableDatetime);
                    }
                });
            }
            

            models.contestant = db.define('contestant', {
                name: 'text',
                codename: 'text'
            }, {
                autoFetch: true
            });

            models.contestant.getAllContestants = function(callback) {
                var contestants = [];
                this.find({}).each(function(oneContestant) {
                    if (oneContestant.week_id <= weekId) {
                        eliminations.push(oneContestant.contestant_id);
                    }
                }).count(function(count) {
                    callback(contestants);
                });
            }

            models.contestant.getContestantData = function(data, callback) {
                models.bioQuestion.findByContestant({}, function(error, questions) {
                    if (error) throw error;
                    contestantMap = {};
                    _.each(questions, function(question) {
                        console.log(question);
                        if (contestantMap[question.contestant.id]) {
                            contestantMap[question.contestant.id].questions.push({question: question.question, answer: question.answer});
                        } else {
                            contestantMap[question.contestant.id] = {
                                id: question.contestant.id,
                                name: question.contestant.name,
                                codeName: question.contestant.codename,
                                questions: [{question: question.question, answer: question.answer}]
                            }
                        }
                    });
                    models.bioStatistic.findByContestant({}, function(err, statistics) {
                        if (err) throw err;
                        _.each(statistics, function(stat) {
                            console.log(stat);
                            if (contestantMap[stat.contestant.id].stats) {
                                contestantMap[stat.contestant.id].stats.push({name: stat.name, value: stat.value});
                            } else {
                                contestantMap[stat.contestant.id].stats = [{name: stat.name, value: stat.value}];
                            }
                        });
                        callback(_.toArray(contestantMap));
                    });
                });
            }

            models.contestant.getRemainingContestants = function(eliminated, callback) {
                var allContestants = [];
                this.find({}).each(function(one) {
                    if (one.codename != "juanPablo") {
                        allContestants.push(one.id);
                    }
                }).count(function(count) {
                    callback(_.difference(allContestants, eliminated));
                });
            }

            models.contestant.selectContestant = function(userId, weekId, contestantId, callback) {
                var scoringOpportunityFound = false;
                models.scoringOpportunity.find({week_id: weekId}).each(function(scoringOpportunity) {
                    scoringOpportunityFound || models.prediction.find({user_id: userId, scoringOpportunity_id: scoringOpportunity.id}, function(err, predictions) {
                        if (err) throw err;
                        if (!scoringOpportunityFound && predictions.length == 0) {
                            scoringOpportunityFound = true;
                            console.log('opID: ' + scoringOpportunity.id);
                            models.prediction.create([{
                                createdDatetime: getSQLDateTime(new Date()),
                                user_id: userId,
                                scoringOpportunity: scoringOpportunity,
                                contestant_id: contestantId
                            }], function(err, predictions2) {
                                if (err) throw err;
                                callback(predictions2[0]);
                            });
                        }
                    })
                });
            }

            models.contestant.removeContestant = function(userId, weekId, contestantId, callback) {
                models.scoringOpportunity.find({week_id: weekId}).each(function(scoringOpportunity) {
                    models.prediction.find({user_id: userId, contestant_id: contestantId, scoringOpportunity_id: scoringOpportunity.id}).remove(function(err) {
                        if (err) throw err;
                    });
                });
                callback();
            }

            models.elimination = db.define('elimination', {}, {autoFetch: true});
            models.elimination.hasOne('contestant', models.contestant, {reverse: 'eliminations'});
            models.elimination.hasOne('week', models.week, {reverse: 'eliminations'});
            

            models.elimination.getEliminatedContestantsByWeek = function(weekId, callback) {
                var eliminations = [];
                this.find({}).each(function(oneElimination) {
                    if (oneElimination.week_id <= weekId) {
                        eliminations.push(oneElimination.contestant_id);
                    }
                }).count(function(count) {
                    callback(eliminations);
                });
            }
 

            models.scoringOpportunity = db.define('scoringOpportunity', {
                name: 'text',
                type: ["NORMAL", "BONUS"],
                value: 'number'
            }, {
                autoFetch: true
            });
            models.scoringOpportunity.hasOne('week', models.week, {reverse: 'scoringOpportunities'});

            models.prediction = db.define('prediction', {
                createdDatetime: 'date'
            }, {
                autoFetch: true
            });
            models.prediction.hasOne('user', models.user, {reverse: 'predictions'});
            models.prediction.hasOne('contestant', models.contestant, {reverse: 'predictions'});
            models.prediction.hasOne('scoringOpportunity', models.scoringOpportunity, {reverse: 'predictions'});

            models.prediction.getSelectionByWeek = function(userId, weekId, callback) {
                var selections = [];
                
                this.findByScoringOpportunity({week_id : weekId}).each(function(selection) {
                    if (selection.user_id == userId) {
                        selections.push(selection.scoringOpportunity_id);
                    }
                }).count(function(count) {
                    callback(selections);
                });
            }

            // TODO
            models.prediction.getValueOfSelections = function(userId, weekNum, ids, callback) {
                var values = [];
                var opportunities = [];
                var contestant = [];
                this.find({user_id: userId}).each(function(predict) {
                    if (_.indexOf(ids, predict.contestant_id) != -1) {
                        opportunities.push(predict.scoringopportunity_id);
                        contestant.push(predict.contestant_id);
                    }
                }).count(function(count) {
                    models.scoringOpportunity.findByWeek({number : weekNum - 1}).each(function(selection) {
                        var index = _.indexOf(opportunities, parseInt(selection.id));
                        if (index > -1) {
                            values.push({
                                id: contestant[index],
                                multiplier: selection.value
                            });
                        }
                    }).count(function(ct) {
                        callback(values);
                    });
                });
            }

            models.prediction.getValueOfAll = function(userId, weekNum, ids, callback) {
                var values = [];
                var opportunities = [];
                var contestant = [];
                var contestantMap = {};
                for (var i = 0; i < ids.length; i++) {
                    contestantMap[ids[i]] = 1;
                }
                this.find({user_id: userId}).each(function(predict) {
                    if (_.indexOf(ids, predict.contestant_id) != -1) {
                        opportunities.push(predict.scoringopportunity_id);
                        contestant.push(predict.contestant_id);
                    }
                }).count(function(count) {
                    models.scoringOpportunity.findByWeek({number : weekNum - 1}).each(function(selection) {
                        var index = _.indexOf(opportunities, parseInt(selection.id));
                        if (index > -1) {
                            contestantMap[contestant[index]] = selection.value + 1;
                        }
                    }).count(function(ct) {
                        for (var key in contestantMap) {
                            values.push({
                                id: parseInt(key),
                                multiplier: contestantMap[key]
                            });
                        }
                        callback(values);
                    });
                });
            }

            models.bioQuestion = db.define('bioQuestion', {
                question: 'text',
                answer: 'text',
            }, {
                autoFetch : true
            });
            models.bioQuestion.hasOne('contestant', models.contestant, {reverse: 'bioQuestion'});

            models.bioQuestion.getQuestions = function(contestantId, callback) {
                var bioSurvey = [];
                this.find({contestant_id : contestantId}).each(function(interview) {
                    bioSurvey.push({
                        key: interview.question,
                        value: interview.answer
                    });
                }).count(function(count) {
                    callback(bioSurvey);
                });
            }

            models.bioStatistic = db.define('bioStatistic', {
                name: 'text',
                value: 'text'
            }, {
                autoFetch : true
            });
            models.bioStatistic.hasOne('contestant', models.contestant, {reverse: 'bioStatistic'});

            models.bioStatistic.getStats = function(contestantId, callback) {
                var stats = [];
                this.find({contestant_id : contestantId}).each(function(stat) {
                    stats.push({
                        key: stat.name,
                        value: stat.value
                    });
                }).count(function(count) {
                    callback(stats);
                });
            }

            models.userScores = db.define('userScores', {
                updatedTimestamp: 'date',
                expiresTimestamp: 'date',
                score: 'number'
            });

            models.userScores.hasOne('user', models.user, {reverse: 'userScores'});
            // eliminations must be updated prior to calling this!
            models.userScores.updateScores = function(weekId, callback) {
                var me = this;
                var updated = {};
                models.elimination.getEliminatedContestantsByWeek(weekId, function(eliminated) {
                    models.week.getEndOfCurrentWeek(function(endOfWeek) {
                        models.prediction.findByScoringOpportunity({}).findByWeek({id: weekId}).each(function(prediction) {
                            // if the user matches and the prediction was not for an eliminated contestant, then add it
                            if (eliminated.indexOf(prediction.contestant_id) == -1) {
                                if (updated[prediction.user_id]) {
                                    updated[prediction.user_id] += prediction.value;
                                } else {
                                    updated[prediction.user_id] = prediction.value;
                                }
                            }
                        }).count(function (count) {
                            me.find({}).each(function(userScore) {
                                // sanity check, should only call update after eliminations are added at the end of a show
                                if (new Date(userScore.expiresTimestamp) < new Date()) {
                                    userScore.score += updated[userScore.user_id];
                                    userScore.updatedTimestamp = getSQLDateTime(new Date());
                                    userScore.expiresTimestamp = endOfWeek;
                                }
                            }).save();
                        });
                    });
                });
            }

            models.userScores.getScore = function(userId, callback) {
                this.find({user_id: userId}, function(err, scores) {
                    if (err) throw err;
                    if (scores.length < 0 || moment().isAfter(scores[0].expiresTimestamp)){
                        var score = 0;
                        models.week.getWeeks(userId, function(weeks) {
                            _.each(weeks, function(week) {
                                if (moment().isAfter(week.scoresAvailableTime)) {
                                    _.each(week.selectedContestants, function(selectedContestant) {
                                        if (!_.contains(week.eliminatedContestants, selectedContestant)) {
                                            score += _.find(week.remainingContestants, function(remainingContestant) { return remainingContestant.id === selectedContestant }).multiplier;
                                        }
                                    })
                                }
                            });
                            models.week.getEndOfCurrentWeek(function(endOfWeek) {
                                scores[0].save({ score: score, expiresTimestamp: endOfWeek, updatedTimestamp: getSQLDateTime(new Date()) }, function (err) {
                                    if (err) throw err;
                                    callback(score);
                                });
                            });
                        })
                    } else {
                        callback(scores[0].score);
                    }
                });
            }
        }
    });
}

function getConnectionUrl() {
    verifyEnv();
    return process.env.RDS_PROTOCOL + '://' + process.env.RDS_USERNAME + ':' + process.env.RDS_PASSWORD + '@' + process.env.RDS_HOSTNAME + '/' + process.env.RDS_DATABASE + '?pool=true';
}

function getConnectionOpts() {
    verifyEnv();
    return {
        database : process.env.RDS_DATABASE,
        host     : process.env.RDS_HOSTNAME,
        port     : process.env.RDS_PORT,
        user     : process.env.RDS_USERNAME,
        password : process.env.RDS_PASSWORD,
        query    : {
            pool     : true,   // optional, false by default
            debug    : false,   // optional, false by default
            strdates : false    // optional, false by default
        }
    }
}

function getSQLDateTime(date) {
    return date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' + 
        ('00' + date.getUTCHours()).slice(-2) + ':' + 
        ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
        ('00' + date.getUTCSeconds()).slice(-2);
}

function verifyEnv() {
    utils.verifyEnvVar('RDS_DATABASE');
    utils.verifyEnvVar('RDS_HOSTNAME');
    utils.verifyEnvVar('RDS_PORT');
    utils.verifyEnvVar('RDS_USERNAME');
    utils.verifyEnvVar('RDS_PASSWORD');
}