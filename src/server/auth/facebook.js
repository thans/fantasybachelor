var config = require('../config/config');
var database = require('../database.js');
var FacebookStrategy = require('passport-facebook').Strategy;
var express = require('express');
var passport = require('passport');

// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
passport.use(new FacebookStrategy({
        clientID: config.AUTH.FACEBOOK.APP_ID,
        clientSecret: config.AUTH.FACEBOOK.APP_SECRET,
        callbackURL: config.AUTH.FACEBOOK.CALLBACK_URL,
        authorizationURL: 'https://www.facebook.com/v2.2/dialog/oauth',
        tokenURL: 'https://graph.facebook.com/v2.2/oauth/access_token',
        profileURL: 'https://graph.facebook.com/v2.2/me',
        profileFields: ['id', 'name', 'picture', 'emails', 'displayName']
    },
    function(accessToken, refreshToken, profile, done) {
        return database.User.login({
            authenticationService : 'FACEBOOK',
            authenticationServiceId : profile.id,
            userName : profile.displayName,
            firstName : profile.name.givenName,
            lastName : profile.name.familyName,
            email : profile.emails[0].value,
            profilePicture : profile.photos[0].value
        }).then(function(user) {
            done(null, user);
        }, function(err) {
            done(err);
        });
    }
));

module.exports.middleware = function() {
    var router = express.Router();

    // GET /auth/facebook
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Facebook authentication will involve
    //   redirecting the user to facebook.com.  After authorization, Facebook will
    //   redirect the user back to this application at /auth/facebook/callback
    router.get('/auth/facebook',
        passport.authenticate('facebook', { scope : ['public_profile', 'email'] }),
        function(req, res){
            // The request will be redirected to Facebook for authentication, so this
            // function will not be called.
        });

    // GET /auth/facebook/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/');
        });

    return router;
};

