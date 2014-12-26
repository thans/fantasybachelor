app.factory('googlePlusFactory', ['$rootScope', 'EVENTS', 'GOOGLE_PLUS', function($rootScope, EVENTS, GOOGLE_PLUS) {
    var googlePlusFactory = {};

    /**
     * Initializes the Google Plus SDK. Must be called before other functions will work.
     */
    googlePlusFactory.init = function() {
        gapi.client.setApiKey(GOOGLE_PLUS.API_KEY);

        $rootScope.$broadcast(EVENTS.GOOGLE_PLUS.SDK_LOADED);
        $rootScope.$apply();

    };

    /**
     * Authenticates the user with Google Plus.
     */
    googlePlusFactory.login = function() {
        return googlePlusFactory._login(false);
    };

    /**
     * Checks if the user is already authenticated with Google Plus.
     */
    googlePlusFactory.checkAuthentication = function() {
        return googlePlusFactory._login(true);
    };

    googlePlusFactory._login = function(silent) {
        if (!gapi) { return; }

        gapi.auth.authorize({
            client_id: GOOGLE_PLUS.CLIENT_ID,
            scope: GOOGLE_PLUS.SCOPE,
            immediate: silent,
            cookie_policy: 'single_host_origin'
        }, function(authResult) {
            if (authResult && authResult.status && authResult.status.signed_in) {
                $rootScope.$broadcast(silent ? EVENTS.GOOGLE_PLUS.SILENT_AUTHENTICATED : EVENTS.GOOGLE_PLUS.AUTHENTICATED);
            } else {
                $rootScope.$broadcast(silent ? EVENTS.GOOGLE_PLUS.NOT_SILENT_AUTHENTICATED : EVENTS.GOOGLE_PLUS.AUTHENTICATION_ERROR);
            }
            $rootScope.$apply();
        });
    };

    /**
     * Gets the current Google Plus user's data.
     */
    googlePlusFactory.loadUserData = function() {
        if (!gapi) { return; }

        gapi.client.load('plus', 'v1').then(function() {
            gapi.client.plus.people.get({
                'userId': 'me'
            }).then(function(data) {
                var userData = {
                    firstName : data.result.name.givenName,
                    lastName : data.result.name.familyName,
                    service : GOOGLE_PLUS.NAME,
                    id : data.result.id,
                    email : data.result.emails[0].value,
                    profilePic : data.result.image.url
                };
                $rootScope.$broadcast(EVENTS.GOOGLE_PLUS.USER_DATA, userData);
                $rootScope.$apply();
            }, function(reason) {
                $rootScope.$broadcast(EVENTS.GOOGLE_PLUS.USER_DATA_ERROR, reason);
                $rootScope.$apply();
            });
        });
    };

    /**
     * Logs the user out of Google Plus.
     */
    googlePlusFactory.logout = function() {
        if (!gapi) { return; }

        gapi.auth.signOut();
        $rootScope.$broadcast(EVENTS.GOOGLE_PLUS.LOGGED_OUT);
    };

    window.googlePlusSdkLoad = googlePlusFactory.init;

    return googlePlusFactory;
}]);