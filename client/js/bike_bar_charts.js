/**
CHARTS FOR TOP AND LEAST BIKES USED
*/

(function(){

// all the globals needed later
var  format;

var overallSetup = function(){
  format = d3.format(",.0f");
};

var setupCharts = function(id, query, group){


  var margin = [30, 30, 10, 30];
  var width = d3.select("#"+id).node().offsetWidth + margin[1] + margin[3];
  var height = 200 - margin[0] - margin[2];


  console.log("width is ", width - margin[1] - margin[3]);
  var x = d3.scale.linear().range([0, width - 2*margin[1] - 2*margin[3]]);
  var y = d3.scale.ordinal().rangeRoundBands([0, height], .1);

  var xAxis = d3.svg.axis().scale(x).orient("top").tickSize(-height);
  var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

  
  var svg = d3.select("#"+id).append("svg")
      .attr("id", id+"_svg")
      .attr("width",  width)
      .attr("height", height + margin[0] + margin[2])
    .append("g")
      .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

  var bar;

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

    bar = svg.selectAll("g.bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) {
           return "translate(0," + y(d.key) + ")"; 
         });

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

  var redraw = function(){
    // x = w.innerWidth || e.clientWidth || g.clientWidth;
    // y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    width = d3.select('#'+id).node().offsetWidth + margin[1] + margin[3];
    height = 200 - margin[0] - margin[2];
    
    
    d3.select("#"+id+"_svg").attr("width", width);//.attr("height", y);

    x.range([0, width - 2*margin[1] - 2*margin[3]]);

    console.log("bar is " , bar.select("rect"));

    xAxis = d3.svg.axis().scale(x).orient("top").tickSize(-height);

    svg.select(".x.axis")
         .call(xAxis);

    bar.select("rect")
        .attr("width", function(d) { 
          return x(d.value); 
        });

    bar.select("text")
        .attr("x", function(d) {
         return x(d.value); 
       });
    
  };


  $(window).on('resize', function(){
    redraw();
  });
};


var init = function(){
  overallSetup();
  setupCharts("top_bike_use", "/api/bikes?size=10&order=desc");
  setupCharts("bottom_bike_use", "/api/bikes?size=10&order=asc");
  setupCharts("all_bike_use", "/api/bikes?order=desc", 70);

  //most and least used bikes!
  d3.json("/api/bikes?size=1&order=desc", function(data) {
    d3.select("#most").text("Bike #"+data.aggregations.rides_per_bike.buckets[0].key+", "+data.aggregations.rides_per_bike.buckets[0].doc_count);
  });

  d3.json("/api/bikes?size=1&order=asc", function(data) {
    d3.select("#least").text("Bike #"+data.aggregations.rides_per_bike.buckets[0].key+", "+data.aggregations.rides_per_bike.buckets[0].doc_count);
  });
};

init();

})();
