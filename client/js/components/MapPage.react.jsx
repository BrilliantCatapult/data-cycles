var React = require('react');
var MapLogic = require('../map.js');
var Layout = require('./Layout.react.jsx');
var Moment = require('moment');
var Router = require('react-router');
var Loader = require('react-loader');

// var CalendarLogic = require('../calendar.js');
var formatDate = function(date){
  console.log("DATE ISSSSS ", date);
  var day = Moment(date, "YYYY/MM/DD HH:mm");
  return day.format("YYYY-MM-DD");
};

var formatTime = function(date){
  var day = Moment(date, "YYYY/MM/DD HH:mm");
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
      end_date: dates.end_date,
      //loaded: false
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
    //this.state.loaded = false;
    console.log("ADDING UPDATEEE");
    this.state.loaded = true;
    return false;
  },
  componentWillMount: function(){
    console.log("ABC");
    //this.state.loaded = true;
  },
  componentDidUpdate: function(){
    //this.state.loaded = true;
    //MapLogic(this.state.start_date, this.state.end_date, this);
    // CalendarLogic();
    // if(this.state.loaded){
    //  // MapLogic(this.state.start_date, this.state.end_date, this, this.state.loaded);
    //   updateWindow();
    // }
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

      <div className="container">
        <h2>Daily bike activity</h2>
        <hr />
        <div className="grid">
          <div className="bloc bloc-s-1">
            <h6>Animation duration (min)</h6>
            <span id="speed"></span>
            <button id="playbutton" className="btn btn-full btn-l btn-alt margin-top">Loading</button>
          </div>
          <div className="bloc bloc-s-6-1">
            <h6>Date</h6>
            <div id="calendar"></div>
            <h6>Time (h)</h6>
            <div id="timeline"></div>
          </div>
        </div>
        <div id="map">
       <Loader length={0} width={5} loaded={this.state.loaded} >
        </Loader>
          <span id="date" className="xl bg"></span><br />
          <span id="time" className="xl bg"></span>
          <span className="map-tooltip hide">Tooltip</span>
          <div id="routes-info"></div>
          <div id="tileslayer"></div>
        </div>
      </div>
    </div>

    );
  } 

});

module.exports = MapPage;