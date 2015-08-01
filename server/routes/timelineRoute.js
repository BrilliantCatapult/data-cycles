var timelineController = require('../controllers/timelineController.js');


module.exports = function (app) {
  app.get('/', timelineController.get);
  app.get('/calendar', timelineController.calendar);
  app.get('/docks', timelineController.docks);
};
