const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user')

//what is inside the cookie in the browser:::
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// what the server will do when recieve the cookie
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        // options for google
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({googleId: profile.id}).then((user) => {
            if (!user) {
                return new User({
                    username: profile.displayName,
                    googleId: profile.id,
                    thumbnail: profile._json.image.url
                }).save().then((userCreated) => {
                    console.log("User Saved in DB!!!");
                    done(null, userCreated);
                });
            }
            console.log("Person already in DB!!!");
            done(null, user);
        }).catch((err) => {
            console.log("Error occured" + err)
        });
    })
        
);