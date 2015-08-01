var elasticClient = require('../config/elasticsearch');

module.exports = {
  get: function (req, res, next) {
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;
    var order = req.query.order;
    var size = req.query.size || 700;
    elasticClient.search({
      index: 'bikeshare',
      type: 'trip',
      body: { 
            "aggs": {
                "filter_by_date":{
                    "filter": {
                        "range" : {
                            "start_date": {
                                "gte": start_date,
                                "lte": end_date
                            }
                        }
                    },
                    "aggs":{
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
  }
};