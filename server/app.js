const express = require('express');
const session = require('express-session');
const port = process.env.PORT || 5000;
const passport = require('passport');
const MySQLStore = require('express-mysql-session')(session);

const app = express();

require('./auth')(passport);
require('dotenv-safe').config();

app.use(session({
    store: new MySQLStore({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 } //30min
}));

(async () => {
  try {
    await require('./db').connect();
  } catch (err) {
    return console.log(err);
  }
})()

app.use(express.static(__dirname));
app.listen(port, () => console.log('App listening on port ' + port));

app.use(passport.initialize());
app.use(passport.session());

