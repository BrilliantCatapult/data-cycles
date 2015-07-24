var timelineController = require('../controllers/timelineController.js');
var elasticClient = require('../config/elasticsearch.js');
// This file handles the user routing
// pass control over to the userController

module.exports = function (app) {

  app.get('/', timelineController.get);
  app.get('/calendar', timelineController.calendar);
  app.get('/docks', timelineController.docks);
  app.post('/', timelineController.post);

};
