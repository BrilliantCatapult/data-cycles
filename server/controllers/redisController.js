var redisClient = require('../config/redis');

var stations = [41,42,45,46,47,48,49,50,51,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,82];

module.exports = {
  get: function (req, res, next) {
    var multi = redisClient.multi();

    for (var i = 0; i < stations.length; i++){
      multi.hgetall(stations[i] + ":2013/12/18")
    };

    multi.exec(function(err, replies) {
      res.json(replies);
    })

  },

  post: function (req, res, next) {
    var date = req.query.date
    elasticClient.create({
      index: 'test',
      type: 'testtype',
      id: '1',
      body: {
        title: 'Test 1',
        tags: ['y', 'z'],
        published: true,
        published_at: '2013-01-01',
        counter: 1
      }
    }).then(function (resp) {
      //console.log("RESPONSE IS ", resp)
      res.json(resp);
    }, function (err) {
      console.trace(err.message);
    });
  }
};