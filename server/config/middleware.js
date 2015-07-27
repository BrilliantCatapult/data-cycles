var bodyParser  = require('body-parser');
var helpers = require('./helpers.js');

module.exports = function (app, express) {

  var bikeRouter = express.Router();
  var weatherRouter = express.Router();
  var tripRouter = express.Router();
  var timelineRouter = express.Router();
  var redisRouter = express.Router();
  var mlRouter = express.Router();
  var loaderioRouter = express.Router();

  app.use(express.static('client/'));

  // configure elastic search
  // bodyParser to get data from POST requests
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.use('/api/bikes', bikeRouter);
  app.use('/api/weather', weatherRouter);
  app.use('/api/trip', tripRouter);
  app.use('/api/timeline', timelineRouter);
  app.use('/api/redis', redisRouter);
  app.use('/api/ml', mlRouter);
  app.use('/loaderio-a45c17137e179e372517a4677fbdb1e5', loaderioRouter);

  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  require('../routes/bikeRoute.js')(bikeRouter);
  require('../routes/weatherRoute.js')(weatherRouter);
  require('../routes/tripRoute.js')(tripRouter);
  require('../routes/timelineRoute.js')(timelineRouter);
  require('../routes/redisRoute.js')(redisRouter);
  require('../routes/mlRoutes.js')(mlRouter);
  require('../routes/loaderioRoute.js') (loaderioRouter);


  // client.ping({
  //   // ping usually has a 3000ms timeout 
  //   requestTimeout: Infinity,
   
  //   // undocumented params are appended to the query string 
  //   hello: "elasticsearch!"
  // }, function (error) {
  //   if (error) {
  //     console.trace('elasticsearch cluster is down!');
  //   } else {
  //     console.log('All is well');
  //   }
  // });
  

};