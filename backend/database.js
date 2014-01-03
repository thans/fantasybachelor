var orm = require("orm");
var utils = require('./utils');

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
                this.exists({fbId: user.fbId}, function(err, exists) {
                    if (err) throw err;

                    if (exists) {
                        callback(100);
                    } else {
                        this.create({
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            fbId: user.fbId
                        }, function(err) {
                            if (err) throw err;
                            callback(100);
                        });
                    }
                })
            }
        }
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