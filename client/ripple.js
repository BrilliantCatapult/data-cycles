      //circle for bike (.route) radius down to 3

      var colors = ["#FF0000", "#FF1100", "#FF2300", "#FF3400", "#FF4600", "#FF5700", "#FF6900", "#FF7B00", "#FF8C00", "#FF9E00", "#FFAF00", "#FFC100", "#FFD300", "#FFE400", "#FFF600", "#F7FF00", "#E5FF00", "#D4FF00", "#C2FF00", "#B0FF00", "#9FFF00", "#8DFF00", "#7CFF00", "#6AFF00", "#58FF00", "#47FF00", "#35FF00", "#24FF00", "#12FF00", "#00FF00"];

      var heatmapColor = d3.scale.linear()
          .domain(d3.range(0, 1, 1.0 / (colors.length - 1)))
          .range(colors);

      //instead of arr, create array based on max amount at specific dock w/underscore _.range(27);
      var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
     
      d3.json("docks.json", function(error, docks) {
          if (error) throw error;
          console.log(d3.extent(arr))
          var c = d3.scale.linear().domain(d3.extent(arr)).range([0, 1]);
          svgPaths.selectAll(".dock").data(docks.features)
              .enter()
              .append("circle")
              .attr("class", "dock")
              .attr("cx", function(d) {
                  // console.log(projection(d.coord)[0])
                  return projection(d.coord)[0];
              })
              .attr("cy", function(d) {
                  return projection(d.coord)[1];
              })
              .attr("r", "4px")
              .attr("fill", function(d) {
                  return heatmapColor(c(d.amt))
              });
          render();
      });

      // var radInterval = function(num) {
      //     var t = true;
      // }

      //only call makeRings when a bike is put away(green) or taken out(red) 
      window.setInterval(function() {
          makeRings("green")
      }, 1000);

      function makeRings(c) {
          d3.selectAll(".dock").each(function(circleData) {
              svgPaths.append("circle")
                  .attr({
                      "class": "ring",
                      "fill": "grey", //or use CSS to set fill and stroke styles
                      "stroke": c,
                      "stroke-width": "2px",
                      "cx": projection(circleData.coord)[0],
                      "cy": projection(circleData.coord)[1],
                      //position according to this circle's position
                      "r": "4px",
                      "opacity": 0.8, //starting opacity
                      "fill-opacity": 0.5 //fill will always be half of the overall opacity
                  })
                  .transition()
                  .duration(750)
                  .ease('linear')
                  .attr("r", (circleData.amt).toString() + "px")
                  .attr("opacity", 0) //transition opacity
                  .remove(); //remove when transition is complete
              render()
          });
      }