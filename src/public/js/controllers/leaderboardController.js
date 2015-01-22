app.controller('leaderboardController', ['$rootScope', '$scope', 'backendFactory', function($rootScope, $scope, backendFactory) {
    $rootScope.showHeaderFooter = true;
    $rootScope.pageTitle = 'leaderboard';
    $scope.loaded = false;

    backendFactory.getLeaderboard().then(function(response) {
        console.log(response.data);
        console.log('Leaderboard data loaded.');
        $scope.loaded = true;
        $scope.user.rank = response.data.userRank;
        $scope.topTen = response.data.topTenUsers;
    })
}]);