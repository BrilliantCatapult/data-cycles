var jsonRequestDate = function(start_date, end_date){
  var result;
  var serverDate = d3.time.format("%-m/%d/%Y 00:00");

  d3.json("/api/timeline/slider?start_date=" + serverDate(start_date) + "&end_date=" + serverDate(end_date), function(error, json) {
    if (error) {
      console.log("error", error);
    }
    console.log("successsssss--------->", json);
    result = parseDBJson(json);
  });

  return result;
};

