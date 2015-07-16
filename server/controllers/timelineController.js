var elasticClient = require('../config/elasticsearch');

module.exports = {
  get: function (req, res, next) {
    var date = req.query.date;
    var order = req.query.order;
    var start_date = req.body.start_date || "12/18/2013 00:00";
    var end_date = req.body.end_date || "12/19/2013 00:00";
    var size = req.query.size || 700;
    elasticClient.search({
      index: 'bikeshare',
      type: 'trip',
      body: {
        "sort": {
          "start_date": "asc"  
        },
        "filter": {
            "bool": {
                "must": {
                    "and": [
                        {
                          "range" : {
                              "start_date": {
                                  "gte": start_date,
                                  "lte": end_date
                              }
                          }
                      },
                        {
                            "range": {
                                "start_terminal": {
                                    "gte": "41",
                                    "lte": "82"
                                }
                            }
                        }
                    ]
                }
            }
        },
        "size": 1000
      }
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