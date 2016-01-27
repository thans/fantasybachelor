app.factory('contestantFactory', ['$rootScope', 'SEASON', 'backendFactory', function($rootScope, SEASON, backendFactory) {
    var contestantFactory = {};

    contestantFactory.loadContestants = function() {
        backendFactory.getContestants().then(function(contestants) {
            console.log(contestants);
            contestantFactory.contestants = contestants;
        });
    });

    contestantFactory.findContestantById = function(id) {
        if (!contestantFactory.contestants) { return; }
        return _.find(contestantFactory.contestants, {id : id});
    };

    return contestantFactory;
}]);
