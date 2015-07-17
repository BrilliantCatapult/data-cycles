
/**

CHARTS FOR TOP AND LEAST BIKES USED

*/


var margin = [30, 10, 10, 30];
      //w = 960 - margin[1] - margin[3],
var width = d3.select("#top_bike_use").node().offsetWidth - margin[1] - margin[3];
var height = 200 - margin[0] - margin[2];

var tooltip = d3.select("body").append("div");
  tooltip.attr("class", "tooltip top");
  tooltip.append("div").attr("class", "tooltip-arrow");
  tooltip.append("div").attr("class", "tooltip-inner");
  tooltip.style("opacity", 0);

console.log(d3.select("#top_bike_use").node().offsetWidth);
var format = d3.format(",.0f");

var x = d3.scale.linear().range([0, width]),
    y = d3.scale.ordinal().rangeRoundBands([0, height], .1);

var xAxis = d3.svg.axis().scale(x).orient("top").tickSize(-height),
    yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

var svg_top = d3.select("#top_bike_use").append("svg")
    .attr("width",  d3.select("#top_bike_use").node().offsetWidth + margin[1] + margin[3])
    .attr("height", height + margin[0] + margin[2])
  .append("g")
    .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

var svg_bottom = d3.select("#bottom_bike_use").append("svg")
    .attr("width",d3.select("#bottom_bike_use").node().offsetWidth + margin[1] + margin[3])
    .attr("height", height + margin[0] + margin[2])
  .append("g")
    .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

var svg_all = d3.select("#all_bike_use").append("svg")
    .attr("width",d3.select("#all_bike_use").node().offsetWidth + margin[1] + margin[3])
    .attr("height", height + margin[0] + margin[2])
  .append("g")
    .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

var setup_d3 = function(svg, query, group){

  d3.json(query, function(data) {
     
    data = data.aggregations.rides_per_bike.buckets;

    // group data if group parameter provided
    if(group){
      g=[];
      var num = 1;
      while(data.length>0){
        var value = _.reduce(_.pluck(data.splice(0, group), "doc_count"), function(memo, element){
          return memo + element;
        }, 0)/group; // avg
        g.push({doc_count: value, key: num});
        num++;
      }
      data = g;
    }

    // Parse numbers, and sort by value.
    data.forEach(function(d) { d.value = +d.doc_count; });
    data.sort(function(a, b) { return b.value - a.value; });

    // Set the scale domain.
    x.domain([0, d3.max(data, function(d) { return d.value; })]);
    y.domain(data.map(function(d) { return d.key; }));

    var bar = svg.selectAll("g.bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(0," + y(d.key) + ")"; });

    bar.append("rect")
        .attr("width", function(d) { return x(d.value); })
        .attr("height", y.rangeBand());

    bar.append("text")
        .attr("class", "value")
        .attr("x", function(d) { return x(d.value); })
        .attr("y", y.rangeBand() / 2)
        .attr("dx", -3)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(function(d) { return format(d.value); });

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
  });
};

setup_d3(svg_top, "/api/bikes?size=10&order=desc");
setup_d3(svg_bottom, "/api/bikes?size=10&order=asc");
setup_d3(svg_all, "/api/bikes?order=desc", 70); // now want to group!!


//most and least used bikes!
d3.json("/api/bikes?size=1&order=desc", function(data) {
  d3.select("#most").text("Bike #"+data.aggregations.rides_per_bike.buckets[0].key+", "+data.aggregations.rides_per_bike.buckets[0].doc_count);
});

d3.json("/api/bikes?size=1&order=asc", function(data) {
  d3.select("#least").text("Bike #"+data.aggregations.rides_per_bike.buckets[0].key+", "+data.aggregations.rides_per_bike.buckets[0].doc_count);
});


/**

CODE FOR BUBBLE CHART

*/

// want to plot a bubble chart with all the bikes

