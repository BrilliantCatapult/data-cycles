var stationController = require('../controllers/stationController.js');

module.exports = function (app) {
  app.get('/', stationController.get);
};
