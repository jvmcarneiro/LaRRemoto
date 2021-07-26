const passport = require('passport');
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const db = require('./db');
        const user = await db.findUserById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new localStrategy({
    usernameField: 'username',
    passwordField: 'password'
},
    async (username, password, done) => {
        try {
            const db = require('./db');
            const user = await db.findUser(username);

            // usuário inexistente
            if (!user) { return done(null, false) }

            // comparando as senhas
            const isValid = bcrypt.compareSync(password, user.password);
            if (!isValid) return done(null, false)
            
            return done(null, user)
        } catch (err) {
            done(err, false);
        }
    }
));
