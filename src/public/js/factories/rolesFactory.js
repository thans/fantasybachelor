app.factory('rolesFactory', ['$rootScope', 'SEASON', 'backendFactory', function($rootScope, SEASON, backendFactory) {
    var rolesFactory = {};

    $rootScope.$watch(function() { return $rootScope.isAuthenticated; }, function(isAuthenticated) {
        if (!isAuthenticated) {
            return rolesFactory.roles = null;
        }
        backendFactory.getRoles({ seasonId : SEASON.CURRENT_SEASON_ID }).then(function(result) {
            console.log(result);
            rolesFactory.roles = result.data;
            $rootScope.$apply();
        });
    });

    rolesFactory.findRoleById = function(id) {
        if (!rolesFactory.roles) { return; }
        return _.find(rolesFactory.roles, {id : id});
    };

    return rolesFactory;
}]);
