var elasticClient = require('../config/elasticsearch');

module.exports = {
  get: function (req, res, next) {
    var date = req.query.date;
    var order = req.query.order;
    var size = req.query.size || 700;
    elasticClient.search({
      index: 'bikeshare',
      type: 'trip',
      body: { 
        "aggs": {
            "rides_per_bike": {
                "terms": {
                    "field": "bike_id",
                    "size": size,
                    "order": {
                        "_count": order
                    }
                }
            }
          }
      }
      // type: 'testtype',
      // id: '3'
      //q: 'fare:'+date
    }).then(function (resp) {
      var hits = resp.hits.hits;
      //console.log(resp);
      res.json(resp);
    }, function (err) {
      res.json({"message": "oh no"})
      console.trace(err.message);
    });
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