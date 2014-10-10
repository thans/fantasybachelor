/**
 * A {@link BioQuestion} models a question and answer for a contestant's bio.
 */
var Database = require('../database.js');
var Q = require('q');

module.exports.BioQuestion = Database.MySQL.Model.extend({
    tableName: 'bioQuestions',
    hasTimestamps : true,

    // Relations
    contestant: function() {
        return this.belongsTo(Database.Contestant);
    }

});

module.exports.BioQuestions = Database.MySQL.Collection.extend({
    model: module.exports.BioQuestion
});

// Create table if it does not exist.
var knex = Database.MySQL.knex;
var tableName = module.exports.BioQuestion.prototype.tableName;
knex.schema.hasTable(tableName).then(function(tableExists) {
    if (tableExists) { return; }
    knex.schema.createTable(tableName, function(table) {
        table.increments('id').primary();
        table.string('question', 255).notNullable();
        table.text('answer').notNullable();
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