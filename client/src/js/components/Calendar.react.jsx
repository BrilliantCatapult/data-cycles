/*
About Us React View
*/
var React = require('react');
var Moment = require('moment');
var Router = require('react-router');
var D3ServerAction = require('../actions/D3ServerAction');

var formatMoment = function(date, format){
  return Moment(date, "MM/DD/YYYY HH:mm").format(format);
};

var Calendar = React.createClass({

  contextTypes: {
     router: React.PropTypes.func
  },
  getInitialState: function(){
    return {
      width: 0,
      start_date: this.props.start_date,
      margins: 20,
      dateMinValue: '2013-08-29',
      dateMaxValue: '2014-09-01',
      dateStartValue: formatMoment(this.props.start_date, "YYYY/MM/DD"),
      time: this.props.time,
      parent: this.props.parent
    }

  },
  updateDimensions: function(){
    var el = React.findDOMNode(this);
    var d3node = d3.select(el);
    this.state.width= d3node.node().parentNode.offsetWidth;
  },
  componentWillMount: function(){

  },
  componentDidMount: function(){
    this.updateDimensions();
    // var calendarSvg = d3.select("#calendar")
    //   .append("svg")
    //   .attr("width", timelineWidth);
    var view = this;

    var calendarHandlePositionSet= function(date){
      calendarHandle.attr("transform", "translate(" + calendarScale(date) + ",0)");
    };

    var el = d3.select(React.findDOMNode(this));
    var calendarSvg = el.select("svg");
    calendarSvg.attr("width", this.state.width);

    var calendarScale = d3.time.scale()
      .domain([new Date(this.state.dateMinValue), new Date(this.state.dateMaxValue)])
      .range([0, this.state.width - (2 * this.state.margins)])
      .clamp(true);


    var calendarBrushing = function () {
      var start_date1 = calendarBrush.extent()[0];
      if (d3.event.sourceEvent) { 
        start_date1 = calendarScale.invert(d3.mouse(this)[0]);
        if (d3.event.sourceEvent.type === 'mouseup') {
          var start_date2 = Moment(start_date1).format("YYYY-MM-DD");
          var start_date = Moment(start_date1).startOf("day").format("MM/DD/YYYY HH:mm")
          var end_date = Moment(start_date1).endOf("day").format("MM/DD/YYYY HH:mm");
          view.context.router.transitionTo('statistics_datetime', {date: start_date2, time: view.state.time});
        }
      }
      calendarHandlePositionSet(start_date1);
    };

    var calendarBrush = d3.svg.brush()
      .x(calendarScale)
      .extent([new Date(this.state.dateStartValue), new Date(this.state.dateStartValue)])
      //.on("brushstart", function(){})
      .on("brushend", calendarBrushing);
    
    var calendarAxis = d3.svg.axis()
      .scale(calendarScale)
      .tickFormat(d3.time.format("%B"))
      .orient("top");

    var calendarSlider = calendarSvg.append("g")
      .attr("transform", "translate(20,24)")
      .attr("class", "calendar-axis")
      .call(calendarAxis); 

    d3.selectAll(".calendar-axis .tick text, .time-axis .tick text, .speed-axis .tick text")
      .attr("x", 5)
      .attr("y", -12)
      .style("text-anchor", "start");

    d3.selectAll(".calendar-axis .tick line, .time-axis .tick line, .speed-axis .tick line")
      .attr("y2", "-18");

    calendarSlider.call(calendarBrush);

    var calendarHandle = calendarSlider.append("polygon")
      .attr("points", "-15,20 0,0 15,20")
      .attr("id", "calendarhandle");

    calendarSlider
      .call(calendarBrush.event);
    
  },
  render: function () {

    var divStyle = {
      width: '100%'
    };

    return (
      <div id="calendar" style={divStyle}>
        <svg></svg>
      </div>
    );
  }

});

module.exports = Calendar;