app.controller('loginController', ['$scope', 'facebookFactory', 'googlePlusFactory', function($scope, facebookFactory, googlePlusFactory) {
    $scope.loginFacebook = function() {
        facebookFactory.login();
    };

    $scope.loginGooglePlus = function() {
        googlePlusFactory.login();
    };
}]);