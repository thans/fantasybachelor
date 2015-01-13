/**
 * A {@link ScoringOpportunity} models the ways that a user can score on a given week.
 * In a typical week, there are six scoring opportunities each worth 1 point: 1 for each of the 6 contestants
 * the user can predict will make it to the next week. A {@link Prediction} connects a
 * {@link User}, {@link Contestant}, and {@link ScoringOpportunity}.
 * @type {exports}
 */
var Database = require('../database.js');
var Q = require('q');

module.exports.ScoringOpportunity = Database.MySQL.Model.extend({
    tableName: 'scoringOpportunities',
    hasTimestamps : true,

    // Relations
    week: function() {
        return this.belongsTo(Database.Week);
    },
    predictions: function() {
        return this.hasMany(Database.Prediction);
    }
});

module.exports.ScoringOpportunities = Database.MySQL.Collection.extend({
    model: module.exports.ScoringOpportunity
});

/**
 * Gets all of the remaining {@link ScoringOpportunities} for the given {@link User} and {@link Week}.
 * @param userId The ID of the {@link User}
 * @param weekId The ID of the {@link Week}
 * @returns {Promise}
 */
module.exports.ScoringOpportunities.getOpen = function(user, weekId) {
    var deferred = Q.defer();
    new Database.Week({id: weekId}).load({scoringOpportunities: function(qb) {
        qb.whereNotExists(function() {
            this.from('predictions')
                .whereRaw('predictions.scoringOpportunity_id = scoringOpportunities.id')
                .whereRaw('predictions.user_id = ' + user.get('id'));
        });
    }}).then(function(week) {
        deferred.resolve(week.related('scoringOpportunities'));
    }, deferred.reject);
    return deferred.promise;
};

// Create table if it does not exist.
var knex = Database.MySQL.knex;
var tableName = module.exports.ScoringOpportunity.prototype.tableName;
knex.schema.hasTable(tableName).then(function(tableExists) {
    if (tableExists) { return; }
    knex.schema.createTable(tableName, function(table) {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
        table.enu('type', ['NORMAL', 'BONUS']).notNullable();
        table.integer('value').notNullable();
        table.integer('week_id')
            .unsigned()
            .references('id')
            .inTable('weeks')
            .notNullable();
        table.timestamps();
    }).then(function() {
        console.log('Created ' + tableName + ' table');
    });
});