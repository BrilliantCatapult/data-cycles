var React = require('react');
var BarChart = require('./BarChart.react');
var BubbleChart = require('./BubbleChart.react');
var LineChart = require('./LineChart.react');
var Layout = require('./Layout.react.jsx');
var Moment = require('moment');

setupDate = function(params){
  var dates = {}
  if(params){
    var day = Moment(params, "YYYY-MM-DD");
    dates.start_date = day.startOf("day").format("MM/DD/YYYY HH:mm")
    dates.end_date = day.endOf("day").format("MM/DD/YYYY HH:mm");
  } else {
    dates.start_date= "12/18/2013 00:00";
    dates.end_date= "12/19/2013 00:00" ;
  }
  return dates;
};

var Chart = React.createClass({

  getInitialState: function(){
    
    var dates = setupDate(this.props.params.date);

    return{
      start_date: dates.start_date,
      end_date: dates.end_date,
      time: this.props.params.time
    }

  }, 
  render: function () {

    var divStyle = {
      width: '100%'
    };

    return (
      <div>
        <Layout start_date={formatDate(this.state.start_date)} time={this.state.time}/>
        <div style={divStyle}>
          <BarChart  id='1' start_date={this.state.start_date} end_date={this.state.end_date}/>
        </div> 
        <div style={divStyle}>
          <BarChart  id='2' start_date={this.state.start_date} end_date={this.state.end_date}/>
        </div>
        <div style={divStyle}>
          <BarChart  id='3' start_date={this.state.start_date} end_date={this.state.end_date}/>
        </div>
        <div style={{width: '100%'}}>
           <BubbleChart  id='4' start_date={this.state.start_date} end_date={this.state.end_date}/>
        </div>
        <div style={{width: '100%'}}>
          <LineChart  id='5'  start_date={this.state.start_date} end_date={this.state.end_date} name="Start Terminal"/>
        </div>
        <div style={{width: '100%'}}>
          <LineChart  id='6'  start_date={this.state.start_date} end_date={this.state.end_date} name="End Terminal"/>
        </div>
      </div>
    );
  },

});

module.exports = Chart;
