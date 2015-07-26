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
  // gets messages from localstorage.
  // as if from database.
  var saved_messages = JSON.parse(localStorage.getItem('saved_messages'));
  // have messages, now call action.
  D3ServerAction.receiveAll(saved_messages, 1);
};

Utils.getAllOtherMessages = function(){
  var saved_messages = JSON.parse(localStorage.getItem('saved_messages2'));
  // have messages, now call action.
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
  }
};
Utils.getServerData = function(id, start_date, end_date){
  console.log("returning for id ", id);
  // instead get from db based on id, and promisify!!
  //var saved_messages = JSON.parse(localStorage.getItem('saved_messages' + id));
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
  // have messages, now call action.
  // return saved_messages;
  //D3ServerAction.readyToReceive(saved_messages, id); 
};


module.exports = Utils; 