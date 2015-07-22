var redisController = require('../controllers/redisController.js');

// This file handles the user routing
// pass control over to the userController

module.exports = function (app) {

  app.get('/', redisController.get);
  app.post('/', redisController.post);

};
