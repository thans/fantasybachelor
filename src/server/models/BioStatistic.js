/**
 * A {@link BioStatistic} models a stat or piece of info about a contestant including the label and value.
 * An example would be Age: 24.
 */
var Database = require('../database.js');
var Q = require('q');

module.exports.BioStatistic = Database.MySQL.Model.extend({
    tableName: 'bioStatistics',
    hasTimestamps : true,

    // Relations
    contestant: function() {
        return this.belongsTo(Database.Contestant);
    }

});

module.exports.BioStatistics = Database.MySQL.Collection.extend({
    model: module.exports.BioStatistic
});

// Create table if it does not exist.
var knex = Database.MySQL.knex;
var tableName = module.exports.BioStatistic.prototype.tableName;
knex.schema.hasTable(tableName).then(function(tableExists) {
    if (tableExists) { return; }
    knex.schema.createTable(tableName, function(table) {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
        table.string('value', 255).notNullable();
        table.integer('contestant_id')
            .unsigned()
            .references('id')
            .inTable('contestants')
            .notNullable();
        table.timestamps();
    }).then(function() {
        console.log('Created ' + tableName + ' table');
    });
});