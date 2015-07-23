var redis = require('redis');
// var elasticClient = require('../config/elasticsearch');
var time = require('moment');
var url = require('url');

var redisURL = process.env.REDIS_URL ? url.parse(process.env.REDIS_URL) : url.parse(process.env.redis);
var redisClient = redis.createClient(redisURL.port, redisURL.hostname);
redisClient.auth(redisURL.auth.split(":")[1]);

redisClient.on('connect', function(){
  console.log('connected to redis! :D')
});



module.exports = redisClient;