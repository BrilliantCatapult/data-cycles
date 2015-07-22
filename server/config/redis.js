var redis = require('redis');
// var elasticClient = require('../config/elasticsearch');
var time = require('moment');
var url = require('url');

if (process.env.REDIS_URL){
  var redisURL = url.parse(process.env.REDIS_URL);
  var redisClient = redis.createClient(redisURL.port, redisURL.hostname);
  redisClient.auth(redisURL.auth.split(":")[1]);
}
else {
  var redisClient = redis.createClient();
}

redisClient.on('connect', function(){
  console.log('connected to redis! :D')
});



module.exports = redisClient;