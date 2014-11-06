app.directive('facebookSdk', ['authFactory', function(facebookFactory) {
    return {
        template : '<div id="fb-root"></div><script id="facebook-jssdk" src="http://connect.facebook.net/en_US/sdk.js"></script>'
    }
}]);