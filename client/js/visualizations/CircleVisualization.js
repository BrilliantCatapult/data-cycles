var CircleVisualization = {};

CircleVisualization.enter = function (selection, options, scales, rScale, color, tooltip) {

   var x = scales.x;
   var y = scales.y;


    selection
      .attr("class", "dot")
      .attr("r", function(d) {
       return rScale(d.doc_count); 
     })
      .attr("cx", function(d) { return x(Math.random()*options.domains.y[1]); })
      .attr("cy", function(d) { return y(Math.random()*options.domains.x[1]); })
      .style("fill", function(d) { return color(d.doc_count); })
      .on("mouseover", function(d) {
          tooltip.transition()
          .duration(200)
          .style("opacity", .9);

          tooltip.select('.tooltip-inner').html("Bike #"+d.key);

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


};

CircleVisualization.update = function (selection, options, scales, rScale, color, tooltip, sorted,  duration) {
  
   var x = scales.x;
   var y = scales.y;

    selection
      .transition()
      .duration(duration)
      .attr("r", function(d) {
        if(sorted)
          return 3.5; 
        else
          return rScale(d.doc_count); 
      })
      .attr("cx", function(d) { 
        if(sorted)
          return x(d.key);
        else
          return x(Math.random()*options.domains.y[1]); 
      })
      .attr("cy", function(d) { 
        if(sorted)
          return y(d.doc_count) 
        else
          return y(Math.random()*options.domains.x[1]); 
      })
      .style("fill", function(d) { return color(d.doc_count); })

};


module.exports = CircleVisualization;