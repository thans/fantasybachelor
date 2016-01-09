app.directive('contestant', ['contestantFactory', function(contestantFactory) {
    return {
        restrict : 'A',
        templateUrl : VIEWS_DIR + '/contestant',
        scope : {
            contestantId : '=',
            multiplier : '=',
            eliminated : '=',
            onBioClick : '=',
            onSelectClick : '=',
            onRemoveClick : '=',
            image : '=',
            role : '=',
            inactive : '=',
            mini : '=',
            round : '='
        },
        replace : true,
        controller : ['$scope', function($scope) {
            $scope.$watch('contestantId', function() {
                $scope.contestant = contestantFactory.findContestantById($scope.contestantId);

                if (!$scope.round || !$scope.role || !$scope.contestant) { return; }
                var roseScore = ($scope.multiplier || 1) * $scope.contestant.roses[$scope.round.id];
                var roleScore = $scope.role.pointsPerOccurrence * ($scope.contestant.roundResults[$scope.round.id][$scope.role.id].occurrences || 0);
                $scope.score = roseScore + roleScore;
            });

            $scope.woman = 'https://resources.fantasybach.com/season:NJWJTpZ8x/headShots/Woman.jpg';

            $scope.log = function(msg) {console.log(msg)};
        }]
    };
}]);
