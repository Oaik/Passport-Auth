const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys');
const authRoutes = require('./routes/auth-routes');
const authProfile = require('./routes/profile-routes');

const app = express();

mongoose.connect(keys.mongodb.dbURI,{ useNewUrlParser: true } ,() => {
    console.log("Connected to DB");
});
//set up view
app.set('view engine', 'ejs');
app.use(express.static('public'))

app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: [keys.session.cookieKey],
}));

// initalize passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes)
app.use('/profile', authProfile)

app.get('/', (req, res) => {
    res.render('index', {
        user: req.user
    });
});

app.listen(3000, () => {
    console.log("App listing on port 3000");
});