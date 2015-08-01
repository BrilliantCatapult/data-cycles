require('dotenv').load();
var elasticClient = require('./server/config/elasticsearch');
var time = require('moment');
var redis = require('redis');
var url = require('url');

var redisgreen = process.env.REDISGREEN_URL ? url.parse(process.env.REDISGREEN_URL) : url.parse(process.env.redisgreen);
var redisClient = redis.createClient(redisgreen.port, redisgreen.hostname);
 redisClient.auth(redisgreen.auth.split(":")[1]);

redisClient.on('connect', function(){
  console.log('connected to redis! :D -- local Edition')
});

var esResponse;
var esHash = {};
var startDate = "2013/08/29";
var endDate = "2013/08/30";
var startBikeDate = "8/29/2013";
var endBikeDate = "8/30/2013";

var buildDockData = function(startDate, endDate) {
  if (endDate === "2014/09/01") {
    buildBikeData(startBikeDate, endBikeDate);
    return;

  }
  startDate = time(startDate, "YYYY/MM/DD");
  endDate = time(endDate, "YYYY/MM/DD");
  elasticClient.search({
        index: 'bikeshare',
        type: 'rebalancing',
        searchType: 'count',
        body: {
          "aggs": {
              "first_daily_event": {
                  "filter": {
                      "bool": {
                          "must": {
                              "and": [{
                                  "range": {
                                      "time": {
                                          "gte": startDate.format("YYYY/MM/DD") + " 00:00:00",
                                          "lte": endDate.format("YYYY/MM/DD") + " 00:00:00"
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
                              "field": "station_id",
                              "size": 40
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
        esResponse = resp;
        var path = esResponse.aggregations.first_daily_event.station_group.buckets;
        var multi = redisClient.multi();

        for (var i = 0; i < path.length; i++) {
          for (var objKey in path[i].lowest_score_top_hits.hits.hits[0]["_source"]) {
            esHash[path[i]["key"] + ":" + startDate.format("YYYY/MM/DD")] = esHash[path[i]["key"] + ":" + startDate.format("YYYY/MM/DD")] || {};
            esHash[path[i]["key"] + ":" + startDate.format("YYYY/MM/DD")][objKey] = path[i].lowest_score_top_hits.hits.hits[0]["_source"][objKey];
            multi.hmset("stations", path[i]["key"], path[i]["key"]);
          }
        };
        

        for (var key in esHash){
          multi.hmset(key, esHash[key]);
        };

        multi.exec(function(err, replies){
          console.log(replies);
        });

        
        startDate = endDate.format("YYYY/MM/DD");
        endDate.add(1, 'd');

        buildDockData(startDate, endDate.format("YYYY/MM/DD"));

      }, function (err) {
        console.trace(err.message);
      });
};

var buildBikeData = function(startDate, endDate) {
  if (endDate === "9/1/2014") {
    killConnection();
    return;

  }
  startDate = time(startDate, "M/D/YYYY");
  endDate = time(endDate, "M/D/YYYY");
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
                                  "gte": startDate.format("M/D/YYYY") + " 00:00",
                                  "lte": endDate.format("M/D/YYYY") + " 00:00"
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
        "size": 2000
      }
    }).then(function (resp) {
        esResponse = resp;
        var path = esResponse.hits.hits
        var multi = redisClient.multi();
        var bikeHash = {};

        for (var i = 0; i < path.length; i++) {
          for (var objKey in path[i]["_source"]) {
            bikeHash["trip:" + i + ":" + startDate.format("M/D/YYYY")] = bikeHash["trip:" + i + ":" + startDate.format("M/D/YYYY")] || {};
            bikeHash["trip:" + i + ":" + startDate.format("M/D/YYYY")][objKey] = path[i]["_source"][objKey];
          }
        };
        
        multi.hmset("tripTotals", startDate.format("M/D/YYYY"), esResponse.hits.total);
        

        for (var key in bikeHash){
          multi.hmset(key, bikeHash[key]);
        };

        multi.exec(function(err, replies){
          console.log(replies);
        });

        
        startDate = endDate.format("M/D/YYYY");
        endDate.add(1, 'd');

        buildBikeData(startDate, endDate.format("M/D/YYYY"));

      }, function (err) {
        console.trace(err.message);
      });
};

var killConnection = function(){ 
  redisClient.quit();
  elasticClient.close();
};

buildDockData(startDate, endDate);