app.controller('nicknameController', ['$rootScope', '$scope', 'EVENTS', 'userFactory', 'routeFactory', function($rootScope, $scope, EVENTS, userFactory, routeFactory) {
    $rootScope.showHeaderFooter = true;
    $rootScope.pageTitle = 'screen name';
    $rootScope.viewLoaded = true;

    $scope.nickname = userFactory.user.displayName;

    $scope.setNickname = function() {
        $scope.errorMessage = '';

        if (!$scope.nickname) {
            $scope.errorMessage = 'please enter a name for yourself';
            return;
        }

        var nickname = $scope.nickname;
        userFactory.setNickname(nickname).then(function() {
            routeFactory.goToHome();
            $rootScope.$apply();
        }).catch(function() {
            $scope.errorMessage = 'something went wrong, try again';
            $rootScope.$apply();
        });
        $scope.errorMessage = 'saving ...';
    };
}]);
