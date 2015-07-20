/*
CODE FOR Weather VS Activity CHART
*/

(function(){

var tooltip;

var setupChart = function(){
  if(d3.select(".tooltip").empty()){
    tooltip = d3.select("body").append("div");
    tooltip.attr("class", "tooltip top-right");
    // tooltip.append("div").attr("class", "tooltip-arrow");
    tooltip.append("div").attr("class", "tooltip-inner");
    tooltip.style("opacity", 0);
  } else {
    tooltip = d3.select(".tooltip");
  }
};

var createWeatherChart = function(start_date, end_date){

  var plotData = function(data, element){
    

    var bisectDate = d3.bisector(function(d) {
       return d.date; 
     }).left;

    var maxY;

    var margin = {top: 20, right: 180, bottom: 30, left: 50},
        width = d3.select("#"+element).node().offsetWidth - margin.left - margin.right,
        height = 500 + margin.top + margin.bottom;

    var parseDate = d3.time.format("%m/%d/%Y %H:%M").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(d3.time.hour, 1)
        .tickFormat(d3.time.format("%I %p"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.activity); })

    var svg = d3.select("#"+element).append("svg")
        .attr("id", element+"_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      color.domain([0,100]);

      
       var activity = data.map(function(station) {
        return {
          name: station.key,
          values: station.activity_per_hour.buckets.map(function(d) {
            return {date: parseDate(d.key_as_string), activity: +d.doc_count};
          }),
          visible: true
        };

      });

      x.domain([parseDate(start_date), parseDate(end_date)]);

      y.domain([
        0,
        d3.max(activity, function(c) { return d3.max(c.values, function(v) { return v.activity; }); })
      ]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Station Activity [start terminal]");

      // Create invisible rect for mouse tracking
      svg.append("rect")
          .attr("width", width)
          .attr("height", height)                                    
          .attr("x", 0) 
          .attr("y", 0)
          .attr("class", "mouse-tracker")
          .style("fill", "white");

      var city = svg.selectAll(".city")
          .data(activity)
        .enter().append("g")
          .attr("class", "city");

      city.append("path")
          .attr("class", "line")
          .style("stroke", function(d) { return color(Number(d.name)); })
          .attr("id", function(d) {
            return "line-" + d.name; // Give line id of line-(insert issue name, with any spaces replaced with no spaces)
          })
          .attr("d", function(d) { 
            return d.visible ? line(d.values) : null; // If array key "visible" = true then draw line, if not then don't 
          })
          .on("mouseover", function(d) {
              tooltip.transition()
              .duration(200)
              .style("opacity", .9);

              d3.select('.tooltip-inner').html("Station #"+d.name);

              tooltip
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
                 
          })
          .on("mouseout", function() {
              // Remove the info text on mouse out.
               tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
          });
      
      // DRAW LEGEND

      // draw legend
       function findMaxY(data){  // Define function "findMaxY"
           var maxYValues = data.map(function(d) { 
             if (d.visible){
               return d3.max(d.values, function(value) { // Return max rating value
                 return value.activity; })
             }
           });
           return d3.max(maxYValues);
         }


       var legendSpace = 450 / activity.length; // 450/number of issues (ex. 40)    

       city.append("rect")
       .attr("width", 10)
       .attr("height", 10)                                    
       .attr("x", width + (margin.right/3) - 15) 
       .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 8; })  // spacing
       .attr("fill",function(d) {
         return d.visible ? color(d.name) : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey 
       })
       .attr("class", "legend-box")

       .on("click", function(d){ // On click make d.visible 
         d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true

         maxY = findMaxY(activity); // Find max Y rating value categories data with "visible"; true
         y.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
         svg.select(".y.axis")
           .transition()
           .duration(500)
           .call(yAxis);   

         city.select("path")
           .transition()
           .duration(500)
           .attr("d", function(d){
             return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
           });

         city.select("rect")
           .transition()
           .attr("fill", function(d) {
           return d.visible ? color(d.name) : "#F1F1F2";
         });
       })

       .on("mouseover", function(d){

         d3.select(this)
           .transition()
           .attr("fill", function(d) { return color(d.name); });

         d3.select("#line-" + d.name)
           .transition()
           .style("stroke-width", 2.5);  
       })

       .on("mouseout", function(d){

         d3.select(this)
           .transition()
           .attr("fill", function(d) {
           return d.visible ? color(d.name) : "#F1F1F2";});

         d3.select("#line-" + d.name)
           .transition()
           .style("stroke-width", 1.5);
       });
       
   city.append("text")
       .attr("x", width + (margin.right/3)) 
       .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); })  // (return (11.25/2 =) 5.625) + i * (5.625) 
       .text(function(d) { return d.name; }); 


   // Hover line 
     var hoverLineGroup = svg.append("g") 
               .attr("class", "hover-line");

     var hoverLine = hoverLineGroup // Create line with basic attributes
           .append("line")
               .attr("id", "hover-line")
               .attr("x1", 10).attr("x2", 10) 
               .attr("y1", 0).attr("y2", height + 10)
               .style("pointer-events", "none") // Stop line interferring with cursor
               .style("opacity", 1e-6); // Set opacity to zero 

     var hoverDate = hoverLineGroup
           .append('text')
               .attr("class", "hover-text")
               .attr("y", height - (height-40)) // hover date text position
               .attr("x", width - 150) // hover date text position
               .style("fill", "#E6E7E8");

     var columnNames = ['activity']

     var focus = city.select("g") // create group elements to house tooltip text
         .data(activity) // bind each column name date to each g element
       .enter().append("g") //create one <g> for each columnName
         .attr("class", "focus"); 

     focus.append("text") // http://stackoverflow.com/questions/22064083/d3-js-multi-series-chart-with-y-value-tracking
           .attr("class", "tooltip2")
           .attr("x", width + 20) // position tooltips  
           .attr("y", function (d, i) {
            return (legendSpace)+i*(legendSpace); 
            }); // (return (11.25/2 =) 5.625) + i * (5.625) // position tooltips       

     // Add mouseover events for hover line.
     svg.select(".mouse-tracker") // select chart plot background rect #mouse-tracker
     .on("mousemove", mousemove) // on mousemove activate mousemove function defined below
     .on("mouseout", function() {
         hoverDate
             .text(null) // on mouseout remove text for hover date

         d3.select("#hover-line")
             .style("opacity", 1e-6); // On mouse out making line invisible
     });

     function mousemove() { 
         var mouse_x = d3.mouse(this)[0]; // Finding mouse x position on rect
         var graph_x = x.invert(mouse_x); // 

         var format = d3.time.format('%b %Y'); // Format hover date text to show three letter month and full year
         
         hoverDate.text(format(graph_x)); // scale mouse position to xScale date and format it to show month and year
         
         d3.select("#hover-line") // select hover-line and changing attributes to mouse position
             .attr("x1", mouse_x) 
             .attr("x2", mouse_x)
             .style("opacity", 1); // Making line visible

         var x0 = x.invert(d3.mouse(this)[0]); /* d3.mouse(this)[0] returns the x position on the screen of the mouse. xScale.invert function is reversing the process that we use to map the domain (date) to range (position on screen). So it takes the position on the screen and converts it into an equivalent date! */
  
         focus
         .selectAll("text").text(function(d){
            i = bisectDate(d.values, x0, 0); // use our bisectDate function that we declared earlier to find the index of our data array that is close to the mouse cursor
            d0 = d.values[i - 1];
            d1 = d.values[i];
            if(d1 && d0)
              d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            else if(d0)
              d = d0;
            else
              d={activity: null};

            console.log(d);
            return (d.activity);
         });
     }; 

     var redraw = function(){
      console.log("redrawing.")

      width = d3.select("#"+element).node().offsetWidth - margin.left - margin.right,
      height = 500 + margin.top + margin.bottom;


      x.range([0, width]);

      
      xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .ticks(d3.time.hour)
          .tickFormat(d3.time.format("%I %p"));
      
      line
        .x(function(d) { return x(d.date); })

      d3.select("#"+element+"_svg")
        .attr("width", width + margin.left + margin.right)
      
      svg.select(".x.axis")
          .call(xAxis);


      svg.select("rect")
          .attr("width", width)
 
      city.select(".line")
          .attr("d", function(d) { 
            return d.visible ? line(d.values) : null; // If array key "visible" = true then draw line, if not then don't 
          })

      hoverDate.select(".hover-text")
                .attr("x", width - 150) // hover date text position                


      focus.select(".tooltip2")
            .attr("x", width + 20) // position tooltips  

       city.select('rect')
       .attr("x", width + (margin.right/3) - 15) ;
      
      city.select("text")
       .attr("x", width + (margin.right/3));
     };

     d3.select(window).on('resize.'+element, function(){
      redraw();
     });

  };

  // want to display for this day.
  // all station activity and show the weather.
  // so station activity across the day.
  d3.json('/api/weather?start_date='+start_date.split(" ")[0]+'&end_date='+end_date.split(" ")[0], function(error, data){ //start_date=12/12/2013&end_date=12/13/2013
    d3.select("#weather").html(data.aggregations.mean_temp.value);
  });

  d3.xhr('/api/trip/station_activity')
      .header("Content-Type", "application/json")
      .post(
          JSON.stringify({start_date: start_date, end_date: end_date}),
          function(err, rawData){
              var array = JSON.parse(rawData.response).aggregations.activity_per_station.buckets;
                  plotData(array, "station_activity"); 
              }
  );

  d3.xhr('/api/trip/station_activity')
      .header("Content-Type", "application/json")
      .post(
          JSON.stringify({start_date: start_date, end_date: end_date, field: "end_terminal"}),
          function(err, rawData){
              var array = JSON.parse(rawData.response).aggregations.activity_per_station.buckets;
                  plotData(array, "station_activity_end"); 
              }
  );
};


var init = function(start_date, end_date){
  setupChart();
  createWeatherChart(start_date, end_date);
};

init("05/06/2014 00:00", "05/07/2014 00:00");

})();