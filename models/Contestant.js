var Database = require('../database.js');

var Contestant = module.exports.Contestant = Database.MySQL.Model.extend({
    tableName: 'contestant',

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

Contestants.getAll = function(success, failure) {
    new Contestants().fetch({withRelated: ['bioStatistics', 'bioQuestions']}).then(function(contestants) {
        success(contestants.toJSON());
    }, failure);
}