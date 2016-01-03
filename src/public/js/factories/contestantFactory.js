app.factory('contestantFactory', ['$rootScope', 'SEASON', 'backendFactory', function($rootScope, SEASON, backendFactory) {
    var contestantFactory = {};

    $rootScope.$watch(function() { return $rootScope.isAuthenticated; }, function(isAuthenticated) {
        if (!isAuthenticated) {
            return contestantFactory.contestants = null;
        }
        backendFactory.getContestants({ seasonId : SEASON.CURRENT_SEASON_ID }).then(function(result) {
            console.log(result);
            contestantFactory.contestants = result.data;
            $rootScope.$apply();
        });
    });

    contestantFactory.findContestantById = function(id) {
        if (!contestantFactory.contestants) { return; }
        return _.find(contestantFactory.contestants, {id : id});
    };

    return contestantFactory;
}]);