// var margin = {top: 20, right: 20, bottom: 30, left: 40},
//     width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;
var createBubbleChart = function(element){

  var margin = [50, 20, 20, 30];
        //w = 960 - margin[1] - margin[3],
  var width = d3.select(element).node().offsetWidth - margin[1] - margin[3];
  var height = 200 - margin[0] - margin[2];


  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  // var color = d3.scale.category10()
  // .domain();
  var color = d3.scale.linear()
    .domain([0, 500, 1000])
    .range(["red", "yellow", "green"]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var svg = d3.select(element).append("svg")
      .attr("width", width + margin[0] + margin[1])
      .attr("height", height + margin[2] + margin[3])
    .append("g")
      .attr("transform", "translate(" + margin[0] + "," + margin[2] + ")");

  d3.json("/api/bikes?order=desc", function(error, data) {
    if (error) throw error;
    
    data = data.aggregations.rides_per_bike.buckets;

    var rScale = d3.scale.linear()
       .domain([0, d3.max(data, function(d) { return d.doc_count; })])
       .range([1, 20]);

    x.domain(d3.extent(data, function(d, i) { return i; })).nice();
    y.domain(d3.extent(data, function(d) { return d.doc_count; })).nice();

    svg.append("g")
        .attr("class", "x axis")
        .style("opacity", 0)
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Bike Id");

    svg.append("g")
        .attr("class", "y axis")
        .style("opacity", 0)
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("# of times used")

    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) { return rScale(d.doc_count); })
        .attr("cx", function(d) { return x(Math.random()*700); })
        .attr("cy", function(d) { return y(Math.random()*1000); })
        .style("fill", function(d) { return color(d.doc_count); })
        .on("mouseover", function(d) {
            tooltip.transition()
            .duration(200)
            .style("opacity", .9);

            d3.select('.tooltip-inner').html("Bike #"+d.key);

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

    var legend = svg.selectAll(".legend")
        .data(color.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return ">="+ d; });

    var shuffle = function(){
      svg.select(".y.axis")
      .transition()
      .duration(2000)
      .style("opacity", 0);
      svg.select(".x.axis")
      .transition()
      .duration(2000)
      .style("opacity", 0);

      x.domain(d3.extent(data, function(d,i) { return i; })).nice();
      svg.selectAll("circle")
      .transition()
      .duration(2000)
      .attr("r", function(d) { return rScale(d.doc_count); })
      .attr("cx", function(d) { return x(Math.random()*700); })
      .attr("cy", function(d) { return y(Math.random()*1000); });
    };

    var sort_time = function(){
      svg.select(".y.axis")
        .transition()
        .duration(2000)
        .style("opacity", 1);
      svg.select(".x.axis")
        .transition()
        .duration(2000)
        .style("opacity", 1);

      x.domain(d3.extent(data, function(d) { return d.key; })).nice();
      svg.selectAll("circle")
      .transition()
      .duration(2000)
      .attr("r", 3.5)
      .attr("cx", function(d) { return x(d.key); })
      .attr("cy", function(d) { return y(d.doc_count) });
    };

    $('#sort_all').on("click", function($event){
      if(svg.select(".y.axis").style("opacity") ===  "1"){
          shuffle();
      } else {
          sort_time();
      } 
    });

  });
  };

createBubbleChart("#bubble");


/**

CODE FOR Weather VS Activity CHART

*/

