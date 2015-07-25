var React = require('react');
var MapLogic = require('../map.js')

var MapPage = React.createClass({
  componentDidMount: function(){
    MapLogic();
  },
  render: function () {

    return (
    <div>
       <div id="controls" class="container">
           <button id="playbutton" class="btn btn-m">Loading</button>
           <span class="right l"><span id="day"></span>, <span id="time"></span></span>
         </div>
         <div id="calendar" class="container"></div>
         <div id="timeline" class="container"></div>
         
         <div id="map" class="container">
           <span class="map-tooltip hide">Tooltip</span>
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