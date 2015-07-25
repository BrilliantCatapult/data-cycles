var firstLoad = false;


var fetchNewDate = function(start_date, end_date){
  var serverDate = d3.time.format("%-m/%d/%Y 00:00");
  var docksDate = d3.time.format("%Y/%m/%d");
  
  var tripStartDate = start_date ? serverDate(start_date) : "12/18/2013 00:00";
  var tripEndDate = end_date ? serverDate(end_date) : "12/19/2013 00:00";
  var dockStartDate = start_date ? docksDate(start_date) : "2013/12/18";
  // console.log(start_date);
  // console.log(serverDate(start_date));
  d3.json("/api/timeline/calendar?start_date=" + tripStartDate + "&end_date=" + tripEndDate, function(error, tripJson) {
    if (error) {
      console.log("error", error);
    }
    console.log(tripJson);
    var bikesJson = buildBikesJson(tripJson);
    console.log("elastic successsssss--------->", bikesJson);

    d3.json("/api/redis?start_date=" + dockStartDate, function(error, docksJson) {
      if (error) {
        console.log("error", error);
      }

      var docksHash = buildDocksHash(tripJson, docksJson);
      console.log("redis successsssss--------->", docksHash);
      drawRoutes(bikesJson);
      drawDocks(docksHash);

      if (!firstLoad) {
        loaded();
        firstLoad = true;
      }
    });
  });
}