var orm = require("orm");
var utils = require('./utils');
var _und = require("underscore");
exports.orm = orm;

exports.getExpressConnection = function() {
    console.log('Starting database connection on: ' + getConnectionUrl());
    return orm.express(getConnectionUrl(), {

        define: function(db, models) {
            models.user = db.define('user', {
                firstName: 'text',
                lastName: 'text',
                email: 'text',
                fbId: 'number'
            }, {
                methods: {
                    fullName: function() {
                        return this.firstName + ' ' + this.lastName;
                    }
                }
            });
            models.user.login = function(user, callback) {
                console.log('Logging in user: ' + JSON.stringify(user));
                var thiz = this;
                this.find({fbId: user.fbId}, function(err, users) {
                    if (err) throw err;

                    if (users.length > 0) {
                        users[0].score = 100;
                        models.userScores.getScore(users[0].id, function(userScore) {
                            callback
                            (userScore);
                        })
                    } else {
                        thiz.create({
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            fbId: user.fbId
                        }, function(err, user) {
                            if (err) throw err;
                            // TODO
                            var today = new Date();

                            // Create a score of 0 for the user
                            models.week.getEndOfCurrentWeek(function(endOfWeek) {
                                models.userScores.create({
                                    updatedTimestamp: getSQLDateTime(new Date()),
                                    expiresTimestamp: endOfWeek,
                                    user_id: user.id,
                                    score: 0
                                }, function(error, score) {
                                    if (error) throw error;
                                    user.score = 0;
                                    callback(user);
                                });
                            });
                        });
                    }
                });
            };
            models.week = db.define('week', {
                name: 'text',
                number: 'number',
                openDatetime: 'date',
                closeDatetime: 'date',
                scoresAvailableDatetime: 'date'
            }, {
                methods: {
                    isCurrent: function() {
                        var today = new Date();
                        return today > this.open_datetime && today < this.close_datetime;
                    }
                }
            });

            // TODO more efficiently, lots of queries!
            models.week.getWeeks = function(user, callback) {
                console.log('Getting week information');
                var thiz = this;
                var weekData = [];
                var num;
                this.find({}).each(function(item) {
                    models.elimination.getEliminatedContestantsByWeek(item.id, function(eliminated) {
                        models.contestant.getRemainingContestants(eliminated, function(remaining) {
                            models.prediction.getValueOfSelection(user, item.number, remaining, function(selectionValues) {
                                models.prediction.getSelectionByWeek(user, item.id, function(selections) {
                                    weekData.push({
                                        id: item.id,
                                        name: item.name,
                                        openTime: item.openDatetime,
                                        closeTime: item.closeDatetime,
                                        scoresAvailableTime: item.scoresAvailableDatetime,
                                        remainingContestants: selectionValues,
                                        selectedContestants: selections,
                                        eliminatedContestants: eliminated, 
                                        numberOfSelections: Math.min(remaining.length, 6) 
                                    });
                                    num--;
                                    if (num == 0) {
                                        callback(weekData);
                                    }
                                });
                            });
                            
                        });
                        
                    });

                }).count(function(count) {
                    num = count;
                    console.log("final: " + count);
                    
                });          
            }

            models.week.getEndOfCurrentWeek = function(callback) {
                var today = new Date();
                models.week.find({}).each(function(oneWeek) {
                    if (new Date(oneWeek.openDatetime) < today && new Date(oneWeek.closeDatetime) > today) {
                        console.log("found", oneWeek.closeDatetime);
                        callback(oneWeek.closeDatetime);
                    }
                });
            }
            

            models.contestant = db.define('contestant', {
                name: 'text',
                codename: 'text'
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
                var contestantData = [];
                var num;
                this.find({}).each(function(contestant) {
                    models.bioStatistic.getStats(contestant.id, function(stats) {
                        models.bioQuestion.getQuestions(contestant.id, function(questions) {
                            contestantData.push({
                                id: contestant.id,
                                name: contestant.name,
                                codeName: contestant.codename,
                                stats: stats,
                                questions: questions
                            });
                            num--;
                            if (num == 0) {
                                callback(contestantData);
                            }
                        })
                    })
                }).count(function(count) {
                    num = count;
                });
            }


            models.contestant.fastGetContestantData = function(data, callback) {
                var finalData = [];
                var num;
                var me = this;
                models.bioStatistic.find({}, function(err, statistics) {
                    if (err) throw err;
                    for (var item in statistics) {
                        if (!finalData[item.contestant_id]) {
                            var oneStat = [];
                            oneStat.push({
                                name: item.name,
                                value: item.value
                            });
                            finalData[item.contestant_id] = {
                                id: item.contestant_id,
                                stats: oneStat
                            }
                        } else {
                            finalData[item.contestant_id].stats.push({
                                name: item.name,
                                value: item.value
                            });
                        }
                        
                    }
                    models.bioQuestion.find({}, function(err, questions) {
                        if (err) throw err;
                        for (var stat in statistics) {
                            if (!finalData[stat.contestant_id].questions) {
                                var oneQ = [];
                                oneQ.push({
                                    question: stat.question,
                                    answer: stat.answer
                                });
                                finalData[stat.contestant_id] = {
                                    questions: oneQ
                                }
                            } else {
                                finalData[stat.contestant_id].questions.push({
                                    question: stat.question,
                                    answer: stat.answer
                                });
                            }
                            
                        }

                        me.find({}, function(err, contestants) {
                            if (err) throw err;
                            for (var person in contestants) {
                                finalData[person.id].name = person.name;
                                finalData[person.id].codeName = person.codeName;
                            }
                            callback(finalData);
                        });
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
                    callback(_und.difference(allContestants, eliminated));
                });
            }

            // TODO
            models.contestant.selectContestant = function(userId, weekId, contestantId, callback) {
                //create new prediction and scoring opportunity
                var value = 1;
                var contestants = [contestantId];
                console.log("userId", userId);
                console.log("weekId", weekId);
                console.log("contestantId", contestantId);
                models.week.find({id : weekId}, function(err, theWeek) {
                    if (err) throw err;
                    models.prediction.getValueOfSelections(userId, theWeek.number, contestants, function(values) {
                        if (values.length == 1) {
                            value = values[0].multiplier + 1;
                        }
                        models.scoringOpportunity.create([{
                            name: "selection",
                            type: "NORMAL",
                            value: value,
                            weed_id: weekId
                        }], function(err, items) {
                            if (err) throw err;

                            models.prediction.create([{
                                createdDatetime: getSQLDateTime(new Date()),
                                user_id: userId,
                                scoringOpportunity_id: items[0].id,
                                contestant_id: contestantId
                            }], function (err, items) {
                                if (err) throw err;
                                callback(1);
                            });

                        });

                    });
                });

                
                
            }

            // TODO
            models.contestant.removeContestant = function(userId, weekId, contestandId, callback) {
                //delete scoring opportunity and prediction
                models.prediction.findByScoringOpportunity({ week_d: weekId, user_id : userId, contestant_id : contestantId }).remove(function (err) {
                    // TODO does this remove both entries?
                    if (err) throw err;
                    callback(1);
                });
            }

            models.elimination = db.define('elimination', {});
            models.elimination.hasOne('contestant', models.contestant);
            models.elimination.hasOne('week', models.week);
            

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
            });
            models.scoringOpportunity.hasOne('week', models.week, {reverse: 'scoringOpportunity'});

            models.prediction = db.define('prediction', {
                createdDatetime: 'date',
                user_id: 'number',
            });
            models.prediction.hasOne('user', models.user);
            models.prediction.hasOne('contestant', models.contestant);
            models.prediction.hasOne('scoringOpportunity', models.scoringOpportunity, {reverse: 'prediction'});

            models.prediction.getSelectionByWeek = function(userId, weekId, callback) {
                var selections = [];
                // TODO filter by user and week
                this.findByScoringOpportunity({week_id : weekId}).each(function(selection) {
                    if (selection.user_id == userId) {
                        scoringOpportunities.push(selection.scoringOpportunity_id);
                    }
                }).count(function(count) {
                    callback(selections);
                });
            }

            // TODO
            models.prediction.getValueOfSelections = function(userId, weekNum, ids, callback) {
                var values = [];
                this.findByScoringOpportunity({}).findByWeek({number : weekNum - 1}).each(function(selection) {
                    if (selection.user_id == userId) {
                        var index = _und.indexOf(ids, selection.contestant_id);
                        if (index > -1) {
                            values.push({
                                id: selection.contestant_id,
                                multiplier: selection.value
                            });
                        }
                    }
                }).count(function(count) {
                    callback(values);
                });
            }

            models.bioQuestion = db.define('bioQuestion', {
                question: 'text',
                answer: 'text',
            });
            models.bioQuestion.hasOne('contestant', models.contestant);

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
                value: 'text',
            });
            models.bioStatistic.hasOne('contestant', models.contestant);

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
                this.find({user_id: userId}, function(err, score) {
                    if (err) throw err;
                    callback(score);
                });
            }

        },
    });
}

function getConnectionUrl() {
    verifyEnv();
    return process.env.RDS_PROTOCOL + '://' + process.env.RDS_USERNAME + ':' + process.env.RDS_PASSWORD + '@' + process.env.RDS_HOSTNAME + '/' + process.env.RDS_DATABASE;
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