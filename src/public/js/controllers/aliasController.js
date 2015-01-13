app.controller('aliasController', ['$rootScope', '$scope', 'EVENTS', 'backendFactory', 'userFactory', 'routeFactory', function($rootScope, $scope, EVENTS, backendFactory, userFactory, routeFactory) {
    $rootScope.showHeaderFooter = true;

    $scope.alias = userFactory.user.displayName;

    $scope.setScreenName = function() {
        $scope.errorMessage = '';

        if (!$scope.alias) {
            $scope.errorMessage = 'please enter a name for yourself';
            return;
        }

        var screenName = $scope.alias;
        backendFactory.setAlias(screenName).success(function() {
            userFactory.user.alias = screenName;
            routeFactory.goToHome();
        }).error(function() {
            $scope.errorMessage = 'something when wrong, try again';
        });
        $scope.errorMessage = 'saving ...';
    };
}]);
