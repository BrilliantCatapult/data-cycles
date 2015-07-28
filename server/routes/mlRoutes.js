var mlController = require('../controllers/mlController.js');

// This file handles the user routing
// pass control over to the userController

module.exports = function (app) {

  app.get('/predictions', mlController.get);
  // app.post('/predictions', mlController.post);

};