var formatDate = d3.time.format("%b%d %Y");
var serverDate = d3.time.format("%-m/%d/%Y 00:00");
var docksDate = d3.time.format("%Y/%m/%d")

// parameters
var width = 500;
var height = 100;


// scale function
var calendarTimeScale = d3.time.scale()
  .domain([new Date('2013-08-29'), new Date('2014-09-01')])
  .range([0, width - 100])
  .clamp(true);


// initial value
// var startValue = calendarTimeScale(new Date('2012-03-02'));
var startingValue = new Date('2013-12-19');

//////////

// defines calendarBrush
var calendarBrush = d3.svg.brush()
  .x(calendarTimeScale)
  .extent([startingValue, startingValue])
  .on("brush", brushed);

var calendarSvg = d3.select("#calendar").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  // classic transform to position g
  .attr("transform", "translate(50,0)");

calendarSvg.append("g")
  .attr("class", "x axis")
// put in middle of screen
  .attr("transform", "translate(0," + height / 2 + ")")
// inroduce axis
  .call(d3.svg.axis()
  .scale(calendarTimeScale)
  .orient("bottom")
  .tickFormat(function(d) {
    return formatDate(d);
  })
  .tickSize(0)
  .tickPadding(12)
  .tickValues([calendarTimeScale.domain()[0], calendarTimeScale.domain()[1]]))
  .select(".domain")
  .select(function() {
    return this.parentNode.appendChild(this.cloneNode(true));
  })
  .attr("class", "halo");

var calendarSlider = calendarSvg.append("g")
  .attr("class", "calendarSlider")
  .call(calendarBrush);

calendarSlider.selectAll(".extent,.resize")
  .remove();

calendarSlider.select(".background")
  .attr("height", height);

var calendarHandle = calendarSlider.append("g")
  .attr("class", "handle");

calendarHandle.append("path")
  .attr("transform", "translate(0," + height / 2 + ")")
  .attr("d", "M 0 -20 V 20");

calendarHandle.append('text')
  .text(startingValue)
  .attr("transform", "translate(" + (-18) + " ," + (height / 2 - 25) + ")");

calendarSlider
  .call(calendarBrush.event)

function brushed() {
  var value = calendarBrush.extent()[0];
  if (d3.event.sourceEvent) { // not a programmatic event
    value = calendarTimeScale.invert(d3.mouse(this)[0]);
    calendarBrush.extent([value, value]);
    
    if (d3.event.sourceEvent.type === 'mouseup') {
      console.log("mouseup");
      var value2 = calendarTimeScale.invert(d3.mouse(this)[0] + 1);

      d3.json("/api/timeline/slider?start_date=" + serverDate(value) + "&end_date=" + serverDate(value2), function(error, json) {
        if (error) {
          console.log("error", error);
        }
        console.log("elastic successsssss--------->", json);
        // var tripJson = json;
        bikesJson = buildBikesJson(json);
        // console.log(builtJson);

        d3.json("/api/redis?start_date=" + docksDate(value), function(error, docksJson) {
          if (error) {
            console.log("error", error);
          }
          console.log("redis successsssss--------->", json);
          docksHash = buildDocksHash(json, docksJson);
          console.log("redis successsssss--------->", docksHash);
          drawRoutes(bikesJson);
          drawDocks(docksHash);
          // console.log("successsssss--------->", docksHash);
          console.log("successsssss--------->", bikesJson);
          // loaded();
        });
      });
      
    }
  }

  calendarHandle.attr("transform", "translate(" + calendarTimeScale(value) + ",0)");
  calendarHandle.select('text').text(formatDate(value));
}