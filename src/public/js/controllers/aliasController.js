app.controller('aliasController', ['$rootScope', '$scope', 'EVENTS', 'backendFactory', 'authFactory', 'routeFactory', function($rootScope, $scope, EVENTS, backendFactory, authFactory, routeFactory) {
    $rootScope.showHeaderFooter = true;

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
            routeFactory.goToHome();
            authFactory.user.alias = screenName;
            $scope.$emit(EVENTS.ALIAS.VALID);
        });
    };
}]);
