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
    AUTHENTICATION : {
        AUTHENTICATED : 'authentication.authenticated',
        SILENT_AUTHENTICATION_FAILED : 'authentication.silentAuthenticationFailed',
        LOGGED_OUT : 'authentication.loggedOut'
    },
    IMAGES : {
        CONTESTANTS_LOADED : 'images.contestantsLoaded',
        STATIC_LOADED : 'images.staticLoaded'
    },
    CONTESTANT_MODAL : {
        SHOW : 'contestantModal.show',
        HIDE : 'contestantModal.hide'
    },
    LEAGUE_MODAL : {
        SHOW : 'leagueModal.show',
        HIDE : 'leagueModal.hide'
    }
});
