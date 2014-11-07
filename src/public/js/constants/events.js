app.constant('EVENTS', {
    FACEBOOK : {
        SDK_LOADED : 'facebook.sdkLoaded',
        USER_DATA : 'facebook.userData',
        SILENT_AUTHENTICATED : 'facebook.silentAuthenticated',
        NOT_SILENT_AUTHENTICATED : 'facebook.notSilentAuthenticated',
        AUTHENTICATED : 'facebook.authenticated',
        AUTHENTICATION_ERROR : 'facebook.authenticationError',
        LOGGED_OUT : 'facebook.loggedOut'
    },
    GOOGLE_PLUS : {
        SDK_LOADED : 'googlePlus.sdkLoaded',
        USER_DATA : 'googlePlus.userData',
        SILENT_AUTHENTICATED : 'googlePlus.silentAuthenticated',
        NOT_SILENT_AUTHENTICATED : 'googlePlus.notSilentAuthenticated',
        AUTHENTICATED : 'googlePlus.authenticated',
        AUTHENTICATION_ERROR : 'googlePlus.authenticationError',
        LOGGED_OUT : 'googlePlus.loggedOut'
    },
    AUTHENTICATION : {
        AUTHENTICATED : 'authentication.authenticated',
        SILENT_AUTHENTICATION_FAILED : 'authentication.silentAuthenticationFailed',
        LOGGED_OUT : 'authentication.loggedOut'
    },
    IMAGES : {
        CONTESTANTS_LOADED : 'images.contestantsLoaded',
        STATIC_LOADED : 'images.staticLoaded'
    },
    CONTESTANTS : {
        LOADED : 'contestants.loaded'
    }
});