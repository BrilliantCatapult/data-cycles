var bikeController = require('../controllers/bikeController.js');
var elasticClient = require('../config/elasticsearch.js');
// This file handles the user routing
// pass control over to the userController

module.exports = function (app) {

  app.get('/', bikeController.get);
  app.post('/', bikeController.post);

};
