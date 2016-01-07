app.directive('slideOutMenu', ['routeFactory', 'roundsFactory', function(routeFactory, roundsFactory) {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: 'view/slideOutMenu',
        controller: ['$scope', function($scope) {
            $scope.slideOutMenuActive = false;
            $scope.showRounds = false;

            $scope.$watch(function() { return roundsFactory.rounds; }, function(rounds) {
                $scope.rounds = rounds;
            });

            $scope.hideSlideOutMenu = function() {
                $scope.slideOutMenuActive = false;
            };

            $scope.showSlideOutMenu = function(event) {
                $scope.showRounds = false;
                $scope.slideOutMenuActive = !$scope.slideOutMenuActive;
                event.stopPropagation();
            };

            $scope.home = function() {
                $scope.hideSlideOutMenu();
                routeFactory.goToHome();
            };

            $scope.changeNickname = function() {
                $scope.hideSlideOutMenu();
                routeFactory.goToChangeNickname();
            };

            $scope.logout = function() {
                $scope.hideSlideOutMenu();
                routeFactory.goToLogout();
            };

            $scope.goToRound = function(roundId) {
                $scope.hideSlideOutMenu();
                routeFactory.goToRound(roundId);
            };
        }]
    };
}]);
