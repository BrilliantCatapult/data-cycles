/*
  BubbleChart View.
  Creates the bubble chart in the statistics page
*/


var React = require('react');
var Circle = require('./Circle.react');
var BubbleChartStore = require('../stores/BubbleChartStore');
var d3 = require('d3');
var Utils = require('../utils/WebAPIUtils');
var D3Utils = require('../utils/D3Utils');
var XAxis = require('./XAxis.react');
var YAxis = require('./YAxis.react');
var Legend = require('./Legend.react');
var D3ServerAction = require('../actions/D3ServerAction');
var Loader = require('react-loader');

var CHANGE_EVENT="change";

var BubbleChart = React.createClass({
  // initially, there's no data [we get data asynchronously from the server]
  // width and height can be passed in as props (Attributes)
  // startdate and enddate are also passed in as attributes.
  getInitialState: function(){
    return{
      bars: [],
      width: this.props.width,
      height: this.props.height,
      sorted: 0,
      start_date: this.props.start_date,
      end_date: this.props.end_date
    };
  },
  // setting default values for width and height incase they're not passed in
  getDefaultProps: function(){
    return {
      width: '500',
      height: '200',
    };
  },
  // adjusting width of view when window resizes
  updateDimensions: function(){
    setTimeout(function(){
      var el = React.findDOMNode(this);
      var d3node = d3.select(el);
      this.setState({width: d3node.node().parentNode.offsetWidth});
    }.bind(this),500);  
  },

  // setting up SVG element.
  setupChart: function(){
    var el = React.findDOMNode(this);
    var d3node = d3.select(el);
    var parentNode = d3node.node().parentNode;

    this.state.tooltip = D3Utils.setupTooltip(parentNode);
    this.state.width = parentNode.offsetWidth;
    d3node.select('g')
      .attr("transform", "translate(" + 20 + "," + 20 + ")");
  },
  // When component is about to mount, call action to start getting data.  
  componentWillMount: function(){
    D3ServerAction.readyToReceiveBubble(this.props.id, this.state.start_date, this.state.end_date);
  },
  // when component unmounts, remove all event listeners
  componentWillUnmount: function(){
    BubbleChartStore.removeChangeListener(this._onChange);
    window.removeEventListener("resize", this.updateDimensions);
  },
  componentWillReceiveProps: function(nextProps) {
          // if (typeof nextProps.showAdvanced === 'boolean') {
               this.setState({
                  start_date: nextProps.start_date,
                  end_date: nextProps.end_date
               });
          // }
          D3ServerAction.readyToReceiveBubble(nextProps.id, nextProps.start_date, nextProps.end_date);
      },
  componentWillUpdate: function(){
    //D3ServerAction.readyToReceiveBubble(this.props.id, this.state.start_date, this.state.end_date);
    return true;
  },
  // when component mounts, add all listeners, and setup chart
  componentDidMount: function(){
    BubbleChartStore.addChangeListener(this._onChange);
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
    this._onChange();
  },
  // setup x and y scales
  setup_scales: function(domains){

    var x = d3.scale.linear()
       .range([0, this.state.width - 50])
       .domain([0, domains.domains.y[1]]);


    var y = d3.scale.linear()
      .range([20, this.state.height - 40])
      .domain([domains.domains.x[1], 0]);

    return {x: x,y: y};
  },
  // calculate color range
  colorRange: function(range) {
    var avg = (range[0] + range[1]) / 2;
    var rangeArr = [range[0], avg, range[1]];

    return rangeArr;
  },
  // when component updates, setup chart again
  componentDidUpdate: function(){
    if(this.state.bars){
      this.setupChart();
    }
  },
  shouldComponentUpdate: function(){
    return true;
  },
  // clicking the sort button should set the sorted state, and re-render
  _onClick: function(){
    this.setState({
      sorted: Math.abs(this.state.sorted  - 1),
    });
  },
  // render the bubble chart
  render: function () {
    var svgStyle = {
      width: this.state.width,
      height: this.state.height,
    };
    if(this.state.bars && this.state.bars.length > 0){
        //get information about the range of the chart
        var setup = D3Utils.calculatePosition(this.state.width, this.state.height, this.state.bars, "doc_count", "key");
        // setup colorRange to use with the chart
        var colorRange = this.colorRange(setup.domains.x);
        // setting up color scale
        var colors = D3Utils.calculateColor(colorRange, ["red", "yellow", "green"]);
        // setup.domains.x[1] is the maximum x;
        var radius = D3Utils.calculateRadius([0, setup.domains.x[1]], [1, 20]);
        // setting up x and y scales
        var scales = this.setup_scales(setup);
        
        // creating the circles for the bubble chart
        var Circles = this.state.bars.map(function(bar, i) {
            return (<Circle key={bar.key} data={bar} domains={setup} scales={scales} radius={radius} color={colors} tooltip={this.state.tooltip} sorted={this.state.sorted}/>);
        }, this);

        // creating Legend for the chart, passing in data and colors
        var LegendItems = colors.domain().map(function(color, index){
          return  (<Legend data={color} colors={colors} width={this.state.width} index={index}/>)
        }, this);
        return (
          <div style={{width:'100%'}}>
            <button onClick={this._onClick} className="btn btn-alt btn-m margin-top" >SORT</button>
            <svg style={svgStyle}>            
              <g className="graph">
                {{Circles}}
                <XAxis height={this.state.height} x={scales.x} sorted={this.state.sorted}/>
                <YAxis width={this.state.width} y={scales.y} sorted={this.state.sorted}/>
                <g className="legend">
                  {{LegendItems}}
                </g>
              </g>
            </svg>
          </div>
        );
    } else {
      return (
         <Loader  length={0} width={5} loaded={this.state.loaded}>
         <div></div>
         </Loader>
         );
    }
  },
  _onChange: function(){
    // when the store data changes, will get the new data.
    this.setState({
       bars: BubbleChartStore.getAll(this.props.id)
     });
  }
});

module.exports = BubbleChart;