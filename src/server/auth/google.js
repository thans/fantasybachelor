var config = require('../config/config');
var database = require('../database.js');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var express = require('express');
var passport = require('passport');

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
        clientID : config.AUTH.GOOGLE.CLIENT_ID,
        clientSecret : config.AUTH.GOOGLE.CLIENT_SECRET,
        callbackURL : config.AUTH.GOOGLE.CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        return database.User.login({
            authenticationService : 'GOOGLE_PLUS',
            authenticationServiceId : profile.id,
            userName : profile.displayName,
            firstName : profile.name.givenName,
            lastName : profile.name.familyName,
            profilePicture : profile._json.picture,
            email : profile.emails[0].value
        }).then(function(user) {
            done(null, user);
        }, function(err) {
            done(err);
        });
    }
));

module.exports.middleware = function() {
    var router = express.Router();

    // GET /auth/google
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Google authentication will involve
    //   redirecting the user to google.com.  After authorization, Google
    //   will redirect the user back to this application at /auth/google/callback
    router.get('/auth/google',
        passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'] }),
        function(req, res){
            // The request will be redirected to Google for authentication, so this
            // function will not be called.
        });

    // GET /auth/google/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    router.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/');
        });

    return router;
};

