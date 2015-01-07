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
 * Creates a new user with the given user data if the user does not already exist.
 * @param userData
 * return {@link Promise} with the JSON version of the {@link User} and the user's score.
 */
module.exports.User.login = function(userData) {
    var deferred = Q.defer();
    if (!userData || !userData.firstName || !userData.lastName || !userData.service || !userData.id) {
        deferred.reject('Missing userData');
        return;
    }
    new Database.User({
        authenticationService : userData.service,
        authenticationServiceId : userData.id
    }).fetch().then(function(user) {
        var userSaveDeferred;
        if (user) { // This user exists, make sure info is up to date
            user.set('firstName', userData.firstName);
            user.set('lastName', userData.lastName);
            user.set('email', userData.email);
            userSaveDeferred = user.save();
        } else { // This user is new, create a new user
            userSaveDeferred = new Database.User({
                firstName : userData.firstName,
                lastName : userData.lastName,
                authenticationService : userData.service,
                authenticationServiceId : userData.id,
                email : userData.email
            }).save();
        }
        userSaveDeferred.then(function(user) {
            Database.UserScore.getScore(user.id).then(function(score) {
                user.set('score', score);
                deferred.resolve(user.toJSON());
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
module.exports.User.setAlias = function(userId, alias) {
    var deferred = Q.defer();
    if (!userId || !alias) {
        deferred.reject('Missing userId or alias');
        return;
    }
    new Database.User({ id : userId }).fetch().then(function(user) {
        if (!user) {
            deferred.reject('User not found');
            return;
        }

        user.set('alias', alias);
        user.save().then(deferred.resolve, deferred.reject);
    }, deferred.reject);
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
        table.string('firstName', 63).notNullable();
        table.string('lastName', 63).notNullable();
        table.string('email', 63).nullable();
        table.enu('authenticationService', ['FACEBOOK', 'GOOGLE_PLUS']).notNullable();
        table.string('authenticationServiceId', 63).notNullable();
        table.string('alias', 63).nullable();
        table.timestamps();
    }).then(function() {
        console.log('Created ' + tableName + ' table');
    });
});
