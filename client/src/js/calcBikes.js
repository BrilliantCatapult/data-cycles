var calcAvailableBikes = function(json) {
      var availableBikes = {};
      if (!json) { return availableBikes; }

      for (var i = 0; i < json.aggregations.first_daily_event.station_group.buckets.length; i++) {
        var path = json.aggregations.first_daily_event.station_group.buckets[i].lowest_score_top_hits.hits.hits[0]["_source"];
        availableBikes[path.station_id] = {
          "bikes_available": path.bikes_available, 
          "docks_available": path.docks_available, 
          "total": parseInt(path.bikes_available) + parseInt(path.docks_available)
        };
      }
      return availableBikes;
    };