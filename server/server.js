/**
 * @module server  
 */
var express = require('express');

/** initialize express and pass to middleware to handle everything */
var app = express();


/** middleware passing in the app and the express package */
require('./config/middleware.js')(app, express);


module.exports = app;