var orm = require("orm");
var utils = require('./utils');
var _und = require("underscore");
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
                        users[0].score = 100;
                        models.userScores.getScore(users[0].id, function(userScore) {
                            users[0].score = userScore.score;
                            callback(users[0]);
                        })
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
                                    user.score = scores[0].score;
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
                        i++;
                        if (i < users.length) {
                            models.userScores.getScore(users[i].id, function(score) {
                                users[i].score = score;
                                next();
                            })
                        } else {
                            callback(users);
                        }
                    }
                });
            }

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
                            models.prediction.getValueOfAll(user, item.number, remaining, function(selectionValues) {
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
                                        numberOfSelections: Math.min(remaining.length - 1, 6)
                                    });
                                    num--;
                                    if (num == 0) {
                                        weekData.sort(function(a, b) {
                                            if (a.id < b.id) return -1;
                                            if (a.id > b.id) return 1;
                                            return 0;
                                        });
                                        callback(weekData);
                                    }
                                });
                            });
                            
                        });
                        
                    });

                }).count(function(count) {
                    num = count;
                    
                });          
            }

            models.week.getEndOfCurrentWeek = function(callback) {
                var today = new Date();
                models.week.find({}).each(function(oneWeek) {
                    if (new Date(oneWeek.openDatetime) < today && new Date(oneWeek.closeDatetime) > today) {
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
                var contestants = [parseInt(contestantId)];
                models.week.find({id : weekId}, function(err, theWeek) {
                    if (err) throw err;
                    models.prediction.getValueOfSelections(userId, theWeek[0].number, contestants, function(values) {
                        if (values.length == 1) {
                            value = values[0].multiplier + 1;
                        }
                        models.scoringOpportunity.create([{
                            name: "selection",
                            type: "NORMAL",
                            value: value,
                            week_id: weekId
                        }], function(err, items) {
                            if (err) throw err;
                            models.prediction.create([{
                                createdDatetime: getSQLDateTime(new Date()),
                                user_id: userId,
                                scoringopportunity_id: items[0].id,
                                contestant_id: contestantId
                            }], function (err, items) {
                                if (err) throw err;
                                callback(1);
                            });

                        });

                    });
                });
            }

            models.contestant.removeContestant = function(userId, weekId, contestantId, callback) {
                //delete scoring opportunity and prediction
                models.prediction.find({contestant_id : contestantId, user_id : userId }).findByScoringOpportunity({ week_id: weekId }).each(function(oneOpp) {
                    var scoreToDelete = oneOpp.scoringopportunity_id;
                    oneOpp.remove(function(err) {
                        if (err) throw err;
                        models.scoringOpportunity.find({id: scoreToDelete}, function(err, score) {
                            if (err) throw err;
                            score[0].remove();
                        });
                    });
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
            });
            models.prediction.hasOne('user', models.user);
            models.prediction.hasOne('contestant', models.contestant);
            models.prediction.hasOne('scoringOpportunity', models.scoringOpportunity);

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
                    if (_und.indexOf(ids, predict.contestant_id) != -1) {
                        opportunities.push(predict.scoringopportunity_id);
                        contestant.push(predict.contestant_id);
                    }
                }).count(function(count) {
                    models.scoringOpportunity.findByWeek({number : weekNum - 1}).each(function(selection) {
                        var index = _und.indexOf(opportunities, parseInt(selection.id));
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
                    if (_und.indexOf(ids, predict.contestant_id) != -1) {
                        opportunities.push(predict.scoringopportunity_id);
                        contestant.push(predict.contestant_id);
                    }
                }).count(function(count) {
                    models.scoringOpportunity.findByWeek({number : weekNum - 1}).each(function(selection) {
                        var index = _und.indexOf(opportunities, parseInt(selection.id));
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
                this.find({user_id: userId}, function(err, scores) {
                    if (err) throw err;
                    console.log('score ' + JSON.stringify(scores));
                    if (scores.length < 0 || moment().isAfter(scores[0].expiresTimestamp)){
                        models.week.getWeeks(userId, function(weeks) {
                            _und.each(weeks, function(week) {
                                if (moment().isAfter(week.scoresAvailableTime)) {
                                    _.each(week.selectedContestants, function(selectedContestant) {
                                        if (!_und.contains(week.eliminatedContestants, selectedContestant)) {
                                            score += _und.find(week.remainingContestants, function(remainingContestant) { remainingContestant.id === selectedContestant.id }).multiplier;
                                        }
                                    })
                                }
                            })
                        })
                    } else {
                        callback(scores[0]);
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