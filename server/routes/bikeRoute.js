var bikeController = require('../controllers/bikeController.js');

module.exports = function (app) {
  app.get('/', bikeController.get);
};
