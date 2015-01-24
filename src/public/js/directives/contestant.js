app.directive('contestant', ['contestantFactory', function(contestantFactory) {
    return {
        restrict : 'A',
        templateUrl : 'view/contestant',
        scope : {
            contestantId : '=',
            multiplier : '=',
            score : '=',
            eliminated : '=',
            onBioClick : '=',
            onSelectClick : '=',
            onRemoveClick : '='
        },
        replace : true,
        controller : ['$scope', function($scope) {
            $scope.$watch('contestantId', function() {
                $scope.contestant = contestantFactory.findContestantById($scope.contestantId);
            });

            $scope.log = function(msg) {console.log(msg)};
        }]
    };
}]);