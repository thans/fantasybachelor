app.controller('logoutController', ['$rootScope', '$scope', '$window', 'routeFactory', 'facebookFactory', function($rootScope, $scope, $window, routeFactory, facebookFactory) {
    $rootScope.showHeaderFooter = false;
    $rootScope.pageTitle = 'logout';
    $rootScope.viewLoaded = true;


    facebookFactory.logout();
}]);