var createWeatherChart = function(start_date, end_date){
  var parseData = function(data) {
    //want format
    //[{date: value, station1: value, station2: value, .....}, {date:value2, ...}]
    return data;
  };

  var plotData = function(data){
    var maxY;
    var bisectDate = d3.bisector(function(d) {
       return d.date; 
     }).left;

    var margin = {top: 20, right: 180, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

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
        //.defined(function(d) { return d.date; });

    var svg = d3.select("#station_activity").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //d3.tsv("data.tsv", function(error, data) {
      console.log(data);
      //if (error) throw error;

      color.domain([0,100]);

      // data.forEach(function(d) {
      //   d.date = parseDate(d.key_as_string);
      // });

       // var activity = [{name: data[20].key, values: data[20].activity_per_hour.buckets.map(function(d) {
       //       return {date: parseDate(d.key_as_string), activity: +d.doc_count};
       //     })}];
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
        // d3.min(activity, function(c) { return d3.min(c.values, function(v) { return v.activity; }); }),
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
          .attr("id", "mouse-tracker")
          .style("fill", "white");

      var city = svg.selectAll(".city")
          .data(activity)
        .enter().append("g")
          .attr("class", "city");

      city.append("path")
          .attr("class", "line")
          //.attr("d", function(d) { return line(d.values); })
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
      // city.append("text")
      //     .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      //     .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.activity) + ")"; })
      //     .attr("x", 3)
      //     .attr("dy", ".35em")
      //     .text(function(d) { return d.name; });
    //});

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
       })
       
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
     d3.select("#mouse-tracker") // select chart plot background rect #mouse-tracker
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

         //var mouse_y = d3.mouse(this)[1]; // Finding mouse y position on rect
         //var graph_y = yScale.invert(mouse_y);
         //console.log(graph_x);
         
         var format = d3.time.format('%b %Y'); // Format hover date text to show three letter month and full year
         
         hoverDate.text(format(graph_x)); // scale mouse position to xScale date and format it to show month and year
         
         d3.select("#hover-line") // select hover-line and changing attributes to mouse position
             .attr("x1", mouse_x) 
             .attr("x2", mouse_x)
             .style("opacity", 1); // Making line visible

         // Legend tooltips // http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html
         //console.log(x.invert(d3.mouse(this)[0]));
         var x0 = x.invert(d3.mouse(this)[0]); /* d3.mouse(this)[0] returns the x position on the screen of the mouse. xScale.invert function is reversing the process that we use to map the domain (date) to range (position on screen). So it takes the position on the screen and converts it into an equivalent date! */
         
         // i = bisectDate(activity, x0, 1), // use our bisectDate function that we declared earlier to find the index of our data array that is close to the mouse cursor
         
         // /*It takes our data array and the date corresponding to the position of or mouse cursor and returns the index number of the data array which has a date that is higher than the cursor position.*/
         // d0 = activity[i - 1],
         // d1 = activity[i],
         // d0 is the combination of date and rating that is in the data array at the index to the left of the cursor and d1 is the combination of date and close that is in the data array at the index to the right of the cursor. In other words we now have two variables that know the value and date above and below the date that corresponds to the position of the cursor.
         // d = x0 - d0.date > d1.date - x0 ? d1 : d0;
         // /*The final line in this segment declares a new array d that is represents the date and close combination that is closest to the cursor. It is using the magic JavaScript short hand for an if statement that is essentially saying if the distance between the mouse cursor and the date and close combination on the left is greater than the distance between the mouse cursor and the date and close combination on the right then d is an array of the date and close on the right of the cursor (d1). Otherwise d is an array of the date and close on the left of the cursor (d0).*/
         //  console.log("I ISSSSS ", i);
         //d is now the data row for the date closest to the mouse position

         focus
         .selectAll("text").text(function(d){
            //because you didn't explictly set any data on the <text>
            //elements, each one inherits the data from the focus <g>
            //  console.log(d.values);
            i = bisectDate(d.values, x0, 0); // use our bisectDate function that we declared earlier to find the index of our data array that is close to the mouse cursor
            //console.log("i isssss ", i);
            /*It takes our data array and the date corresponding to the position of or mouse cursor and returns the index number of the data array which has a date that is higher than the cursor position.*/
            d0 = d.values[i - 1];
            d1 = d.values[i];
            /*d0 is the combination of date and rating that is in the data array at the index to the left of the cursor and d1 is the combination of date and close that is in the data array at the index to the right of the cursor. In other words we now have two variables that know the value and date above and below the date that corresponds to the position of the cursor.*/
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

  };

  var plotActivity = function(data){
    data = parseData(data);
    plotData(data);
  };

  // want to display for this day.
  // all station activity and show the weather.
  // so station activity across the day.
  d3.json('/api/weather', function(error, data){ //start_date=12/12/2013&end_date=12/13/2013
    //console.log(data);
    //this is the average weather from start to end date
    // also get humidity and all that.
    $("#weather").html(data.aggregations.mean_temp.value);

  });  

  // get dates with activity first - grouped by hour
  // d3.xhr('/api/trip/date_activity')
  //     .header("Content-Type", "application/json")
  //     .post(
  //         JSON.stringify({start_date: "12/12/2013 00:00", end_date: "12/13/2013 00:00"}),
  //         function(err, rawData){
  //             //var data = JSON.parse(rawData);
  //             var array = JSON.parse(rawData.response).aggregations.activity_per_hour.buckets;
  //         }
  //     );
  // currently one day, grouped by hours of day.
  d3.xhr('/api/trip/station_activity')
      .header("Content-Type", "application/json")
      .post(
          JSON.stringify({start_date: start_date, end_date: end_date}),
          function(err, rawData){
              //var data = JSON.parse(rawData);
              var array = JSON.parse(rawData.response).aggregations.activity_per_station.buckets;
              // d3.xhr('/api/trip/station_activity')
              //     .header("Content-Type", "application/json")
              //     .post(
              //         JSON.stringify({field: "end_terminal", start_date: "12/12/2013 00:00", end_date: "12/13/2013 00:00"}),
              //         function(err, rawData){
              //             //var data = JSON.parse(rawData);
              //             var array2 = JSON.parse(rawData.response).aggregations.activity_per_station.buckets;
              //             // want to concatenate results here
              //             console.log("array2", array2);
                          console.log("array1", array);
                          // now combine array1 and 2 into one. (add counts of duplocate stations.)
                          // then plot (xaxis is time)??
                          // yaxis is activity.
                          // but time not there now.. it is sum across all day.
                          // or maybe group by date then station??
                          

                          //plotting activity as start terminal only first
                          plotActivity(array); 

                      }
                 // );        
          //}
      );
  // now want a line chart, one line for each station. x-axis spans time. y-axis activity
};

createWeatherChart("12/12/2013 00:00", "12/13/2013 00:00");





