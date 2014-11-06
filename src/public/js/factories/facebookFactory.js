app.factory('facebookFactory', ['$rootScope', '$q', 'EVENTS', 'FACEBOOK', function($rootScope, $q, EVENTS, FACEBOOK) {
    var facebookFactory = {};

    /**
     * Initializes the Facebook SDK. Must be called before other functions will work.
     */
    facebookFactory.init = function() {
        FB.init({
            appId      : facebookFactory.getAppId(), // App ID
            channelUrl : 'channel.html', // Channel File
            status     : true, // check login status
            cookie     : true, // enable cookies to allow the server to access the session
            xfbml      : true, // parse XFBML,
            version    : 'v2.0'
        });

        $rootScope.$broadcast(EVENTS.FACEBOOK.SDK_LOADED);
        $rootScope.$apply();
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
            if (response.authResponse) {
                $rootScope.$broadcast(EVENTS.FACEBOOK.AUTHENTICATED);
            } else {
                $rootScope.$broadcast(EVENTS.FACEBOOK.AUTHENTICATION_ERROR);
            }
            $rootScope.$apply();
        }, { scope: FACEBOOK.SCOPE });
    };

    /**
     * Checks if the user is already authenticated with Facebook.
     */
    facebookFactory.checkAuthentication = function() {
        if (!FB) { return; }

        FB.getLoginStatus(function(response) {
            if (response && response.status == 'connected') {
                $rootScope.$broadcast(EVENTS.FACEBOOK.SILENT_AUTHENTICATED);
            } else {
                $rootScope.$broadcast(EVENTS.FACEBOOK.NOT_SILENT_AUTHENTICATED);
            }
            $rootScope.$apply();
        });
    };

    /**
     * Gets the current FB user's data.
     */
    facebookFactory.loadUserData = function() {
        if (!FB) { return; }

        FB.api('/me', {fields: 'first_name,last_name,id,email,picture'},
            function(data) {
            console.log(data);
            var userData = {
                firstName : data.first_name,
                lastName : data.last_name,
                service : FACEBOOK.NAME,
                id : data.id,
                email : data.email,
                profilePic : data.picture.data.url
            };
            $rootScope.$broadcast(EVENTS.FACEBOOK.USER_DATA, userData);
            $rootScope.$apply();
        });
    };

    /**
     * Logs the user out of FB and this app.
     */
    facebookFactory.logout = function() {
        if (!FB) { return; }

        try {
            FB.logout(function() {
                $rootScope.$broadcast(EVENTS.FACEBOOK.LOGGED_OUT);
            });
        } catch (e) {
            $rootScope.$broadcast(EVENTS.FACEBOOK.LOGOUT_ERROR);
        }
        $rootScope.$apply();
    };

    window.fbAsyncInit = facebookFactory.init;

    return facebookFactory;
}]);