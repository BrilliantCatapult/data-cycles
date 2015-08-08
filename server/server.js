/**
 * @module server  
 */
var express = require('express');
var compression = require('compression');

/** initialize express and pass to middleware to handle everything */
var app = express();

app.use(compression());


/** middleware passing in the app and the express package */
require('./config/middleware.js')(app, express);


module.exports = app;