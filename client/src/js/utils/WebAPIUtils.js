//
var d3 = require('d3');

var Utils = {};

Utils.pluck = function(obj, key){
  return obj.map(function(element, index){
    return element[key];
  });
};

// have all server queries here!
Utils.getAllMessages = function(){
  var saved_messages = JSON.parse(localStorage.getItem('saved_messages'));
  D3ServerAction.receiveAll(saved_messages, 1);
};

Utils.getAllOtherMessages = function(){
  var saved_messages = JSON.parse(localStorage.getItem('saved_messages2'));
  D3ServerAction.receiveAll(saved_messages, 2);
};
Utils.getBubbleData = function(id, start_date, end_date){
  var D3ServerAction = require('../actions/D3ServerAction');
  if(id === "4"){
    d3.json("/api/bikes?order=desc&start_date="+start_date+"&end_date="+end_date, function(data){
      data = data.aggregations.filter_by_date.rides_per_bike.buckets;
      D3ServerAction.receiveBubble(data, id);
    });
  }
};
Utils.getStationData = function(){
  var D3ServerAction = require('../actions/D3ServerAction');
  
    d3.json("/api/stations", function(data){
      //data = data.fields;
      D3ServerAction.receiveStation(data);
    });
  
};
Utils.getInfoData = function(id, order, start_date, end_date){
  var D3ServerAction = require('../actions/D3ServerAction');

  d3.json("/api/bikes?size=1&order="+order+"&start_date="+start_date+"&end_date="+end_date, function(data) {
    D3ServerAction.receiveInfo(id, data);
  });
},
Utils.getLineData = function(id, start_date, end_date){
  var D3ServerAction = require('../actions/D3ServerAction');
  if(id === "5"){
    
    d3.xhr('/api/trip/station_activity')
        .header("Content-Type", "application/json")
        .post(
            JSON.stringify({start_date: start_date, end_date: end_date}),
            function(err, rawData){
                var array = JSON.parse(rawData.response).aggregations.activity_per_station.buckets;
                    D3ServerAction.receiveLine(array, id);
                }
        );
  } else if(id === "6"){
    d3.xhr('/api/trip/station_activity')
        .header("Content-Type", "application/json")
        .post(
            JSON.stringify({start_date: start_date, end_date: end_date, field: "end_terminal"}),
            function(err, rawData){
                var array = JSON.parse(rawData.response).aggregations.activity_per_station.buckets;
                    D3ServerAction.receiveLine(array, id);
                }
        );
  }
};
Utils.getServerData = function(id, start_date, end_date){
  var D3ServerAction = require('../actions/D3ServerAction');
  if(id === "1"){
    d3.json("/api/bikes?size=10&order=desc&start_date="+start_date+"&end_date="+end_date, function(data){
      data = data.aggregations.filter_by_date.rides_per_bike.buckets;
      D3ServerAction.receiveAll(data, id);
    });
  }
  else if(id==="2"){
    d3.json("/api/bikes?size=10&order=asc&start_date="+start_date+"&end_date="+end_date, function(data){
      data = data.aggregations.filter_by_date.rides_per_bike.buckets;
      D3ServerAction.receiveAll(data, id);
    }); 
  }
  else if(id==="3"){
    d3.json("/api/bikes?order=desc&start_date="+start_date+"&end_date="+end_date, function(data){
      var group = 70;
      data = data.aggregations.filter_by_date.rides_per_bike.buckets;
      g=[];
      var num = 1;
      while(data.length>0){
        var arr = Utils.pluck(data.splice(0, group), "doc_count");
        var value = arr.reduce(function(memo, element){
          return memo + element;
        }, 0)/group; // avg
        g.push({doc_count: value, key: num});
        num++;
      }
      data = g;
      D3ServerAction.receiveAll(data, id);
    }); 
    
  } 
};


module.exports = Utils; 