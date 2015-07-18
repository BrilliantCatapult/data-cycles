var formatDate = d3.time.format("%b%d %Y");
var serverDate = d3.time.format("%-m/%d/%Y 00:00");

// parameters
var margin = {
    top: 50,
    right: 100,
    bottom: 50,
    left: 50
  }
var width = 500 - margin.left - margin.right;
var height = 200 - margin.bottom - margin.top;


// scale function
var timeScale = d3.time.scale()
  .domain([new Date('2013-08-29'), new Date('2014-09-01')])
  .range([0, width])
  .clamp(true);


// initial value
// var startValue = timeScale(new Date('2012-03-02'));
var startingValue = new Date('2014-03-02');

//////////

// defines brush
var brush = d3.svg.brush()
  .x(timeScale)
  .extent([startingValue, startingValue])
  .on("brush", brushed);

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  // classic transform to position g
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
  .attr("class", "x axis")
// put in middle of screen
  .attr("transform", "translate(0," + height / 2 + ")")
// inroduce axis
  .call(d3.svg.axis()
  .scale(timeScale)
  .orient("bottom")
  .tickFormat(function(d) {
    return formatDate(d);
  })
  .tickSize(0)
  .tickPadding(12)
  .tickValues([timeScale.domain()[0], timeScale.domain()[1]]))
  .select(".domain")
  .select(function() {
    return this.parentNode.appendChild(this.cloneNode(true));
  })
  .attr("class", "halo");

var slider = svg.append("g")
  .attr("class", "slider")
  .call(brush);

slider.selectAll(".extent,.resize")
  .remove();

slider.select(".background")
  .attr("height", height);

var handle = slider.append("g")
  .attr("class", "handle");

handle.append("path")
  .attr("transform", "translate(0," + height / 2 + ")")
  .attr("d", "M 0 -20 V 20");

handle.append('text')
  .text(startingValue)
  .attr("transform", "translate(" + (-18) + " ," + (height / 2 - 25) + ")");

slider
  .call(brush.event)

function brushed() {
  var value = brush.extent()[0];
  if (d3.event.sourceEvent) { // not a programmatic event
    value = timeScale.invert(d3.mouse(this)[0]);
    brush.extent([value, value]);
    
    if (d3.event.sourceEvent.type === 'mouseup') {
      var value2 = timeScale.invert(d3.mouse(this)[0] + 1);

      d3.json("/api/timeline/slider?start_date=" + serverDate(value) + "&end_date=" + serverDate(value2), function(error, json) {
        if (error) {
          console.log("error", error);
        }
        console.log("successsssss--------->", json);
        dbJson = parseDBJson(json);
      });
    }
  }

  handle.attr("transform", "translate(" + timeScale(value) + ",0)");
  handle.select('text').text(formatDate(value));
}