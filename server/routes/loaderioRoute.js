var loaderioController = require('../controllers/loaderioController.js');

// This file handles the user routing
// pass control over to the userController

module.exports = function (app) {

  app.get('/', loaderioController.get);

};
