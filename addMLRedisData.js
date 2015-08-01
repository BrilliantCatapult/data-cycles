require('dotenv').load();
var redis = require('./server/config/redisgreen');
var data = require('./server/redisMLData.js'); 

var addData = function(){
    var multi = redis.multi();

    var mlHash = {};
    for(var keys in data){
      for(var key in data[keys]){
         for(k in data[keys][key]){
            mlHash[keys+":"+key+":"+k] = data[keys][key][k]
         }
      }
    }
    
    for (var key in mlHash){
      multi.hmset(key, mlHash[key]);
    };

    multi.exec(function(err, replies){
      console.log(replies);
      redis.quit();
    });


};
addData();
