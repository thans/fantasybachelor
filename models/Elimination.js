var Database = require('../database.js');

module.exports.Elimination = Database.MySQL.Model.extend({
    tableName: 'elimination',

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