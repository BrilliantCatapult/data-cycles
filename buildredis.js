require('dotenv').load();
var redisClient = require('./server/config/redis');
var elasticClient = require('./server/config/elasticsearch');
var time = require('moment');

var esResponse;
var esHash = {};
var startDate = "2013/08/29";
var endDate = "2013/08/30";
// console.log(elasticClient);

var buildRedis = function(startDate, endDate) {
  if (endDate === "2014/09/01") {
    killConnection();
    return;

  }
  startDate = time(startDate, "YYYY/MM/DD");
  endDate = time(endDate, "YYYY/MM/DD");
  // console.log(startDate, endDate);
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
          multi.hmset(key, esHash[key], redis.print);
        };

        multi.exec(function(err, replies){
          console.log(replies);
        });

        
        startDate = endDate.format("YYYY/MM/DD");
        endDate.add(1, 'd');

        buildRedis(startDate, endDate.format("YYYY/MM/DD"));

        // res.json(resp);
      }, function (err) {
        // res.json({"message": "oh no"})
        console.trace(err.message);
      });
};

// redisClient.on('connect', function() {
//   console.log("inside buildRedis");
  buildRedis(startDate, endDate);
// })


var killConnection = function(){ 
  redisClient.quit();
  elasticClient.close();
};
