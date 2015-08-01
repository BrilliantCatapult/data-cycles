var mlController = require('../controllers/mlController.js');

module.exports = function (app) {
  app.get('/predictions', mlController.get);
};