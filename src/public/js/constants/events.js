app.constant('EVENTS', {
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
    },
    WEEKS : {
        LOADED : 'weeks.loaded'
    },
    CONTESTANT_MODAL : {
        SHOW : 'contestantModal.show',
        HIDE : 'contestantModal.hide'
    },
    ALIAS : {
        VALID : 'alias.valid'
    }
});