app.directive('footer', ['$location', 'authFactory', 'routeFactory', function($location, authFactory, routeFactory) {
    return {
        templateUrl : 'html/footer.html',
        controller : function($scope) {
            $scope.$watchCollection(function() { return authFactory.user; }, function(user) {
                if (!user) { return; }
                $scope.profilePic = user.profilePic;
                $scope.alias = user.alias;
            });

            $scope.logout = authFactory.logout;
            $scope.changeAlias = function() {
                routeFactory.goToChangeAlias();
            }
        }
    }
}]);