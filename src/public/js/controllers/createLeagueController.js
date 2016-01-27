app.controller('createLeagueController', ['$rootScope', '$scope', 'EVENTS', 'SEASON', 'backendFactory', 'userFactory', 'routeFactory', function($rootScope, $scope, EVENTS, SEASON, backendFactory, userFactory, routeFactory) {
    $rootScope.showHeaderFooter = true;
    $rootScope.pageTitle = 'create league';
    $rootScope.viewLoaded = true;

    $scope.defaultLeagueName = 'New Fantasy Bach League';

    $scope.leagueName = $scope.defaultLeagueName;

    $scope.createLeague = function() {
        //$scope.errorMessage = '';
        //
        //var leagueName = $scope.leagueName;
        //if (!leagueName || leagueName == $scope.defaultLeagueName) {
        //    $scope.errorMessage = 'please enter a name for yourself';
        //    return;
        //}
        //
        //backendFactory.postGroup({ seasonId : SEASON.CURRENT_SEASON_ID }, { groupName : leagueName }).then(function(result) {
        //    var leagueId = result.data;
        //    $rootScope.currentLeague = leagueId;
        //    userFactory.user.groups.push(leagueId);
        //    $scope.leagueId = leagueId;
        //    $rootScope.$apply();
        //}).catch(function() {
        //    $scope.errorMessage = 'something went wrong, try again';
        //    $rootScope.$apply();
        //});
        //$scope.errorMessage = 'creating ...';
    };
}]);
