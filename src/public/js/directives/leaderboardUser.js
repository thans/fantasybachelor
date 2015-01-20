app.directive('leaderboardUser', function() {
    return {
        restrict: 'A',
        scope : {
            user : '=',
            rank : '=',
            highlight : '='
        },
        templateUrl: 'view/leaderboardUser'
    }
});