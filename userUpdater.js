process.env.AWS_PROFILE = 'fantasy-bach';
process.env.USERS_TABLE = 'fantasybach-dev-users';

var seasonId = 'season:HyfVRTasf';

var fs = require('fs');
var async = require('async');
var _ = require('lodash');
var AWS = require('aws-sdk');
AWS.config.update({ region : 'us-east-1' });
var dynamodbDoc = new AWS.DynamoDB.DocumentClient();

var scanUsers = function(callback) {
    return _scanUsers(null, callback);
};

var _scanUsers = function(startKey, callback) {
    console.log('Scanning with key: ' + startKey);
    var params = startKey ? { ExclusiveStartKey : startKey } : {};
    return dynamodbDoc.scan(_.assign(params, {
        TableName : process.env.USERS_TABLE,
        ProjectionExpression : '#id',
        ExpressionAttributeNames : {
            '#id' : 'id'
        }
    }), function(err, data) {
        if (err) { callback(err); }
        console.log('Last Evaluated Key: ' + data.LastEvaluatedKey);
        if (data.LastEvaluatedKey) {
            _scanUsers(data.LastEvaluatedKey, callback);
            return callback(null, data.Items, false);
        }
        callback(null, data.Items, true);
    });
};

var updateUser = function(userId, callback) {
    var roundIds = ['round:BkrNPKWAjz', 'round:H1UNPFZAsM', 'round:ryo4DtZRjM', 'round:rk3NwFb0sM', 'round:B1aEPFZAoM', 'round:r1C4wtb0of', 'round:rJ1Swtb0of', 'round:ByerDtZAiz', 'round:rkZrvY-0sM', 'round:HJGSvt-RsG' ];
    var scores = _.assign({ score : 0 }, _.reduce(roundIds, function(result, roundId) {
        result[roundId] = 0;
        return result;
    }, {}));
    var picks = _.reduce(roundIds, function(result, roundId) {
        result[roundId] = {};
        return result;
    }, {});
    var leagues = [];
    dynamodbDoc.update({
        TableName : process.env.USERS_TABLE,
        Key : { id : userId },
        UpdateExpression : 'SET #scores.#seasonId=:scores, #picks.#seasonId=:picks, #leagues.#seasonId=:leagues',
        ExpressionAttributeNames : {
            '#picks' : 'picks',
            '#scores' : 'scores',
            '#leagues' : 'leagues',
            '#seasonId' : seasonId
        },
        ExpressionAttributeValues : {
            ':scores' : scores,
            ':picks' : picks,
            ':leagues' : leagues
        }
    }, callback);
};

scanUsers(function(err, users, lastGroup) {
    if (err) { return done(err); }
    console.log('Got ' + users.length + ' users');

    async.eachLimit(users, 8, function(user, callback) {
        updateUser(user.id, callback);
    }, function(err) {
        console.log(err);
    });
});