/**
 * An {@link Elimination} models a contestant not receiving a rose in a given week.
 * @type {exports}
 */
var Database = require('../database.js');
var Q = require('q');

module.exports.Elimination = Database.MySQL.Model.extend({
    tableName: 'eliminations',
    hasTimestamps : true,

    // Relations
    contestant: function() {
        return this.hasOne(Database.Contestant);
    },
    week: function() {
        return this.hasOne(Database.Week);
    }

});

module.exports.Eliminations = Database.MySQL.Collection.extend({
    model: module.exports.Elimination
});

// Create table if it does not exist.
var knex = Database.MySQL.knex;
var tableName = module.exports.Elimination.prototype.tableName;
knex.schema.hasTable(tableName).then(function(tableExists) {
    if (tableExists) { return; }
    knex.schema.createTable(tableName, function(table) {
        table.increments('id').primary();
        table.integer('contestant_id')
            .unsigned()
            .references('id')
            .inTable('contestants')
            .notNullable();
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