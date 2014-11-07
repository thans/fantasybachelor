app.factory('contestantFactory', ['$rootScope', 'EVENTS', 'backendFactory', function($rootScope, EVENTS, backendFactory) {
    var contestantFactory = {};

    backendFactory.loadContestants().success(function(contestants) {
        contestantFactory.contestants = contestants;
        console.log(contestants);
        $rootScope.$broadcast(EVENTS.CONTESTANTS.LOADED, contestants);
    });

    return contestantFactory;
}]);