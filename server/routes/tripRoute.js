var tripController = require('../controllers/tripController.js');

module.exports = function (app) {
  app.post('/station_activity', tripController.stationActivity);
  app.post('/date_activity', tripController.dateActivity);
  app.post('/bikes_available', tripController.bikesAvailable);
};
