/*
loginUser(userId, firstName, lastName, email) - Create a new user if needed, return user’s total score
getWeeks() - Just need all of the week ids and names
getContestants() - Need all of the contestant’s details including the bio (but not the predictions)
getWeek(seekId, userId) - Need the week details including the scoring opportunities, the current user’s predictions, the non-eliminated women ids, the multipliers, and the eliminated women ids (if the week is in the past).
chooseContestant(contestantId, userId) - Create new prediction
rejectContestant(contestantId, userId) - Remove a prediction
*/

// var AWS = require('aws-sdk');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'aaqvcsr8g4sx50.cczz6d0xcspi.us-west-2.rds.amazonaws.com;dbname=fantasy_bachelor',
  user     : 'root',
  password : 'hanssenLoeppky',
  port 	   : '3306'
});


// Check to see if the user exists in the db
// if not, create a new user
// return the user's total score

function loginUser(fbId, firstName, lastName, email) {
	var queryUserExists = "SELECT id FROM users WHERE fb_id = " + fbId;
	connection.query(queryUserExists, function(err, rows, fields) {
        
        if (err) {
            console.log(rows + "===" + rows.length)
        	console.log('Connection result error '+err);
        	return -1;
        }
        console.log('no of records is '+rows.length);
        for (var row in rows) {
        	console.log(row);
        }

        if (rows.length == 0) {
        	//create user, return 0;
        	return 0;
        } else {
        	return calculateScore(fbId);
        }
        //response.end();
    }); 
}

function calculateScore(fbId) {
	return 10;
}

loginUser(100, "tore", "hanssen", "toreh@uw.edu");