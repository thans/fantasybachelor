var Database = require('../database.js');

module.exports.ScoringOpportunity = Database.MySQL.Model.extend({
    tableName: 'scoringOpportunity',

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

module.exports.ScoringOpportunities.getOpen = function(userId, weekId, success, failure) {
    new Database.Week({id: weekId}).load({scoringOpportunities: function(qb) {
        qb.whereNotExists(function() {
            this.from('prediction')
                .whereRaw('prediction.scoringOpportunity_id = scoringOpportunity.id')
                .whereRaw('prediction.user_id = ' + userId);
        });
    }}).then(function(week) {
            success(week.related('scoringOpportunities'));
        }, failure);
};