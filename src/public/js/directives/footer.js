app.directive('footer', ['$location', 'routeFactory', 'userFactory', function($location, routeFactory, userFactory) {
    return {
        templateUrl : 'view/footer',
        controller : ['$scope', function($scope) {
            $scope.$watchCollection(function() { return userFactory.user; }, function(user) {
                $scope.user = user;
            });

            $scope.logout = routeFactory.goToLogout;
            $scope.changeAlias = routeFactory.goToChangeAlias;
        }]
    }
}]);