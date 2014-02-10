var Database = require('../database.js');

module.exports.Prediction = Database.MySQL.Model.extend({
    tableName: 'prediction',

    // Relations
    user: function() {
        return this.belongsTo(Database.User);
    },
    contestant: function() {
        return this.hasOne(Database.Contestant);
    }
});

module.exports.Predictions = Database.MySQL.Collection.extend({
    model: module.exports.Prediction
});

module.exports.Predictions.removePrediction = function(userId, weekId, contestantId, success, failure) {
    new Database.Week({id: weekId})
        .predictions()
        .query({where: {user_id: userId, contestant_id: contestantId}})
        .fetchOne()
        .then(function(prediction) {
            prediction.destroy().then(function() {success()}, failure);
        }, failure);
};

module.exports.Predictions.makePrediction = function(userId, weekId, contestantId, success, failure) {

    // Verify week is open
    Database.Weeks.isSelectionOpen(weekId, function(selectionOpen) {
        if (!selectionOpen) {
            failure('Sorry, but selection for this week is closed.');
        } else {

            // Verify contestant hasn't already been picked
            Database.Prediction.hasBeenPredicted(userId, weekId, contestantId, function(hasBeenPredicted) {
                if (hasBeenPredicted) {
                    failure('Sorry, but you have already selected this contestant');
                } else {

                    // Find open scoringOpportunities
                    Database.ScoringOpportunities.getOpen(userId, weekId, function(scoringOpportunities) {
                        if (scoringOpportunities.size() == 0) {
                            failure('You can\'t make any more picks this week. Sorry.');
                        } else {

                            // Create new pick
                            new Database.Prediction({
                                user_id: userId,
                                scoringOpportunity_id: scoringOpportunities.at(0).get('id'),
                                contestant_id: contestantId,
                                createdDatetime: new Date()
                            }).save().then(success, failure)
                        }
                    }, failure);
                }
            }, failure);
        }
    }, failure);
};

module.exports.Prediction.hasBeenPredicted = function(userId, weekId, contestantId, success, failure) {
    new Database.Week({id: weekId})
        .predictions()
        .query({where: {user_id: userId, contestant_id: contestantId}})
        .fetchOne()
        .then(function(prediction) {
            success(prediction !== undefined && prediction !== null);
        }, failure);
};