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
            onRemoveClick : '=',
            image : '=',
            role : '=',
            inactive : '=',
            mini : '='
        },
        replace : true,
        controller : ['$scope', function($scope) {
            console.log($scope.contestantId);
            $scope.$watch('contestantId', function() {
                $scope.contestant = contestantFactory.findContestantById($scope.contestantId);
            });

            $scope.woman = 'https://resources.fantasybach.com/season:NJWJTpZ8x/headShots/Woman.jpg';

            $scope.log = function(msg) {console.log(msg)};
        }]
    };
}]);
