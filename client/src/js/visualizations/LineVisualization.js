var LineVisualization = {};

function findMaxY(data){  // Define function "findMaxY"
      var maxYValues = data.map(function(d) { 
        if (d.visible){
          return d3.max(d.values, function(value) { // Return max rating value
            return value.activity; })
        }
      });
      return d3.max(maxYValues);
  }

LineVisualization.enter = function (selection, options, scales, rScale, color, tooltip, activity, width, index, parent, view) {

   var x = scales.x;
   var y = scales.y;

   var line = d3.svg.line()
        .interpolate("cardinal")
        .x(function(d) { return x(d.date); })
        .y(function(d) { 
          return y(d.activity); 
        })
   
   var legendSpace = 450 / activity.length; 

   selection
   .append("rect")
   .attr("width", 10)
   .attr("height", 10)                                    
   .attr("x", width - 80) 
   .attr("y", function (d, i) { return (legendSpace)+index*(legendSpace) - 8; })  // spacing
   .attr("fill",function(d) {
     return d.visible ? color(d.name) : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey 
   })
   .attr("class", "legend-box")

   .on("click", function(d){ // On click make d.visible 
     d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true

     var maxY = findMaxY(activity); // Find max Y rating value categories data with "visible"; true
     y.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
     
      view.setState({
       scales: {x: x,y: y}
      });
     
     selection.select("path")
       .transition()
       .duration(500)
       .attr("d", function(d){
         return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
       });

     selection.select("rect")
       .transition()
       .duration(500)
       .attr("fill", function(d) {
       return d.visible ? color(d.name) : "#F1F1F2";
     });
   })

   .on("mouseover", function(d){

     d3.select(this)
       .transition()
       .attr("fill", function(d) { return color(d.name); });

     selection.select("#line-" + d.name)
       .transition()
       .style("stroke-width", 2.5);  
   })

   .on("mouseout", function(d){

     d3.select(this)
       .transition()
       .attr("fill", function(d) {
       return d.visible ? color(d.name) : "#F1F1F2";});

     selection.select("#line-" + d.name)
       .transition()
       .style("stroke-width", 1.5);
   });
   

   selection.append("text")
       .attr("x", width - 50) 
       .attr("y", function (d, i) { return (legendSpace)+index*(legendSpace); })  // (return (11.25/2 =) 5.625) + i * (5.625) 
       .text(function(d) { return d.name; }); 

  selection.append("text") // http://stackoverflow.com/questions/22064083/d3-js-multi-series-chart-with-y-value-tracking
        .attr("class", "tooltip2")
        .attr("x", width - 100) // position tooltips  
        .attr("y", function (d, i) {
         return (legendSpace)+index*(legendSpace); 
         })

   selection.append("path")
       .attr("class", "line")
       .style("stroke", function(d) { return color(d.name); })
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

           tooltip.select('.tooltip-inner').html("Station #"+d.name);

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

LineVisualization.update = function (selection, options, scales, rScale, color, tooltip, activity, width, index, parent, view) {
    
     var x = scales.x;
     var y = scales.y;

     var legendSpace = 450 / activity.length; 

     var line = d3.svg.line()
          .interpolate("cardinal")
          .x(function(d) { return x(d.date); })
          .y(function(d) { 
            return y(d.activity); 
          })

     selection
     .select("rect")
     .attr("width", 10)
     .attr("height", 10)                                    
     .attr("x", width - 80) 
     .attr("y", function (d, i) { return (legendSpace)+index*(legendSpace) - 8; })  // spacing
     .attr("fill",function(d) {
       return d.visible ? color(d.name) : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey 
     })
     .attr("class", "legend-box")

     .on("click", function(d){ // On click make d.visible 
       d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true

       var maxY = findMaxY(activity); // Find max Y rating value categories data with "visible"; true
     
       y.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
        view.setState({
         scales: {x: x,y: y}
        })

      selection
        .select("path")
         .style("opacity", 0)
         .attr("d", function(d){
           return d.visible ? line(d.values) : null; //// If d.visible is true then draw line for this d selection
         })
         .transition()
         .duration(1000)
         .style("opacity", 1);

       selection.select("rect")
         .transition()
         .duration(5000)
         .attr("fill", function(d) {
         return d.visible ? color(d.name) : "#F1F1F2";
       });
     });

     selection.select("text")
         .attr("x", width - 50) 
         .attr("y", function (d, i) {

           return (legendSpace)+index*(legendSpace); 
          })  // (return (11.25/2 =) 5.625) + i * (5.625) 
         .text(function(d) { return d.name; }); 

    selection.select(".tooltip2") // http://stackoverflow.com/questions/22064083/d3-js-multi-series-chart-with-y-value-tracking
          .attr("x", width - 100) // position tooltips  
          .attr("y", function (d, i) {
           return (legendSpace)+index*(legendSpace); 
           });
        
     selection.select("path")
        .transition()
        .duration(1000)
        .style("stroke", function(d) { return color(d.name); })
         .attr("d", function(d) { 
           return d.visible ? line(d.values) : null; // If array key "visible" = true then draw line, if not then don't 
         });
  
};


module.exports = LineVisualization;
