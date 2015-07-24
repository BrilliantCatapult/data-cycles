var formatDate = d3.time.format("%b%d %Y");
var serverDate = d3.time.format("%-m/%d/%Y 00:00");
var docksDate = d3.time.format("%Y/%m/%d");

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
  var start_date = calendarBrush.extent()[0];
  if (d3.event.sourceEvent) { // not a programmatic event
    start_date = calendarTimeScale.invert(d3.mouse(this)[0]);
    calendarBrush.extent([start_date, start_date]);
    
    if (d3.event.sourceEvent.type === 'mouseup') {
      console.log("mouseup");
      var end_date = calendarTimeScale.invert(d3.mouse(this)[0] + 1);

      fetchNewDate(start_date, end_date);
      
    }
  }

  calendarHandle.attr("transform", "translate(" + calendarTimeScale(start_date) + ",0)");
  calendarHandle.select('text').text(formatDate(start_date));
}