var React = require('react');
var BarChart = require('./BarChart.react');
var BubbleChart = require('./BubbleChart.react');
var LineChart = require('./LineChart.react');

var Chart = React.createClass({
  render: function () {

    var divStyle = {
      width: '100%'
    };

    return (
      <div>
        <div style={divStyle}>
          <BarChart  id='1' />
        </div> 
        <div style={divStyle}>
          <BarChart  id='2' />
        </div>
        <div style={divStyle}>
          <BarChart  id='3' />
        </div>
        <div style={{width: '100%'}}>
           <BubbleChart  id='4' />
        </div>
        <div style={{width: '100%'}}>
          <LineChart  id='5'  />
        </div>
      </div>
    );
  },

});

module.exports = Chart;
