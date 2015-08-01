var loaderioController = require('../controllers/loaderioController.js');

module.exports = function (app) {
  app.get('/', loaderioController.get);
};
