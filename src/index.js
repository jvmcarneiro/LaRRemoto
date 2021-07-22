import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

const express = require('express');
const app = express();
app.use(express.static(__dirname));

const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);
app.listen(port, () => console.log('App listening on port ' + port));

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
