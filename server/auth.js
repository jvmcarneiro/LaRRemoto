const passport = require('passport');
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const db = require('./db.js');

passport.use(
  'login',
  new localStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  async (username, password, done) => {
    try {
      const user = await db.findUser(username);
      if (!user) return done(null, false, { message: 'Usuário inexistente' });

      const isValid = bcrypt.compareSync(password, user.password);
      if (!isValid) return done(null, false, { message: 'Senha incorreta' });

      return done(null, user, { message: 'Acesso efetuado' });
    } catch (err) {
      done(err, false);
    }
  }
));

passport.use(
  new JWTstrategy(
    {
      secretOrKey: 'TOP_SECRET',
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
