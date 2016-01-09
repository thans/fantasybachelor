app.directive('footer', ['$location', 'routeFactory', 'userFactory', function($location, routeFactory, userFactory) {
    return {
        templateUrl : VIEWS_DIR + '/footer',
        controller : ['$scope', function($scope) {
            $scope.$watchCollection(function() { return userFactory.user; }, function(user) {
                $scope.user = user;
            });

            $scope.logout = routeFactory.goToLogout;
            $scope.changeNickname = routeFactory.goToChangeNickname;
        }]
    }
}]);
