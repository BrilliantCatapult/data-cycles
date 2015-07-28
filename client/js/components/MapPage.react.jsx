var React = require('react');
var MapLogic = require('../map.js');
var Layout = require('./Layout.react.jsx');
var Moment = require('moment');
// var CalendarLogic = require('../calendar.js');
formatDate = function(date){
  var day = Moment(date);
  return day.format("DD-MM-YYYY");
};
setupDateTime = function(params){
  var dates = {}
  console.log("paras", params);
  if(params.date && params.time){
    var day = Moment(params.date + " " + params.time, "DD-MM-YYYY HH:mm");
    dates.start_date = day.format("YYYY/MM/DD HH:mm")
    dates.end_date = day.endOf("day").format("YYYY/MM/DD HH:mm");
  } else {
    dates.start_date= "2013/12/18 00:00";
    dates.end_date= "2013/12/18 23:59";
  }
  return dates;
};

var MapPage = React.createClass({

  getInitialState: function(){
    var dates = setupDateTime(this.props.params);

    return{
      start_date: dates.start_date,
      end_date: dates.end_date
    }
  }, 
  componentDidMount: function(){
    MapLogic(this.state.start_date, this.state.end_date);
    // CalendarLogic();
  },
  render: function () {

    console.log("MAP START DATE ", this.state.start_date);

    return (
    <div>
      <Layout start_date={formatDate(this.state.start_date)} time="00:00"  />
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

// render: function () {

//     var divStyle = {
//       width: '50%'
//     };

//     return (
//       <div class="container">
//           <nav class="menu right"><span class="active">Map</span><a href="statistics.html">Statistics</a><a href="#">Predictions</a></nav>
//           <h1>Data Cycles</h1>
//           <h3>Bay Area Bike Share data visualization</h3>
//       </div>
//       <div id="timeline" class="container">
//       </div>
//       <div id="controls" class="container">
//         <button id="playbutton" class="btn btn-m">Loading</button>
//         <span id="timer" class="right l"></span>
//       </div>
//       <div id="map" class="container">
//         <span class="map-tooltip hide">Tooltip</span>
//       </div>
//     );
//   },