// require all packages
var express = require('express');


// initialize express and pass to middleware 
// to handle everything
var app = express();

require('./config/middleware.js')(app, express);


module.exports = app;