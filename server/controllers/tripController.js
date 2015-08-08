var elasticClient = require('../config/elasticsearch');

module.exports = {
  dateActivity: function(req, res, next){
    var zipcode = req.body.zipcode || 94107;
    var start_date = req.body.start_date || "12/12/2013 00:00";
    var end_date = req.body.end_date || "12/13/2013 00:00";
    var field = req.body.field || "start_terminal";
    elasticClient.search({
      index: 'bikeshare',
      type: 'trip',
      body: { 
        "query": {
          "filtered": {
            "filter": {
              "range": {
                "start_date": {
                  "lte": end_date,
                  "gte": start_date
                }
              }
            }
          }
        },
        "aggs": {
          "activity_per_hour" : {
            "date_histogram" : {
              "field" : "start_date", 
              "interval" : "hour"
            }
          } 
        }
      }
    }).then(function (resp) {
      var hits = resp.hits.hits;
      res.json(resp);
    }, function (err) {
      res.json({"message": "error with dateActivity"})
      console.trace(err.message);
    });
  },
  stationActivity: function (req, res, next) {
    var zipcode = req.body.zipcode || 94107;
    var start_date = req.body.start_date || "12/12/2013 00:00";
    var end_date = req.body.end_date || "12/13/2013 00:00";
    var field = req.body.field || "start_terminal";
    var sort = {};
    sort[field] = {"order":"desc"};
    //sort[field] = "desc";
    elasticClient.search({
      index: 'bikeshare',
      type: 'trip',
      body: { 
        "query": {
          "filtered": {
            "filter": {
              "range": {
                "start_date": {
                  "lte": end_date,
                  "gte": start_date
                },
                //sort: sort
              }, 
            },
          },
          
        },
        //sort: sort, 
        "aggs": {
          //"sort" : sort,
          "activity_per_station": {
            //sort: sort,
            "terms": {
              "field": field,
              "size": 700,
              // "sort": [
              //   sort
              //  ]
               "order": {"_term": "asc"}
               
            },
            "aggs" : {
              "activity_per_hour" : { 
                "date_histogram" : { 
                  "field" : "start_date", 
                  "interval" : "hour",
                  // "sort": [{"key": {"order": "asc"}}]

                  // "order": {"_count": "asc"}
                },
                //"order": {"start_terminal": "asc"} 
              }
            }
          },
        },
          //sort: sort
      }
    }).then(function (resp) {
      var hits = resp.hits.hits;
      res.json(resp);
    }, function (err) {
      res.json({"message": "error with stationActivity"})
      console.trace(err.message);
    });
  },
  bikesAvailable: function (req, res, next) {
    var zipcode = req.body.zipcode || 94107;
    var start_date = req.body.start_date || "2014/02/09 00:00:00";
    var end_date = req.body.end_date || "2014/02/09 00:00:05";
    var field = req.body.field || "start_terminal";
    elasticClient.search({
      index: 'bikeshare',
      type: 'rebalancing',
      body: { 
          "aggs": {
            "first_daily_event": {
              "filter": {
                "bool": {
                  "must": {
                    "and": [{
                      "range": {
                          "time": {
                              "gte": start_date,
                              "lte": end_date
                          }
                      }
                  },
                  {
                      "range": {
                          "station_id": {
                              "gte": "41",
                              "lte": "82"
                          }
                      }
                  }]
              }
          }
      },
      "aggs": {
          "station_group": {
              "terms": {
                  "field": "station_id"
              },
              "aggs": {
                  "lowest_score_top_hits": {
                    "top_hits": {
                      "size":1,
                      "sort": [{"time": {"order": "asc"}}]
                    }
                  }
                }
              }
            }
          }
        }
      }
    }).then(function (resp) {
      var hits = resp.hits.hits;
      res.json(resp);
    }, function (err) {
      res.json({"message": "errror with bikesAvailable"})
      console.trace(err.message);
    });
  }
};