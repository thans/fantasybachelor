app.directive('contestant', ['contestantFactory', function(contestantFactory) {
    return {
        restrict : 'A',
        templateUrl : 'html/contestant.html',
        scope : {
            contestantId : '=',
            multiplier : '=',
            callback : '='
        },
        controller : ['$scope', function($scope) {
            $scope.$watch('contestantId', function() {
                $scope.contestant = contestantFactory.findContestantById($scope.contestantId);
            });
        }]
    };
}]);