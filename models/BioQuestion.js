var Database = require('../database.js');

module.exports.BioQuestion = Database.MySQL.Model.extend({
    tableName: 'bioQuestion',

    // Relations
    contestant: function() {
        return this.belongsTo(Database.Contestant);
    }

});

module.exports.BioQuestions = Database.MySQL.Collection.extend({
    model: module.exports.BioQuestion
});