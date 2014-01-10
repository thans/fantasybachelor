var Facebook = function() {

    // Loads the FB sdk. Must be called before other functions will work.
    // The callback is called with no parameters when the SDK is initialized
    this.loadSdk = function(callback) {
        window.fbAsyncInit = function() {
            FB.init({
                appId      : getAppId(), // App ID
                channelUrl : 'channel.html', // Channel File
                status     : true, // check login status
                cookie     : true, // enable cookies to allow the server to access the session
                xfbml      : true  // parse XFBML
            });

            callback();
        }

        $('<script>', {
            id: 'facebook-jssdk',
            src: 'http://connect.facebook.net/en_US/all.js'
        }).insertBefore($('script').first());
        return this;
    }

    // Prompts the user to login to the app with Facebook dialog box
    // The callback is called with the user's data if login was successful, undefined otherwise.
    this.login = function(callback) {
        FB && FB.login(function(response) {
            if (response.authResponse) {
                getUserData(callback);
            } else {
                callback();
            }
        });
        return this;
    }

    // Attempts to log the user in. The user must be signed into FB and have given permission to this app.
    // The callback is called with the user's data if login was successful, undefined otherwise.
    this.silentLogin = function(callback) {
        FB && FB.getLoginStatus(function(response) {
            if (response && response.status == 'connected') {
                getUserData(callback);
            } else {
                callback();
            }
        });
        return this;
    }

    // Logs the user out of FB and this app.
    // Calls the callback with no parameters when the logout is complete
    this.logout = function(callback) {
        FB && FB.logout(function() {
            callback();
        });
        return this;
    }

    // Gets the App Id for debug vs production mode
    var getAppId = function() {
        return window.location.hostname === "localhost" ? '781695765179715' : '307416292730318';
    }

    // Gets the current FB user's data.
    // Calls the callback with the user data object as the parameter.
    var getUserData = function(callback) {
        FB.api('/me', callback);
    }

}