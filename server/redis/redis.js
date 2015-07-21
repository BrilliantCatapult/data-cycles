var redis = require('redis');
var redisClient = redis.createClient();
var elasticsearch = require('elasticsearch');
var time = require('moment');
require('dotenv').load();

var express = require('express');

var app = express()

var port = process.env.PORT || 3000;


//var auth = require('./elasticAuth.js')

var elasticClient = new elasticsearch.Client({
    host: 'http://' + process.env.username + ':' + process.env.password + '@b856e0e6cb149c5f2876528086313183.us-east-1.aws.found.io:9200',
    //host: 'localhost:9200',
    log: 'trace'
  });

time().format();

app.listen(port, function () {
  console.log("Listening to port " + port);
});

redisClient.on('connect', function(){
  console.log('connected to redis! :D')
});

var esResponse;
var esHash = {};
var startDate = "2013/08/29";
var endDate = "2013/08/30";

// console.log(startDate.format("YYYY/MM/DD"));
// endDate = startDate;
// console.log(endDate.add(1, 'd').format("YYYY/MM/DD"));

var buildRedis = function(startDate, endDate) {
  if (endDate === "2014/09/01") {
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
            multi.hmset("stations", path[i]["key"], path[i]["key"], redis.print);
          }
        };
        

        for (var key in esHash){
          multi.hmset(key, esHash[key], redis.print);
        };

        multi.exec(function(err, replies){
          console.log(replies);
        });

        // var serverStartDate = startDate.getFullYear() + "/";
        // serverStartDate += startDate.getMonth() >= 10 ? startDate.getMonth() + "/" : "0" + startDate.getMonth() + "/";
        // serverStartDate += startDate.getDate() >= 10 ? startDate.getDate(): "0" + startDate.getDate();

        // var tempEndDate = endDate.split("/");
        // tempEndDate = new Date(tempEndDate[0], tempEndDate[1], tempEndDate[2])
        // startDate = endDate;
        // console.log(tempEndDate, "temp");

        // tempEndDate = new Date(tempEndDate.setDate(tempEndDate.getDate() + 1));

        // var nextEndDate = tempEndDate.getFullYear() + "/";
        // nextEndDate += tempEndDate.getMonth() >= 10 ? tempEndDate.getMonth() + "/" : "0" + tempEndDate.getMonth() + "/";
        // nextEndDate += tempEndDate.getDate() >= 10 ? tempEndDate.getDate(): "0" + tempEndDate.getDate();
        startDate = endDate.format("YYYY/MM/DD");
        endDate.add(1, 'd');
        // console.log(startDate, endDate.format("YYYY/MM/DD"), "2nd check")

        buildRedis(startDate, endDate.format("YYYY/MM/DD"));

        // res.json(resp);
      }, function (err) {
        // res.json({"message": "oh no"})
        console.trace(err.message);
      });

  // var newDate = startDate.setDate(startDate.getDate() + 1);
  // startDate = new Date(newDate);
}

buildRedis(startDate, endDate)