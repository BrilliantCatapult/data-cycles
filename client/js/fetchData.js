var serverDate = d3.time.format("%-m/%d/%Y 00:00");
var docksDate = d3.time.format("%Y/%m/%d");


var fetchNewDate = function(start_date, end_date){
  if (!start_date) {
    start_date = "2013/12/18"
  }
  if (!end_date) {
    end_date = "2013/12/19"
  }
  
  d3.json("/api/timeline/calendar?start_date=" + serverDate(start_date) + "&end_date=" + serverDate(end_date), function(error, tripJson) {
    if (error) {
      console.log("error", error);
    }

    var bikesJson = buildBikesJson(tripJson);
    console.log("elastic successsssss--------->", bikesJson);

    d3.json("/api/redis?start_date=" + docksDate(start_date), function(error, docksJson) {
      if (error) {
        console.log("error", error);
      }

      var docksHash = buildDocksHash(tripJson, docksJson);
      console.log("redis successsssss--------->", docksHash);
      drawRoutes(bikesJson);
      drawDocks(docksHash);
      // loaded();
    });
  });
}