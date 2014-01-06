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
                    },
                    getScore: function(callback) {
                        callback(100);
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
                        callback(users[0]);
                    } else {
                        thiz.create({
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            fbId: user.fbId
                        }, function(err, user) {
                            if (err) throw err;
                            // TODO
                            user.score = 100;
                            callback(user);
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
                var contestants = [contestandId];
                models.week.find({id : weekId}, function(err, theWeek) {
                    if (err) throw err;
                    models.prediction.getValueOfSelections(userId, theWeek.number, contestants, function(values) {
                        if (values.length == 1) {
                            value = values[0].multiplier + 1;
                        }
                        models.scoringOpportunity.create([{
                            name: "selection",
                            type: "NORMAL",
                            value: ),
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
            models.prediction.hasOne('scoringOpportunity', models.scoringOpportunity, {reverse: 'prediction');

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