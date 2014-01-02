var orm = require("orm");

var User;
var Week;

orm.connect("mysql://root:hanssenLoeppky@aaqvcsr8g4sx50.cczz6d0xcspi.us-west-2.rds.amazonaws.com/fantasy_bachelor", function (err, db) {
  if (err) throw err;

    User = db.define("users", {
        first_name : String,
        last_name  : String,
        email      : String,
        fb_id      : Number
    }, {
        methods: {
            fullName: function () {
                return this.first_name + ' ' + this.last_name;
            }
        }
    });

    Week = db.define("weeks", {
    	name: String,
    	number: Number,
    	open_datetime: Date,
    	close_datetime: Date,
    }, {
    	methods: {
    		isCurrent: function() {
    			var today = new Date();
    			return today > this.open_datetime && today < this.close_datetime;
    		}
    	}
    });

    //createWeek("One", 1, new Date(), new Date(2014, 0, 5, 17, 0, 0, 0));

    console.log("login Tore: ");
	loginUser(726777167, "Tore", "Hanssen", "tkh93@comcast.net");
	console.log("login Mitch: ");
	loginUser(100001321532420, "Mitchell", "Loeppky", "mitchell@loeppky.com");

	console.log(getWeeks());
});


/*
description: Creates a new user if the given user doesn’t exist.
url: /loginUser
method: POST
body: { userId: 12345, firstName: ‘Mitchell’, lastName: ‘Loeppky’, email: ‘mitchell@loeppky.com’ }
response body: 
{ totalScore: 22 }
*/
function loginUser(fbId, firstName, lastName, email) {
    User.find({ fb_id: fbId }, function (err, people) {
    	if (err) {
    		throw err;
    	}
    	if (people.length == 1) {
    		console.log(getScore(people.fb_id));
    	} else {
    		console.log("0");
    		createUser(firstName, lastName, email, fbId)
    	}
    });
}

function createUser(firstName, lastName, email, fbId) {
	User.create([
	    {
	        first_name: firstName,
	        last_name: lastName,
	        email: email,
	        fb_id: fbId
	    }
	], function (err, items) {
	    // err - description of the error or null
	    // items - array of inserted items
	    if (err) {
	    	throw err;
	    }
	    return items.length;
	});
}

// TODO
function getScore(userId) {
	return 100;
}

/*
description: Fetches the name of all the weeks to create the tabs in the UI
url: /getWeeks()
method: GET
response body:
[
	{ id: 1, name: ‘Week 1’ },
	{ id: 2, name: ‘Week 2’ },
	{ id: 3, name: ‘Proposal’ }
]

*/

function createWeek(name, number, start, end) {
	console.log("start" + getSQLDateTime(start));
	console.log("end" + getSQLDateTime(end));
	Week.create([
	    {
	        name: name,
	        number: number,
	        open_datetime: getSQLDateTime(start),
	        close_datetime: getSQLDateTime(end)
	    }
	], function (err, items) {
	    // err - description of the error or null
	    // items - array of inserted items
	    if (err) {
	    	throw err;
	    }
	    return items.length;
	});
}

function getSQLDateTime(date) {
	return date.getUTCFullYear() + '-' +
	    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
	    ('00' + date.getUTCDate()).slice(-2) + ' ' + 
	    ('00' + date.getUTCHours()).slice(-2) + ':' + 
	    ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
	    ('00' + date.getUTCSeconds()).slice(-2);
}

function getWeeks() {
	var weeks = [];
	// TODO fix
    Week.find({}, function (err, people) {

    }).each(function(oneWeek) {
    	weeks[oneWeek.id] = oneWeek.name;
    });
    return weeks;
}

