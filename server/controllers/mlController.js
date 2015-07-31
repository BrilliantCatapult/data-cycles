var redisClient = require('../config/redisgreen');
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

module.exports = {
  get: function (req, res, next) {
    var D = new Date(Date.parse(req.query.day));
    var day = days[D.getDay()];
    var station = req.query.station;
    var hour = 0;
    var multi = redisClient.multi();

    for(var j = 0; j < 24; j++){
       multi.hgetall(station + ":" + day + ":" + j);
    }

    multi.exec(function(err, replies) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("data: ", replies);
        res.json(replies);
      }
    });
  }
};