var timelineController = require('../controllers/timelineController.js');
var elasticClient = require('../config/elasticsearch.js');
// This file handles the user routing
// pass control over to the userController

module.exports = function (app) {

  app.get('/', timelineController.get);
  app.get('/slider', timelineController.slider);
  app.post('/', timelineController.post);

};
