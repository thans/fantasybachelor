app.controller('aliasController', ['$scope', '$location', 'backendFactory', 'authFactory', 'routeFactory', function($scope, $location, backendFactory, authFactory, routeFactory) {
    if (!authFactory.user) {
        return;
    }
    $scope.alias = authFactory.user.alias || authFactory.user.firstName + ' ' + authFactory.user.lastName;

    $scope.setScreenName = function() {
        if (!$scope.alias) {
            $scope.errorMessage = 'please enter a name for yourself';
            return;
        }

        var screenName = $scope.alias;
        backendFactory.setAlias(authFactory.user.id, screenName).success(function() {
            routeFactory.goToTest();
            authFactory.user.alias = screenName;

        });
    };
}]);
