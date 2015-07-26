var d3 = require('d3');

var BarVisualization = {};
var duration = 250;
var margin = {top: 10, left: 5};
var padding = {top: 5, left: 5};
var format = d3.format(",.0f");
var x,y;

BarVisualization.enter = function(selection, domains) {
    x = domains.x;
    y = domains.y;

    selection
        .attr("transform", function(d) {
           return "translate(0," + y(d.key) + ")"; 
         });

 
    selection.append("rect")
        .attr("width", function(d) { return x(d.doc_count); })
        .attr("height", y.rangeBand());

    selection.append("text")
        .attr("class", "value")
        .attr("x", function(d) { return x(d.doc_count); })
        .attr("y", y.rangeBand() / 2)
        .attr("dx", -3)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(function(d) { return format(d.doc_count); });
};


 
BarVisualization.update = function(selection, domains, duration)  {
  x = domains.x;
  y = domains.y;

  selection
    .transition()
    .duration(duration)
    .attr("transform", function(d) {
       return "translate(0," + y(d.key) + ")"; 
     });

    selection.select("rect")
        .attr("width", function(d) { return x(d.doc_count); })
        .attr("height", y.rangeBand());

    selection.select("text")
        .attr("class", "value")
        .attr("x", function(d) { return x(d.doc_count); })
        .attr("y", y.rangeBand() / 2)
        .attr("dx", -3)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(function(d) { return format(d.doc_count); });
};

// missing.. should probably do something here..
// BarVisualization.exit = () => {

// }

module.exports = BarVisualization;