var React = require('react');
var MapLogic = require('../map.js');
var Layout = require('./Layout.react.jsx');
var Moment = require('moment');
var Router = require('react-router');
var Loader = require('react-loader');

var formatDate = function(date){
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
    }
  }, 
  componentDidMount: function(){
    MapLogic(this.state.start_date, this.state.end_date, this);
  },
  componentWillUpdate: function(newProps){

    var dates = setupDateTime(newProps.params);

    if(this.state.start_date !== dates.start_date){
      this.setState({
        start_date: dates.start_date,
        end_date: dates.end_date
      });
    }
    this.state.loaded = true;
    return false;
  },
  componentWillMount: function(){
  },
  componentDidUpdate: function(){
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
        <h2 className="margin-top">Daily bike activity</h2>
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
          <div className="absolute">
            <span id="date" className="xl bg"></span><br />
            <span id="time" className="xl bg"></span>
          </div>
          <span className="map-tooltip hide">Tooltip</span>
          <div id="routes-info"></div>
          <div id="tileslayer"></div>
        </div>

        <div className="grid">
          <div className="bloc bloc-s-1 pad bg-neutral"> 
            <div><svg width="24" height="24" className="left"><circle r="7" strokeWidth="5" cx="12" cy="12" className="bike" ></circle></svg> Bike</div> 
            <div><svg width="24" height="24" className="left"><circle r="5" strokeWidth="3" cx="12" cy="12" className="dock-dot" ></circle></svg>Terminal</div>
            <div>
              <svg width="24" height="24" className="left">
                <rect x="7" y="0" width="8" height="20" className="dock-bg"></rect>
                <rect x="8" y="7" width="6" height="12" className="dock-qty" ></rect>
              </svg>
              Bikes available 
            </div>
          </div>
        </div>

      </div>
    </div>

    );
  } 

});

module.exports = MapPage;