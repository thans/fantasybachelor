app.factory('userFactory', ['$rootScope', '$q', 'SEASON', 'backendFactory', 'routeFactory', function($rootScope, $q, SEASON, backendFactory, routeFactory) {
    var userFactory = {};

    $rootScope.$watch(function() { return $rootScope.isAuthenticated; }, function(isAuthenticated) {
        if (!isAuthenticated) {
            return userFactory.user = null;
        }
        backendFactory.getCurrentUser({ seasonId : SEASON.CURRENT_SEASON_ID }).then(function(result) {
            console.log(result);
            userFactory.user = result.data;
            $rootScope.$apply();
        });
    });

    userFactory.setNickname = function(nickname) {
        return backendFactory.postNickname({}, { nickname : nickname }).then(function() {
            userFactory.user.nickname = nickname;
            $rootScope.$apply();
            return nickname;
        });
    };

    $rootScope.$watchCollection(function() { return userFactory.user; }, function(user) {
        if (!user) { return; }
        user.displayName = user.nickname || user.name;
    });

    $rootScope.$watchCollection(function() { return userFactory.user && userFactory.user.groups; }, function(groups) {
        if (!groups) { return; }
        userFactory.user.groupData = {};
        _.each(groups, function(groupId) {
            backendFactory.getGroupMembers({ seasonId : SEASON.CURRENT_SEASON_ID, id : groupId }).then(function(result) {
                userFactory.user.groupData[groupId] = result.data;
                $rootScope.$apply();
            })
        });
    });

    return userFactory;
}]);
