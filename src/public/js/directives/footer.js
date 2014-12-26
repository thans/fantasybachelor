app.directive('footer', ['$location', 'authFactory', 'routeFactory', function($location, authFactory, routeFactory) {
    return {
        templateUrl : 'html/footer.html',
        controller : ['$scope', function($scope) {
            $scope.$watchCollection(function() { return authFactory.user; }, function(user) {
                $scope.user = user;
            });

            $scope.logout = authFactory.logout;
            $scope.changeAlias = function() {
                routeFactory.goToChangeAlias();
            }
        }]
    }
}]);