/*
  Statistics page
*/
var React = require('react');
var BarChart = require('./BarChart.react');
var BubbleChart = require('./BubbleChart.react');
var LineChart = require('./LineChart.react');
var Layout = require('./Layout.react.jsx');
var ChartStore = require('../stores/ChartStore');
var Moment = require('moment');
var Calendar = require('./Calendar.react');
var D3Utils = require('../utils/D3Utils');
var LineLegend = require('./LineLegend.react');
var D3ServerAction = require('../actions/D3ServerAction');

setupDate = function(params){
  var dates = {};
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


var formatDate = function(date){
  console.log("DATE ISSSSS in bubble", date);
  var day = Moment(date, "MM/DD/YYYY HH:mm");
  return day.format("YYYY-MM-DD");
};


var Chart = React.createClass({

  contextTypes: {
     router: React.PropTypes.func
  },
  componentWillReceiveProps: function(nextProps) {
          // if (typeof nextProps.showAdvanced === 'boolean') {
          //     this.setState({
          //         showAdvanced: nextProps.showAdvanced
          //     })
          // }
          console.log("receiving new props", nextProps);
          var dates = setupDate(nextProps.params.date);
          this.setState({
            start_date: dates.start_date,
            end_date: dates.end_date,
            time: nextProps.params.time
          })

  },
  getInitialState: function(){
    
    var dates = setupDate(this.props.params.date); 

    return{
      start_date: dates.start_date,
      end_date: dates.end_date,
      time: this.props.params.time,
      colors: D3Utils.calculateColor([0, 100]),
      stations: []
    }

  }, 
  shouldComponentUpdate: function(){
    console.log("will update");
    return true;
  },
  componentWillUnmount: function(){
    console.log("unmounting");
  },
  componentDidMount: function(){
    D3ServerAction.readyToReceiveStation();
    ChartStore.addChangeListener(this._onChange);
  },
  _onChange: function(){
    console.log("in on change!!");

    this.setState({
      stations: ChartStore.getAll()
    });
    console.log("data issss ", ChartStore.getAll());
  },
  render: function () {

    var divStyle = {
      width: '100%'
    };

    return (
      <div>
        <Layout start_date={formatDate(this.state.start_date)} time={this.state.time} />
        <div className="container">
          <Calendar start_date={this.state.start_date} time={this.state.time} style={divStyle} parent={this}/>
          <h2>Daily activity overview</h2>
          <hr />
          <span id="date" className="xl bg">{formatDate(this.state.start_date)}</span>
          <div className="grid">
            <div className="bloc bloc-s-1">
              <h3>Most used bikes</h3>
              <BarChart stations={this.state.stations}  id='1' start_date={this.state.start_date} end_date={this.state.end_date}/>
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
              <LineChart  colors={this.state.colors} id='5'  start_date={this.state.start_date} end_date={this.state.end_date} name="Start Terminal"/>
            </div>
            <div className="bloc bloc-s-2">
              <h3>Number of bikes returned from terminal</h3>
              <LineChart  colors={this.state.colors} id='6'  start_date={this.state.start_date} end_date={this.state.end_date} name="End Terminal"/>
            </div>
            <LineLegend colors={this.state.colors}/>
          </div>
        </div>
      </div>
    );
  },

});

module.exports = Chart;
