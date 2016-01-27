app.factory('contestantFactory', ['$rootScope', 'SEASON', 'backendFactory', function($rootScope, SEASON, backendFactory) {
    var contestantFactory = {};

    contestantFactory.loadContestants = function() {
        backendFactory.getContestants().then(function(contestants) {
            console.log(contestants);
            contestantFactory.contestants = contestants;
        });
    };

    $rootScope.$watchCollection(function() { return contestantFactory.contestants }, function(contestants) {
        if (!contestants) { return; }
        _.each(contestants, function(contestant) {
            contestant.stats = {};
            _.each(contestant.roundResults, function(roundResult) {
                _.each(roundResult, function(roleResult, roleId) {
                    if (!contestant.stats[roleId]) {
                        contestant.stats[roleId] = {
                            occurrences : 0
                        }
                    }
                    if (!roleResult || !roleResult.occurrences) { return; }
                    contestant.stats[roleId].occurrences += roleResult.occurrences;
                });
            });
        });
        console.log(contestants);
    });

    contestantFactory.findContestantById = function(id) {
        if (!contestantFactory.contestants) { return; }
        return _.find(contestantFactory.contestants, {id : id});
    };

    return contestantFactory;
}]);
