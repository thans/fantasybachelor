var reddit = require('./reddit');
var twitter = require('./twitter');
var facebook = require('./facebook');
var google = require('./google');
var database = require('../database');

module.exports.init = function() {
    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.  However, since this example does not
    //   have a database of user records, the complete Reddit profile is
    //   serialized and deserialized.
    passport.serializeUser(function(user, done) {
        done(null, user.get('id'));
    });

    passport.deserializeUser(function(userId, done) {
        database.User.find(userId).then(function(user) {
            done(null, user);
        }).fail(function(err) {
            done(err);
        });
    });

    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());

    reddit.init();
    facebook.init();
    google.init();
    twitter.init();

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
};

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
module.exports.isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.send(401);
};