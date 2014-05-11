var Database = require('../database.js');
var async = require('async');
var _ = require('underscore');

module.exports.User = Database.MySQL.Model.extend({
    tableName: 'user',

    // Relations
    predictions: function() {
        return this.hasMany(Database.Prediction);
    },
    userScore: function() {
        return this.hasOne(Database.UserScore);
    }

});

module.exports.Users = Database.MySQL.Collection.extend({
    model: module.exports.User
});

module.exports.User.login = function(userData, success, failure) {
    new Database.User(userData).fetch().then(function(user) {
        if (user) { // This user exists, so get their score
            Database.UserScore.getScore(user.id, function(score) {
                user.set('score', score);
                success(user.toJSON());
            }, failure);
        } else { // This user is new, create a new user
            new Database.User(userData).save().then(function(newUser) {
                Database.UserScore.getScore(newUser.id, function(score) {
                    newUser.set('score', score);
                    success(newUser.toJSON());
                }, failure);
            });
        }
    });
}

module.exports.User.getLeaderboard = function(success, failure) {
    new Database.Users().fetch().then(function(users) {
        async.each(users, function(user, callback) {
            new Database.UserScore.getScore(user.id, function(score) {
                user.set('score', score);
                callback();
            }, callback)
        }, function(err) {
            if (err) {
                failure(err);
            } else {
                success(_.sortBy(users.toArray(), function(user) {
                    return -user.get('score');
                }));
            }
        });
    });
}
