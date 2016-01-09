app.directive('heading', ['userFactory', function(userFactory) {
    return {
        templateUrl : VIEWS_DIR + '/heading',
        controller : ['$scope', function($scope) {
            $scope.$watchCollection(function() { return userFactory.user; }, function(user) {
                $scope.user = user;
            });
        }]
    }
}]);
