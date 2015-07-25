var formatDate = d3.time.format("%b%d %Y");
var serverDate = d3.time.format("%-m/%d/%Y 00:00");
var docksDate = d3.time.format("%Y/%m/%d");

// parameters
width = document.getElementById("map").clientWidth;
var height = 100;

var datedisplay = d3.select("#day");

// scale function
var calendarTimeScale = d3.time.scale()
  .domain([new Date('2013-08-29'), new Date('2014-09-01')])
  .range([0, width - 100])
  .clamp(true);

var calendarAxis = d3.svg.axis()
  .scale(calendarTimeScale)
  .tickFormat(d3.time.format("%m"))
  .orient("top")
  // .tickSize(0)
  // .tickPadding(12)
  // .tickValues([calendarTimeScale.domain()[0], calendarTimeScale.domain()[1]]);

// initial value
var startingValue = new Date('2013-12-19');

// defines calendarBrushAction
var calendarBrushAction = d3.svg.brush()
  .x(calendarTimeScale)
  .extent([startingValue, startingValue])
  .on("brushstart", brushstart)
  .on("brush", calendarBrushing);

var calendarSvg = d3.select("#calendar")
  .append("svg")
  .attr("width", width);

var calendarSlider = calendarSvg.append("g")
  .attr("transform", "translate(0,20)")
  .call(calendarAxis)
  .call(calendarBrushAction);

// calendarSvg.append("g")
//   .attr("class", "x axis")
// // put in middle of screen
//   .attr("transform", "translate(0," + height / 2 + ")")
// // inroduce axis
  
//   .select(".domain")
//   .select(function() {
//     return this.parentNode.appendChild(this.cloneNode(true));
//   })
//   .attr("class", "halo");

var calendarHandle = calendarSlider.append("polygon")
  .attr("points", "-15,20 0,0 15,20")
  .attr("id", "calendarhandle");

// calendarHandle.append("path")
//   .attr("transform", "translate(0," + height / 2 + ")")
//   .attr("d", "M 0 -20 V 20");

// calendarHandle.append('text')
//   .text(startingValue)
//   .attr("transform", "translate(" + (-18) + " ," + (height / 2 - 25) + ")");

datedisplay.html(startingValue);

calendarSlider
  .call(calendarBrushAction.event)

function calendarBrushing() {
  var start_date = calendarBrushAction.extent()[0];
  unload();
  if (d3.event.sourceEvent) { // not a programmatic event
    start_date = calendarTimeScale.invert(d3.mouse(this)[0]);
    calendarBrushAction.extent([start_date, start_date]);
    
    if (d3.event.sourceEvent.type === 'mouseup') {
      console.log("mouseup");
      var end_date = calendarTimeScale.invert(d3.mouse(this)[0] + 1);

      fetchNewDate(start_date, end_date);
      
    }
  }

  calendarHandle.attr("transform", "translate(" + calendarTimeScale(start_date) + ",0)");
  // calendarHandle.select('text').text(formatDate(start_date));
  datedisplay.html(formatDate(start_date));
}

fetchNewDate();