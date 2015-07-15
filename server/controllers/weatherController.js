var elasticClient = require('../config/elasticsearch');

module.exports = {
  /**
    Returns the mean temperature/ humidity/...
    from start to end date, for a given zipcode
    which is set to 94107 for now, the only
    available zipcode in San Francisco.
  */
  get: function (req, res, next) {
    var zipcode = req.query.zipcode || 94107;
    var start_date = req.query.start_date || "12/12/2013";
    var end_date = req.query.end_date || "12/13/2013";
    elasticClient.search({
      index: 'bikeshare',
      type: 'weather',
      body: {
        "query": {
          "filtered": {
            "query": {
              "term": {
                "zipcode": zipcode
              }
            },
            "filter": {
              "range": {
                "date": {
                  "lte": end_date,
                  "gte": start_date
                }
              }
            }
          }
        },
        "aggs": {
          "mean_temp": {
            "avg": {
                "field": "mean_temperature_f"
            }
          }
        }
      }
    }).then(function (resp) {
      var hits = resp.hits.hits;
      //console.log("WEATHER ",resp);
      res.json(resp);
    }, function (err) {
      res.json({"message": "oh no"})
      console.trace(err.message);
    });
  }

};