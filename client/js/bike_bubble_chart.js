/**

CODE FOR BUBBLE CHART

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

var createBubbleChart = function(element, start_date, end_date){

  var margin = [20, 30, 20, 20];
  var width = d3.select("#"+element).node().offsetWidth + margin[1] + margin[3];
  var height = 200 + margin[0] + margin[2];


  var x = d3.scale.linear()
      .range([0, width - 2*margin[1] - 2*margin[3]]);

  var y = d3.scale.linear()
      .range([height - 2*margin[0] - 2*margin[2], 0]);

  var color = d3.scale.linear()
    .domain([0, 500, 1000])
    .range(["red", "yellow", "green"]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var svg = d3.select("#"+element).append("svg")
      .attr("id", element+"_svg")
      .attr("width", width )
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

  d3.json("/api/bikes?order=desc&start_date="+start_date+"&end_date="+end_date, function(error, data) {
    if (error) throw error;
    
    data = data.aggregations.filter_by_date.rides_per_bike.buckets;

    var rScale = d3.scale.linear()
       .domain([0, d3.max(data, function(d) { return d.doc_count; })])
       .range([1, 20]);

    x.domain(d3.extent(data, function(d, i) { return i; })).nice();
    y.domain(d3.extent(data, function(d) { return d.doc_count; })).nice();

    svg.append("g")
        .attr("class", "x axis")
        .style("opacity", 0)
        .attr("transform", "translate(0," + (height- 2*margin[0] - 2*margin[2]) + ")")
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
        .attr("cx", function(d) { return x(Math.random()*data.length); })
        .attr("cy", function(d) { return y(Math.random()*d3.max(data, function(d) { return d.doc_count; })); })
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
        .attr("x", width - 48 - margin[1] - margin[3])
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width -54 - margin[1] - margin[3])
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
      .attr("cx", function(d) { return x(Math.random()*data.length); })
      .attr("cy", function(d) { return y(Math.random()*d3.max(data, function(d) { return d.doc_count; })); })  
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

    d3.select('#sort_all').on("click", function($event){
      if(svg.select(".y.axis").style("opacity") ===  "1"){
          shuffle();
      } else {
          sort_time();
      } 
    });

    var redraw = function(){
      width = d3.select('#'+element).node().offsetWidth + margin[1] + margin[3];
      
      d3.select("#"+element+"_svg").attr("width", width);//.attr("height", y);

      x.range([0, width - 2*margin[1] - 2*margin[3]]);

      xAxis = d3.svg.axis().scale(x).orient("bottom").tickSize(-height);

      svg.select(".x.axis")
           .call(xAxis);

      if(svg.select(".y.axis").style("opacity") ===  "1"){
          sort_time();
      } else {
          shuffle();
      } 

      legend.select("rect")
          .attr("x", width  - 48 - margin[1] - margin[3])

      legend.select("text")
          .attr("x", width  - 54 - margin[1] - margin[3])
      
    };

    d3.select(window).on('resize.one', function(){
      redraw();
    });

  });
};

var init = function(start_date, end_date){
  setupChart();
  createBubbleChart("bubble", start_date, end_date);
};

init("12/18/2013 00:00","12/19/2013 00:00");

})();





