app.directive('slideOutMenu', ['routeFactory', 'weeksFactory', function(routeFactory, weeksFactory) {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: 'view/slideOutMenu',
        controller: ['$scope', function($scope) {
            $scope.slideOutMenuActive = false;
            $scope.showWeeks = false;

            $scope.$watch(function() { return weeksFactory.weeks; }, function(weeks) {
                $scope.weeks = weeks;
            });

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
                routeFactory.goToLogout();
            };

            $scope.goToWeek = function(weekId) {
                $scope.hideSlideOutMenu();
                routeFactory.goToWeek(weekId);
            };

            $scope.leaderboard = function() {
                $scope.hideSlideOutMenu();
                routeFactory.goToLeaderboard();
            };
        }]
    };
}]);