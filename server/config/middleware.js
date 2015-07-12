var bodyParser  = require('body-parser');
var helpers = require('./helpers.js');

module.exports = function (app, express) {

  var bikeRouter = express.Router();

  app.use(express.static(__dirname +'../../client'));

  // configure elastic search
  // bodyParser to get data from POST requests
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.use('/api/bikes', bikeRouter);
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  require('../routes/bikeRoute.js')(bikeRouter);

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