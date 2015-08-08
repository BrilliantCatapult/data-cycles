/*
Bar Chart view using D3
*/

var React = require('react');
var Bar = require('./Bar.react');
var BarChartStore = require('../stores/BarChartStore');
var d3 = require('d3');
var Utils = require('../utils/WebAPIUtils');
var D3Utils = require('../utils/D3Utils');
var XAxis = require('./XAxis.react');
var YAxis = require('./YAxis.react');
var D3ServerAction = require('../actions/D3ServerAction');
var Moment = require('moment');
var Loader = require('react-loader');


var BarChart = React.createClass({
  // initially, there's no data [we get data asynchronously from the server]
  // width and height can be passed in as props (Attributes)
  // startdate and enddate are also passed in as attributes.
  // loaded is set to false initially. this controls the loading bar.
  getInitialState: function(){
    return{
      bars: [],
      width: this.props.width,
      height: this.props.height,
      start_date: this.props.start_date,
      end_date: this.props.end_date,
      loaded: false
    };
  },
  getDefaultProps: function(){
    return {
      width: '500',
      height: '200',
    };
  },
  componentWillReceiveProps: function(nextProps) {
          // if (typeof nextProps.showAdvanced === 'boolean') {
               this.setState({
                  start_date: nextProps.start_date,
                  end_date: nextProps.end_date,
                  stations: nextProps.stations
               });
          // }
          D3ServerAction.readyToReceive(nextProps.id, nextProps.start_date, nextProps.end_date);
    },
  // componentWillUpdate: function(){

  // }
  // shouldComponentUpdate: function(){
  //   console.log("updatinggggg");
  //   //D3ServerAction.readyToReceive(this.props.id, this.state.start_date, this.state.end_date);
  //   return true;
  // },
  // update dimensions when the window resizes
  updateDimensions: function(){
    var el = React.findDOMNode(this);
    var d3node = d3.select(el);
    this.setState({width: d3node.node().parentNode.offsetWidth});
  },
  // setupchart creates the g element in the svg
  setupChart: function(){
    var el = React.findDOMNode(this);
    var d3node = d3.select(el);
    this.state.width = d3node.node().parentNode.offsetWidth;
    d3node.select('g')
      .attr("transform", "translate(" + 20 + "," + 20 + ")");
  },
  // when component is about to mount, call action to start receiving server data.
  componentWillMount: function(){
    D3ServerAction.readyToReceive(this.props.id, this.state.start_date, this.state.end_date);
  },
  // after component mounts, attach all listeners
  componentDidMount: function(){
    BarChartStore.addChangeListener(this._onChange);
    /**
    When creating callbacks in JavaScript, you usually need to explicitly 
    bind a method to its instance such that the value of this is correct. 
    With React, every method is automatically bound to its component instance. 
    React caches the bound method such that it's extremely CPU and memory efficient. 
    It's also less typing!

    That's why you don't need to do , this.updateDimensions.bind(this)
    */
    window.addEventListener("resize", this.updateDimensions);
    // need this to re-render after we change the width
    this.setupChart();
    this._onChange(true);
  },
  // before component unmounds, remove all event listeners.
  componentWillUnmount: function(){
    BarChartStore.removeChangeListener(this._onChange);
    window.removeEventListener("resize",this.updateDimensions);
  },
  // setup scales, x and y
  setup_scales: function(domains){

    var x = d3.scale.linear()
       .range([0, this.state.width - 50])
       .domain([0, domains.domains.x[1]]);

     var y = d3.scale.ordinal()
       .rangeRoundBands([0, this.state.height - 50], .1)
       .domain(domains.y_values);

    return {x: x,y: y};
  },
  // when component updates, setup chart again, which sets up width.
  componentDidUpdate: function(){
    if(this.state.bars){
      this.setupChart();
    }
  },
  // render the component
  render: function () {
    var svgStyle = {
      width: this.state.width,
      height: this.state.height,
    };
    if(this.state.bars && this.state.loaded){

        // get information related to x and y ranges
        var domains = D3Utils.calculatePosition(this.state.width, this.state.height, this.state.bars, "doc_count", "key");
        // setup x and y scales
        var scales = this.setup_scales(domains);
        
        // create the individual bars for the bar chart.
        var Bars = this.state.bars.map(function(bar) {
          return (<Bar key={bar.key} data={bar} domains={scales} />);
        }, this);

        return (
           <Loader length={0} width={5} loaded={this.state.loaded}>
            <div>

              <svg style={svgStyle}>
                <g className="graph">
                {{Bars}}
                <XAxis height={this.state.height} x={scales.x}/>
                <YAxis width={this.state.width} y={scales.y} />
                </g>
              </svg>
            </div>
            </Loader>
        

        );
    } else {
      return (
        <Loader length={0} width={5} loaded={this.state.loaded}>
        <div></div>
        </Loader>
        );
    }
  },
  _onChange: function(s){
    // when store data changes, this will be called to reset the data and re-render the chart.
    if(s !== true){
      this.setState({
         loaded: true,
         bars: BarChartStore.getAll(this.props.id)
       });
    }
  }
});

module.exports = BarChart;

/*
  Stations: {this.state.stations}
*/