var React = require('react');
var MapLogic = require('../map.js');
var Layout = require('./Layout.react.jsx');
var Moment = require('moment');
var Router = require('react-router');
// var CalendarLogic = require('../calendar.js');
formatDate = function(date){
  var day = Moment(date);
  return day.format("YYYY-MM-DD");
};

formatTime = function(date){
  var day = Moment(date);
  return day.format("HH:mm");
};

setupDateTime = function(params){
  var dates = {};
  if(params.date && params.time){
    var day = Moment(params.date + " " + params.time, "YYYY-MM-DD HH:mm");
    dates.start_date = day.format("YYYY/MM/DD HH:mm")
    dates.end_date = day.endOf("day").format("YYYY/MM/DD HH:mm");
  } else {
    dates.start_date= "2013/12/18 00:00";
    dates.end_date= "2013/12/18 23:59" ;
  }
  return dates;
};

var MapPage = React.createClass({

  contextTypes: {
     router: React.PropTypes.func
  },
  getInitialState: function(){
    var dates = setupDateTime(this.props.params);

    return{
      start_date: dates.start_date,
      end_date: dates.end_date
    }
  }, 
  componentDidMount: function(){
    MapLogic(this.state.start_date, this.state.end_date, this);
    // CalendarLogic();
  },
  componentWillUpdate: function(newProps){

    var dates = setupDateTime(newProps.params);

    if(this.state.start_date !== dates.start_date){
      this.setState({
        start_date: dates.start_date,
        end_date: dates.end_date
      });
    }
    return false
  },
  componentDidUpdate: function(){
    //MapLogic(this.state.start_date, this.state.end_date, this);
    // CalendarLogic();
  },
  componentWillUnmount: function(){
    play = false; // do i need this??
    window.removeEventListener('resize', updateWindow);
  },
  // can we divide each of those into its own view??
  render: function () {
    return (
    <div>
      <Layout start_date={formatDate(this.state.start_date)} time={formatTime(this.state.start_date)}  />
       <div id="controls" className="container">
           <button id="playbutton" className="btn btn-m">Loading</button>
           <span id="speed"></span>
           <span className="right l"><span id="date"></span>, <span id="time"></span></span>
         </div>
         <div id="calendar" className="container"></div>
         <div id="timeline" className="container"></div>
         
         <div id="map" className="container">
           <span className="map-tooltip hide">Tooltip</span>
           <div id="routes-info"></div>
         </div>
     </div>
    );
  } 

});

module.exports = MapPage;