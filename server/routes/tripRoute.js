var tripController = require('../controllers/tripController.js');
// This file handles the user routing
// pass control over to the userController

module.exports = function (app) {

  app.post('/station_activity', tripController.stationActivity);
  app.post('/date_activity', tripController.dateActivity);

};
