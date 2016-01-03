app.factory('topUsersFactory', ['$rootScope', 'SEASON', 'backendFactory', function($rootScope, SEASON, backendFactory) {
    var topUsersFactory = {};

    $rootScope.$watch(function() { return $rootScope.isAuthenticated; }, function(isAuthenticated) {
        if (!isAuthenticated) {
            return topUsersFactory.topUsers = null;
        }
        backendFactory.getTopUsers({ seasonId : SEASON.CURRENT_SEASON_ID }).then(function(result) {
            console.log(result);
            topUsersFactory.topUsers = result.data;
            $rootScope.$apply();
        });
    });

    return topUsersFactory;
}]);
