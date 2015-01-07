app.directive('slideOutMenu', ['routeFactory', 'authFactory', function(routeFactory, authFactory) {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: 'view/slideOutMenu',
        controller: ['$scope', function($scope) {
            $scope.slideOutMenuActive = false;
            $scope.showWeeks = false;

            $scope.hideSlideOutMenu = function() {
                $scope.slideOutMenuActive = false;
            };

            $scope.showSlideOutMenu = function(event) {
                $scope.showWeeks = false;
                $scope.slideOutMenuActive = !$scope.slideOutMenuActive;
                event.stopPropagation();
            };

            $scope.home = function() {
                $scope.hideSlideOutMenu();
                routeFactory.goToHome();
            };

            $scope.changeAlias = function() {
                $scope.hideSlideOutMenu();
                routeFactory.goToChangeAlias();
            };

            $scope.logout = function() {
                $scope.hideSlideOutMenu();
                authFactory.logout();
            };

            $scope.goToWeek = function(weekId) {
                $scope.hideSlideOutMenu();
                routeFactory.goToWeek(weekId);
            };
        }]
    };
}]);