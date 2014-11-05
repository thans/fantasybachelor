/**
 * A {@link Contestant} is a participant on a show. This includes both the contestant seeking a
 * spouse and the contestants being eliminated.
 * @type {exports}
 */
var Database = require('../database.js');
var Q = require('q');

var Contestant = module.exports.Contestant = Database.MySQL.Model.extend({
    tableName: 'contestants',
    hasTimestamps : true,

    // Relations
    bioQuestions: function() {
        return this.hasMany(Database.BioQuestion);
    },
    bioStatistics: function() {
        return this.hasMany(Database.BioStatistic);
    },
    elimination: function() {
        return this.belongsTo(Database.Elimination);
    },
    eliminationWeek: function() {
        return this.belongsTo(Database.Week).through(Database.Elimination)
    }

});

var Contestants = module.exports.Contestants = Database.MySQL.Collection.extend({
    model: Contestant
});

/**
 * @returns {Array} All of the contestant data including their bio stats and questions.
 */
Contestants.getAll = function() {
    var deferred = Q.defer();
    new Contestants().fetch({withRelated: ['bioStatistics', 'bioQuestions']}).then(function(contestants) {
        deferred.resolve(contestants.toJSON());
    }, deferred.reject);
    return deferred.promise;
};

// Create table if it does not exist.
var knex = Database.MySQL.knex;
var tableName = module.exports.Contestant.prototype.tableName;
knex.schema.hasTable(tableName).then(function(tableExists) {
    if (tableExists) { return; }
    knex.schema.createTable(tableName, function(table) {
        table.increments('id').primary();
        table.string('name', 63).notNullable();
        table.string('codename', 63).notNullable();
        table.timestamps();
    }).then(function() {
        console.log('Created ' + tableName + ' table');
    });
});