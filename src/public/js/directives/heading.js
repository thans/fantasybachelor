app.directive('heading', ['authFactory', function(authFactory) {
    return {
        templateUrl : 'html/heading.html',
        controller : ['$scope', function($scope) {
            $scope.$watchCollection(function() { return authFactory.user; }, function(user) {
                $scope.user = user;
            });
        }]
    }
}]);