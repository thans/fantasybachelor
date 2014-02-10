var Database = require('../database.js');

module.exports.BioStatistic = Database.MySQL.Model.extend({
    tableName: 'bioStatistic',

    // Relations
    contestant: function() {
        return this.belongsTo(Database.Contestant);
    }

});

module.exports.BioStatistics = Database.MySQL.Collection.extend({
    model: module.exports.BioStatistic
});