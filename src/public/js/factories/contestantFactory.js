app.factory('contestantFactory', ['$rootScope', 'EVENTS', 'backendFactory', function($rootScope, EVENTS, backendFactory) {
    var contestantFactory = {};

    backendFactory.loadContestants().success(function(contestants) {
        contestantFactory.contestants = contestants;
        console.log(contestants);
        console.log('Contestant data loaded.');
        $rootScope.$broadcast(EVENTS.CONTESTANTS.LOADED, contestants);
    });

    contestantFactory.findContestantById = function(id) {
        if (!contestantFactory.contestants) { return; }
        return _.find(contestantFactory.contestants, {id : id});
    };

    return contestantFactory;
}]);