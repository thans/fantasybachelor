app.directive('leagueModal', ['$rootScope', 'EVENTS', function($rootScope, EVENTS) {
    return {
        restrict : 'A',
        templateUrl : VIEWS_DIR + '/leagueModal',
        scope : {},
        controller : ['$scope', '$element', function($scope, $element) {
            $scope.visible = false;
            $scope.leagues = [];

            $scope.close = function() {
                $scope.visible = false;
            };

            $scope.globalClicked = function() {
                $scope.close();
                $scope.callback && $scope.callback();
            };

            $scope.leagueClicked = function(league) {
                $scope.close();
                $scope.callback && $scope.callback(league);
            };

            $scope.createLeagueClicked = function() {
                $scope.close();
                $scope.onCreateLeague && $scope.onCreateLeague();
            };

            $rootScope.$on(EVENTS.LEAGUE_MODAL.SHOW, function(event, options) {
                if (!options.leagues) { return; }
                $scope.leagues = options.leagues;
                $scope.callback = options.callback;
                $scope.onCreateLeague = options.onCreateLeague;

                $scope.visible = true;
                $element.find('.innerWrapper').scrollTop(0);
            })
        }]
    };
}]);
