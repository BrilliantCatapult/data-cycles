var redisClient = require('../config/redis');
// var stations = [41,42,45,46,47,48,49,50,51,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,82];
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
module.exports = {
  get: function (req, res, next) {
    var D = new Date(Date.parse(req.query.day));
    var day = days[D.getDay()];
    var station = req.query.station;
    console.log(station)
    console.log("DAYYYY: "+day, "QUERRRRYYY "+req.query.day);
    var hour = 0;
    var multi = redisClient.multi();
    // for (var i = 0; i < stations.length; i++){
      for(var j = 0; j < 24; j++){
       multi.hgetall(station + ":" + day + ":" + j);
      }
      multi.exec(function(err, replies) {
        if (err) {
          console.log(err)
        }
        else {
          console.log("data: ", replies)
          res.json(replies)
          // if(count === stations.length-1){
          //   res.json(arr);
          //   //res.send('OK');
          // }
        }
      })
    // };
    // // var arr=[];
    // var count = 0;
    // for (var i = 0; i < stations.length; i++){
    //   for(var j = 0; j < 24; j++){
    //    multi.hgetall(stations[i] + ":" + day + ":" + j);
    //   }
    // }
    }
}
