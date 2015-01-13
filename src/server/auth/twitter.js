var config = require('../config/config');
var database = require('../database.js');
var TwitterStrategy = require('passport-twitter').Strategy;

module.exports.init = function() {

    // Use the TwitterStrategy within Passport.
    //   Strategies in passport require a `verify` function, which accept
    //   credentials (in this case, a token, tokenSecret, and Twitter profile), and
    //   invoke a callback with a user object.
    passport.use(new TwitterStrategy({
            consumerKey: config.AUTH.TWITTER.CONSUMER_KEY,
            consumerSecret:  config.AUTH.TWITTER.CONSUMER_SECRET,
            callbackURL:  config.AUTH.TWITTER.CALLBACK_URL
        },
        function(token, tokenSecret, profile, done) {
            return database.User.login({
                authenticationService : 'TWITTER',
                authenticationServiceId : profile.id,
                userName : profile.username,
                firstName : profile.displayName,
                profilePicture : profile.photos[0].value
            }).then(function(user) {
                done(null, user);
            }, function(err) {
                done(err);
            });
        }
    ));

    // GET /auth/twitter
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Twitter authentication will involve redirecting
    //   the user to twitter.com.  After authorization, the Twitter will redirect
    //   the user back to this application at /auth/twitter/callback
    app.get('/auth/twitter',
        passport.authenticate('twitter'),
        function(req, res){
            // The request will be redirected to Twitter for authentication, so this
            // function will not be called.
        });

    // GET /auth/twitter/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/');
        });
};

