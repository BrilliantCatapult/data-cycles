var times = {0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[], 10:[], 11:[], 12:[], 13:[], 14:[], 15:[], 16:[], 17:[], 18:[], 19:[], 20:[], 21:[], 22:[], 23:[]}
var a = JSON.parse(JSON.stringify(times));
var b = JSON.parse(JSON.stringify(times));
var c = JSON.parse(JSON.stringify(times));
var d = JSON.parse(JSON.stringify(times));
var e = JSON.parse(JSON.stringify(times));
var f = JSON.parse(JSON.stringify(times));
var g = JSON.parse(JSON.stringify(times));
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var week = {'Sunday':a,'Monday':b,'Tuesday':c,'Wednesday':d,'Thursday':e,'Friday':f,'Saturday':g};

for(var i = 0; i < dock.by_date.buckets.length; i++){
  for(var j = 0; j < dock.by_date.buckets[i].by_hour.buckets.length; j++){
    var t = dock.by_date.buckets[i].by_hour.buckets[j].key_as_string.split(' ')[1].slice(0, 2);
    if(t[0] === "0"){
      t = t[1]
    }
    var t2 = dock.by_date.buckets[i].by_hour.buckets[j].key_as_string.split(' ')[0]
    var D = new Date(Date.parse(t2));
    var day = days[D.getDay()]
    week[day][t].push(dock.by_date.buckets[i].by_hour.buckets[j].avg_bikes.value)
  }
}
