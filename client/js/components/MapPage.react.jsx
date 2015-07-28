var React = require('react');
var MapLogic = require('../map.js');
// var CalendarLogic = require('../calendar.js');

var MapPage = React.createClass({
  componentDidMount: function(){
    MapLogic();
    // CalendarLogic();
  },
  render: function () {

    return (
    <div>
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