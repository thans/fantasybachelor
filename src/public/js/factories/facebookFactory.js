app.factory('facebookFactory', ['$rootScope', 'EVENTS', 'FACEBOOK', function($rootScope, EVENTS, FACEBOOK) {
    var facebookFactory = {};

    facebookFactory.accessToken = null;
    facebookFactory.isInitialized = false;

    /**
     * Initializes the Facebook SDK. Must be called before other functions will work.
     */
    facebookFactory.init = function() {
        FB.init({
            appId      : facebookFactory.getAppId(), // App ID
            channelUrl : 'channel.html', // Channel File
            status     : true, // check login status
            xfbml      : true, // parse XFBML,
            version    : 'v2.5'
        });

        facebookFactory.isInitialized = true;
        $rootScope.$apply();
        facebookFactory.checkAuthentication();
    };

    /**
     * @returns {string} The App Id for debug vs production mode
     */
    facebookFactory.getAppId = function() {
        return window.location.hostname === 'localhost' ? FACEBOOK.APP_ID.DEVELOPMENT : FACEBOOK.APP_ID.PRODUCTION;
    };

    /**
     * Authenticates the user with Facebook.
     */
    facebookFactory.login = function() {
        if (!FB) { return; }

        FB.login(function(response) {
            facebookFactory.accessToken = false;
            if (response && response.authResponse && response.authResponse.accessToken) {
                facebookFactory.accessToken = response.authResponse.accessToken;
            }

            // Hack to resume data loading after login
            $rootScope.appLoaded = false;

            $rootScope.$apply();
        }, { scope: FACEBOOK.SCOPE });
    };

    /**
     * Checks if the user is already authenticated with Facebook.
     */
    facebookFactory.checkAuthentication = function() {
        if (!FB) { return; }

        FB.getLoginStatus(function(response) {
            facebookFactory.accessToken = false;
            if (response && response.status == 'connected' && response.authResponse && response.authResponse.accessToken) {
                facebookFactory.accessToken = response.authResponse.accessToken;
            }
            $rootScope.$apply();
        });
    };

    /**
     * Logs the user out of FB and this app.
     */
    facebookFactory.logout = function() {
        if (!FB) { return; }

        FB.logout(function() {
            facebookFactory.accessToken = null;
            $rootScope.$apply();
        });
    };

    window.fbAsyncInit = facebookFactory.init;

    return facebookFactory;
}]);
