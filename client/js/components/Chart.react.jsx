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
        <div className="container">
        {formatDate(this.state.start_date)}
          <div className="grid">
            <div className="bloc bloc-s-1">
              <h3>Most used bikes</h3>
              <BarChart  id='1' start_date={this.state.start_date} end_date={this.state.end_date}/>
            </div>
            <div className="bloc bloc-s-1">
              <h3>Least used bikes</h3>
              <BarChart  id='2' start_date={this.state.start_date} end_date={this.state.end_date}/>
            </div>
            <div className="bloc bloc-s-1">
              <h3>Overall used bikes</h3>
              <BarChart  id='3' start_date={this.state.start_date} end_date={this.state.end_date}/>
            </div>
          </div>
          <h3>Bikes used</h3>
          <BubbleChart  id='4' start_date={this.state.start_date} end_date={this.state.end_date}/>
          <div className="grid">
            <div className="bloc bloc-s-2">
              <h3>Number of bikes taken from terminal</h3>
              <LineChart  id='5'  start_date={this.state.start_date} end_date={this.state.end_date} name="Start Terminal"/>
            </div>
            <div className="bloc bloc-s-2">
              <h3>Number of bikes returned from terminal</h3>
              <LineChart  id='6'  start_date={this.state.start_date} end_date={this.state.end_date} name="End Terminal"/>
            </div>
          </div>
        </div>
      </div>
    );
  },

});

module.exports = Chart;
