var Database = require('../database.js');
var async = require('async');
var _ = require('underscore');
var Q = require('q');

module.exports.User = Database.MySQL.Model.extend({
    tableName : 'users',

    hasTimestamps : true,

    // Relations
    predictions : function() {
        return this.hasMany(Database.Prediction);
    },
    userScore : function() {
        return this.hasOne(Database.UserScore);
    }

});

module.exports.Users = Database.MySQL.Collection.extend({
    model: module.exports.User
});

/**
 * Creates a new user with the given user data if the user does not already exist.
 * @param userData
 * return {@link Promise} with the JSON version of the {@link User} and the user's score.
 * TODO: Add other logins https://github.com/thans/fantasybachelor/issues/7
 */
module.exports.User.login = function(userData) {
    userData = {
        firstName : userData.firstName,
        lastName : userData.lastName,
        authenticationService : 'facebook',
        authenticationServiceId : userData.fbId
    };
    var deferred = Q.defer();
    new Database.User(userData).fetch().then(function(user) {
        if (user) { // This user exists, so get their score
            Database.UserScore.getScore(user.id, function(score) {
                user.set('score', score);
                deferred.resolve(user.toJSON());
            }, deferred.reject);
        } else { // This user is new, create a new user
            new Database.User(userData).save().then(function(newUser) {
                Database.UserScore.getScore(newUser.id, function(score) {
                    newUser.set('score', score);
                    deferred.resolve(user.toJSON());
                }, deferred.reject);
            });
        }
    });
    return deferred.promise;
};

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
};

// Create table if it does not exist.
var knex = Database.MySQL.knex;
var tableName = module.exports.User.prototype.tableName;
knex.schema.hasTable(tableName).then(function(tableExists) {
    if (tableExists) { return; }
    knex.schema.createTable(tableName, function(table) {
        table.increments('id').primary();
        table.string('firstName', 63).notNullable();
        table.string('lastName', 63).notNullable();
        table.enu('authenticationService', ['facebook', 'amazon', 'google']).notNullable();
        table.bigInteger('authenticationServiceId').notNullable();
        table.string('alias', 63).nullable();
        table.timestamps();
    }).then(function() {
        console.log('Created ' + tableName + ' table');
    });
});
