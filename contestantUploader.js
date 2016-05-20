process.env.AWS_PROFILE = 'fantasy-bach';

var fs = require('fs');
var async = require('async');
var AWS = require('aws-sdk');
AWS.config.update({ region : 'us-east-1' });
var document = new AWS.DynamoDB.DocumentClient();

var DIR_NAME = 'build/contestantData/';

fs.readdir(DIR_NAME, function(err, fileNames) {
    if (err) {
        console.log(err);
        return;
    }
    async.eachSeries(fileNames, function(filename, callback) {
        fs.readFile(DIR_NAME + filename, 'utf-8', function(err, content) {
            if (err) {
                console.log(err);
                return;
            }
            var contestantName = filename.substring(0, filename.indexOf('.'));
            var contestantData = JSON.parse(content);

            document.put({
                TableName : 'fantasybach-dev-contestants',
                Item : contestantData
            }, function(err) {
                if (err) { return console.log(err); }
                callback();
            })
        });
    }, function(err) {
        if (err) { return console.log(err); }
    });
});