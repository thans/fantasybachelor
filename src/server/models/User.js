/**
 * A {@link User} models a user of the website. Users have scores and can login and make predictions.
 */
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

 */
module.exports.User.find = function(userId) {
    var deferred = Q.defer();
    if (!userId) {
        deferred.reject('Missing userId');
        return;
    }
    new Database.User({
        id : userId
    }).fetch().then(function(user) {
        if (!user) {
            deferred.reject();
            return;
        }
        Database.UserScore.getScore(user.get('id')).then(function(score) {
            user.set('score', score);
            deferred.resolve(user);
        }).fail(deferred.reject);
    });

    return deferred.promise;
};

/**
 * Creates a new user with the given user data if the user does not already exist.
 * @param userData
 * return {@link Promise} with the JSON version of the {@link User} and the user's score.
 */
module.exports.User.login = function(userData) {
    var deferred = Q.defer();
    if (!userData.authenticationService) {
        deferred.reject('Missing authenticationService');
        return;
    }
    if (!userData.authenticationServiceId) {
        deferred.reject('Missing authenticationServiceId');
        return;
    }
    new Database.User({
        authenticationService : userData.authenticationService,
        authenticationServiceId : userData.authenticationServiceId
    }).fetch().then(function(user) {
        var userSaveDeferred;
        if (user) { // This user exists, make sure info is up to date
            user.set('firstName', userData.firstName);
            user.set('lastName', userData.lastName);
            user.set('email', userData.email);
            user.set('profilePicture', userData.profilePicture);
            user.set('userName', userData.userName);
            userSaveDeferred = user.save();
        } else { // This user is new, create a new user
            userSaveDeferred = new Database.User({
                firstName : userData.firstName,
                lastName : userData.lastName,
                authenticationService : userData.authenticationService,
                authenticationServiceId : userData.authenticationServiceId,
                email : userData.email,
                userName : userData.userName,
                profilePicture : userData.profilePicture
            }).save();
        }
        userSaveDeferred.then(function(user) {
            Database.UserScore.getScore(user.id).then(function(score) {
                user.set('score', score);
                deferred.resolve(user);
            }).fail(deferred.reject);
        });
    });
    return deferred.promise;
};

/**
 * Sets user's alias
 * @param userId The ID of the user to update.
 * @param alias The new alias for the user.
 * return {@link Promise}
 */
module.exports.User.setAlias = function(user, alias) {
    var deferred = Q.defer();
    if (!user || !alias) {
        deferred.reject('Missing user or alias');
        return;
    }
    user.set('alias', alias);
    user.save().then(deferred.resolve, deferred.reject);
    return deferred.promise;
};

/**
 * Calculates and responds with the scores of every {@link User}.
 * @returns {Promise}
 */
module.exports.User.getLeaderboard = function() {
    var deferred = Q.defer();
    new Database.Users().fetch().then(function(users) {
        async.each(users, function(user, callback) {
            new Database.UserScore.getScore(user.id).then(function(score) {
                user.set('score', score);
                callback();
            }).fail(callback);
        }, function(err) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(_.sortBy(users.toArray(), function(user) {
                    return -user.get('score');
                }));
            }
        });
    });
    return deferred.promise;
};

// Create table if it does not exist.
var knex = Database.MySQL.knex;
var tableName = module.exports.User.prototype.tableName;
knex.schema.hasTable(tableName).then(function(tableExists) {
    if (tableExists) { return; }
    knex.schema.createTable(tableName, function(table) {
        table.increments('id').primary();
        table.string('firstName', 63).nullable();
        table.string('lastName', 63).nullable();
        table.string('userName', 63).nullable();
        table.string('profilePicture', 511).nullable();
        table.string('email', 63).nullable();
        table.enu('authenticationService', ['FACEBOOK', 'GOOGLE_PLUS', 'TWITTER', 'REDDIT']).notNullable();
        table.string('authenticationServiceId', 63).notNullable();
        table.string('alias', 63).nullable();
        table.integer('score').nullable();
        table.timestamps();
    }).then(function() {
        console.log('Created ' + tableName + ' table');
    });
});
