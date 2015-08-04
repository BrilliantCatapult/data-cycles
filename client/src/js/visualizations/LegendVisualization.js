var LegendVisualization = {};

LegendVisualization.enter = function (selection, color, width, index) {


  selection
      .attr("class", "legend")
      .attr("transform", function(d, i) { 
        return "translate(0," + index * 20 + ")"; 
      });

  selection.append("rect")
      .attr("x", width - 60)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  selection.append("text")
      .attr("x", width - 80)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return ">="+ d; });

};


LegendVisualization.update = function (selection, color, width, index) {

  selection
      .attr("class", "legend")
      .attr("transform", function(d, i) { 
        return "translate(0," + index * 20 + ")"; 
      });

  selection.select("rect")
      .attr("x", width - 60)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  selection.select("text")
      .attr("x", width - 80)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return ">="+ d; });

};


module.exports = LegendVisualization;