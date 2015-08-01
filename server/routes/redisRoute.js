var redisController = require('../controllers/redisController.js');

module.exports = function (app) {
  app.get('/', redisController.get);
  app.get('/trips', redisController.trips);
};
