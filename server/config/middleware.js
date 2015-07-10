var elasticsearch = require('elasticsearch');

module.exports = function (app, express) {
  app.use(express.static('client'));

  // configure elastic search
  var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
  });

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