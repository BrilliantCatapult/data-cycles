var React = require('react');
var BarChart = require('./BarChart.react');
var BubbleChart = require('./BubbleChart.react');
var LineChart = require('./LineChart.react');
var Layout = require('./Layout.react.jsx');

var Chart = React.createClass({

  getInitialState: function(){
    return{
      start_date: this.props.params.date || "22/12/2013"
    }
  }, 
  render: function () {

    var divStyle = {
      width: '100%'
    };

    return (
      <div>
        <Layout start_date={this.state.start_date} />
        <div style={divStyle}>
          <BarChart  id='1' start_date={this.state.start_date}/>
        </div> 
        <div style={divStyle}>
          <BarChart  id='2' start_date={this.state.start_date}/>
        </div>
        <div style={divStyle}>
          <BarChart  id='3' start_date={this.state.start_date}/>
        </div>
        <div style={{width: '100%'}}>
           <BubbleChart  id='4' start_date={this.state.start_date}/>
        </div>
        <div style={{width: '100%'}}>
          <LineChart  id='5'  start_date={this.state.start_date}/>
        </div>
      </div>
    );
  },

});

module.exports = Chart;
