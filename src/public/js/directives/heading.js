app.directive('heading', ['authFactory', function(authFactory) {
    return {
        templateUrl : 'view/heading',
        controller : ['$scope', function($scope) {
            $scope.$watchCollection(function() { return authFactory.user; }, function(user) {
                $scope.user = user;
            });
        }]
    }
}]);