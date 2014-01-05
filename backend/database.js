var orm = require("orm");
var utils = require('./utils');
var _und = require("./underscore-min");
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
            models.week.getWeeks = function(userz, callback) {
                console.log('Getting week information');
                var thiz = this;
                var weekData = [];
                var num;
                var user = 1; //TODO need the user to get their predictions
                this.find({}).each(function(item) {
                    models.elimination.getEliminatedContestantsByWeek(item.id, function(eliminated) {
                        models.contestant.getRemainingContestants(eliminated, function(remaining) {
                            var remainderWithMult = [];
                            _und.each(remaining, function(oneContestant {
                                remainderWithMult.push({
                                    id: oneContestant,
                                    multiplier: 1
                                });
                            });
                            models.prediction.getSelectionByWeek(user, item.id, function(selections) {
                                weekData.push({
                                    id: item.id,
                                    name: item.name,
                                    openTime: item.openDatetime,
                                    closeTime: item.closeDatetime,
                                    scoresAvailableTime: item.scoresAvailableDatetime,
                                    remainingContestants: remaining, 
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
                                codeName: contestant.codeName,
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
            models.scoringOpportunity.hasOne('week', models.week);

            /*models.scoringOpportunity.getWeeklyScoringOpportunities = function(opportinities, weekId, callback) {
                var selections = [];
                var scoringOpportunities = [];
                this.find({}).each(function(opp) {
                    if (_und.indexOf(opportunities, opp.id) != -1 && opp.week_id == weekId) {
                        selections.push(opp.)
                    }
                    scoringOpportunities.push(selection.scoringOpportunity_id);
                }).count(function(count) {
                    console.log("eliminated " + eliminations);
                    callback(eliminations);
                });
            }*/


            models.prediction = db.define('prediction', {
                createdDatetime: 'date',
                user_id: 'number',
            });
            models.prediction.hasOne('contestant', models.contestant);
            models.prediction.hasOne('scoringOpportunity', models.scoringOpportunity);

            models.prediction.getSelectionByWeek = function(userId, weekId, callback) {
                var selections = [];
                // TODO filter by user and week
                this.findByScoringOpportunity({}).each(function(selection) {
                    scoringOpportunities.push(selection.scoringOpportunity_id);
                }).count(function(count) {
                    callback(selections);
                });
            }


            models.bioQuestion = db.define('bioQuestion', {
                question: 'text',
                answer: 'text',
            });
            models.bioQuestion.hasOne('contestant', models.contestant);

            models.bioQuestion.getQuestions = function(contestantId, callback) {
                var bioSurvey = [];
                // TODO filter by user and week
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
                // TODO filter by user and week
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

//
//var User;
//var Week;
//
//orm.connect(getConnectionUrl(), function (err, db) {
//  if (err) throw err;
//
//    User = db.define("users", {
//        first_name : String,
//        last_name  : String,
//        email      : String,
//        fb_id      : Number
//    }, {
//        methods: {
//            fullName: function () {
//                return this.first_name + ' ' + this.last_name;
//            }
//        }
//    });
//
//    Week = db.define("weeks", {
//    	name: String,
//    	number: Number,
//    	open_datetime: Date,
//    	close_datetime: Date,
//    }, {
//    	methods: {
//    		isCurrent: function() {
//    			var today = new Date();
//    			return today > this.open_datetime && today < this.close_datetime;
//    		}
//    	}
//    });
//
//    //createWeek("One", 1, new Date(), new Date(2014, 0, 5, 17, 0, 0, 0));
//
//    console.log("login Tore: ");
//	loginUser(726777167, "Tore", "Hanssen", "tkh93@comcast.net");
//	console.log("login Mitch: ");
//	loginUser(100001321532420, "Mitchell", "Loeppky", "mitchell@loeppky.com");
//
//	//console.log(getWeeks());
//});
//
//
///*
//description: Creates a new user if the given user doesn’t exist.
//url: /loginUser
//method: POST
//body: { userId: 12345, firstName: ‘Mitchell’, lastName: ‘Loeppky’, email: ‘mitchell@loeppky.com’ }
//response body:
//{ totalScore: 22 }
//*/
//function loginUser(fbId, firstName, lastName, email) {
//    User.find({ fb_id: fbId }, function (err, people) {
//    	if (err) {
//    		throw err;
//    	}
//    	if (people.length == 1) {
//    		console.log(getScore(people.fb_id));
//    	} else {
//    		console.log("0");
//    		createUser(firstName, lastName, email, fbId)
//    	}
//    });
//}
//
//function createUser(firstName, lastName, email, fbId) {
//	User.create([
//	    {
//	        first_name: firstName,
//	        last_name: lastName,
//	        email: email,
//	        fb_id: fbId
//	    }
//	], function (err, items) {
//	    // err - description of the error or null
//	    // items - array of inserted items
//	    if (err) {
//	    	throw err;
//	    }
//	    return items.length;
//	});
//}
//
//// TODO
//function getScore(userId) {
//	return 100;
//}
//
///*
//description: Fetches the name of all the weeks to create the tabs in the UI
//url: /getWeeks()
//method: GET
//response body:
//[
//	{ id: 1, name: ‘Week 1’ },
//	{ id: 2, name: ‘Week 2’ },
//	{ id: 3, name: ‘Proposal’ }
//]
//
//*/
//
//function createWeek(name, number, start, end) {
//	console.log("start" + getSQLDateTime(start));
//	console.log("end" + getSQLDateTime(end));
//	Week.create([
//	    {
//	        name: name,
//	        number: number,
//	        open_datetime: getSQLDateTime(start),
//	        close_datetime: getSQLDateTime(end)
//	    }
//	], function (err, items) {
//	    // err - description of the error or null
//	    // items - array of inserted items
//	    if (err) {
//	    	throw err;
//	    }
//	    return items.length;
//	});
//}
//
//function getSQLDateTime(date) {
//	return date.getUTCFullYear() + '-' +
//	    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
//	    ('00' + date.getUTCDate()).slice(-2) + ' ' +
//	    ('00' + date.getUTCHours()).slice(-2) + ':' +
//	    ('00' + date.getUTCMinutes()).slice(-2) + ':' +
//	    ('00' + date.getUTCSeconds()).slice(-2);
//}
//
//function getWeeks() {
//	var weeks = [];
//	// TODO fix
//    Week.find({}, function (err, people) {
//
//    }).each(function(oneWeek) {
//    	weeks[oneWeek.id] = oneWeek.name;
//    });
//    return weeks;
//}

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

function verifyEnv() {
    utils.verifyEnvVar('RDS_DATABASE');
    utils.verifyEnvVar('RDS_HOSTNAME');
    utils.verifyEnvVar('RDS_PORT');
    utils.verifyEnvVar('RDS_USERNAME');
    utils.verifyEnvVar('RDS_PASSWORD');
}