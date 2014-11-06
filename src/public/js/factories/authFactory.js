app.factory('authFactory', ['$rootScope', '$q', '$location', '$http', 'EVENTS', 'FACEBOOK', 'GOOGLE_PLUS', 'facebookFactory', 'googlePlusFactory', 'backendFactory', function($rootScope, $q, $location, $http, EVENTS, FACEBOOK, GOOGLE_PLUS, facebookFactory, googlePlusFactory, backendFactory) {
    var authFactory = {};

    $rootScope.$on(EVENTS.FACEBOOK.SDK_LOADED, function() {
        facebookFactory.checkAuthentication();
    });

    $rootScope.$on(EVENTS.GOOGLE_PLUS.SDK_LOADED, function() {
        googlePlusFactory.checkAuthentication();
    });

    $rootScope.$on(EVENTS.FACEBOOK.SILENT_AUTHENTICATED, function() {
        authFactory.facebookAuthenticated = true;
        facebookFactory.loadUserData();
    });

    $rootScope.$on(EVENTS.GOOGLE_PLUS.SILENT_AUTHENTICATED, function() {
        authFactory.googlePlusAuthenticated = true;
        if (authFactory.facebookAuthenticated === false) {
            googlePlusFactory.loadUserData();
        }
    });

    $rootScope.$on(EVENTS.FACEBOOK.NOT_SILENT_AUTHENTICATED, function() {
        authFactory.facebookAuthenticated = false;
        if (authFactory.googlePlusAuthenticated === false) {
            $rootScope.$broadcast(EVENTS.AUTHENTICATION.SILENT_AUTHENTICATION_FAILED);
        } else if (authFactory.googlePlusAuthenticated === true) {
            googlePlusFactory.loadUserData();
        }
    });

    $rootScope.$on(EVENTS.GOOGLE_PLUS.NOT_SILENT_AUTHENTICATED, function() {
        authFactory.googlePlusAuthenticated = false;
        if (authFactory.facebookAuthenticated === false) {
            $rootScope.$broadcast(EVENTS.AUTHENTICATION.SILENT_AUTHENTICATION_FAILED);
        }
    });

    $rootScope.$on(EVENTS.FACEBOOK.AUTHENTICATED, function() {
        authFactory.facebookAuthenticated = true;
        facebookFactory.loadUserData();
    });

    $rootScope.$on(EVENTS.GOOGLE_PLUS.AUTHENTICATED, function() {
        authFactory.googlePlusAuthenticated = true;
        googlePlusFactory.loadUserData();
    });

    authFactory.handleUserData = function(event, userData) {
        console.log('Logged in with ' + userData.service);

        backendFactory.loginUser(userData).success(function(data) {
            data.profilePic = userData.profilePic;
            authFactory.user = data;
            $rootScope.$broadcast(EVENTS.AUTHENTICATION.AUTHENTICATED);
        });
    };

    $rootScope.$on(EVENTS.FACEBOOK.USER_DATA, authFactory.handleUserData);
    $rootScope.$on(EVENTS.GOOGLE_PLUS.USER_DATA, authFactory.handleUserData);

    authFactory.handleLogout = function() {
        authFactory.user = null;
        $rootScope.$broadcast(EVENTS.AUTHENTICATION.LOGGED_OUT);
    };

    $rootScope.$on(EVENTS.FACEBOOK.LOGGED_OUT, authFactory.handleLogout);
    $rootScope.$on(EVENTS.GOOGLE_PLUS.LOGGED_OUT, authFactory.handleLogout);

    authFactory.logout = function() {
        if (!authFactory.user) { return; }
        authFactory.user.authenticationService === FACEBOOK.NAME ? facebookFactory.logout() : googlePlusFactory.logout();
    };

    return authFactory;
}]);