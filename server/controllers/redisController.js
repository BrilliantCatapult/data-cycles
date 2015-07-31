// var redisClient = require('../config/redis');
var redisGreen = require('../config/redisgreen');

var stations = [41,42,45,46,47,48,49,50,51,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,82];

module.exports = {
  get: function (req, res, next) {
    var startDate = req.query.start_date || "2013/12/18";
    var multi = redisGreen.multi();
    console.log(startDate);
    for (var i = 0; i < stations.length; i++){
      multi.hgetall(stations[i] + ":" + startDate);
    };

    multi.exec(function(err, replies) {
      if (err) {
        console.log(err);
      }
      else {
        res.json(replies);
      }
<<<<<<< HEAD
    })

  }, 
=======
    });
  },
>>>>>>> code cleanup

  trips: function (req, res, next) {
    var startDate = req.query.start_date || "12/18/2013";
    var multi = redisGreen.multi();
    var trips;    

    redisGreen.hget("tripTotals", startDate, function(err, total) {
      trips = total;
      console.log(trips);

      for (var i = 0; i <= trips; i++){
        multi.hgetall("trip:" + i + ":" + startDate);
      };

      multi.exec(function(err, replies) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(replies);
          res.json(replies);
        }
      });
    });
  }
};