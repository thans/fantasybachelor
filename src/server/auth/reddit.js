var config = require('../config/config');
var database = require('../database.js');
var crypto = require('crypto');
var RedditStrategy = require('passport-reddit').Strategy;

module.exports.init = function() {

    // Use the RedditStrategy within Passport.
    //   Strategies in Passport require a `verify` function, which accept
    //   credentials (in this case, an accessToken, refreshToken, and Reddit
    //   profile), and invoke a callback with a user object.
    passport.use(new RedditStrategy({
            clientID: config.AUTH.REDDIT.CONSUMER_KEY,
            clientSecret: config.AUTH.REDDIT.CONSUMER_SECRET,
            callbackURL: config.AUTH.REDDIT.CALLBACK_URL
        },
        function(accessToken, refreshToken, profile, done) {
            return database.User.login({
                authenticationService : 'REDDIT',
                authenticationServiceId : profile.id,
                userName : profile.name
            }).then(function(user) {
                done(null, user);
            }, function(err) {
                done(err);
            });
        }
    ));

    // GET /auth/reddit
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Reddit authentication will involve
    //   redirecting the user to reddit.com.  After authorization, Reddit
    //   will redirect the user back to this application at /auth/reddit/callback
    //
    //   Note that the 'state' option is a Reddit-specific requirement.
    app.get('/auth/reddit', function(req, res, next){
        req.session.state = crypto.randomBytes(32).toString('hex');
        passport.authenticate('reddit', {
            state: req.session.state,
            duration: 'permanent'
        })(req, res, next);
    });

    // GET /auth/reddit/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    app.get('/auth/reddit/callback', function(req, res, next){
        // Check for origin via state token
        if (req.query.state == req.session.state){
            passport.authenticate('reddit', {
                successRedirect: '/',
                failureRedirect: '/'
            })(req, res, next);
        }
        else {
            next( new Error(403) );
        }
    });
};

