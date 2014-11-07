app.directive('facebookSdk', ['contestantFactory', function(facebookFactory) {
    return {
        template : '<div id="fb-root"></div><script id="facebook-jssdk" src="http://connect.facebook.net/en_US/sdk.js"></script>'
    }
}]);