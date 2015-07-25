var React = require('react');
var Bar = require('./Bar.react');
var BarChartStore = require('../stores/BarChartStore');
var d3 = require('d3');
var Utils = require('../utils/WebAPIUtils');
var D3Utils = require('../utils/D3Utils');
var XAxis = require('./XAxis.react');
var YAxis = require('./YAxis.react');
var D3ServerAction = require('../actions/D3ServerAction');

var BarChart = React.createClass({
  getInitialState: function(){
    return{
      bars: [],//BarChartStore.getAll(this.props.id),
      width: this.props.width,
      height: this.props.height,
      start_date: "12/18/2013 00:00",
      end_date: "12/19/2013 00:00"
    };
  },
  getDefaultProps: function(){
    return {
      width: '500',
      height: '200',
    };
  },
  // componentWillMount: function(){

  // },
  updateDimensions: function(){
    var el = React.findDOMNode(this);
    var d3node = d3.select(el);
    this.setState({width: d3node.node().parentNode.offsetWidth});
  },

  setupChart: function(){
    var el = React.findDOMNode(this);
    var d3node = d3.select(el);
    this.state.width = d3node.node().parentNode.offsetWidth;
    d3node.select('g')
      .attr("transform", "translate(" + 20 + "," + 20 + ")");
  },
  componentWillMount: function(){
    D3ServerAction.readyToReceive(this.props.id, this.state.start_date, this.state.end_date);
  },
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
    this._onChange();
  },
  setup_scales: function(domains){

    var x = d3.scale.linear()
       .range([0, this.state.width - 50])
       .domain([0, domains.domains.x[1]]);

     var y = d3.scale.ordinal()
       .rangeRoundBands([0, this.state.height - 50], .1)
       .domain(domains.y_values);

    return {x: x,y: y};
  },
  componentDidUpdate: function(){
    if(this.state.bars){
      this.setupChart();
    }
  },
  render: function () {
    var svgStyle = {
      width: this.state.width,
      height: this.state.height,
    };
    if(this.state.bars){

        var domains = D3Utils.calculatePosition(this.state.width, this.state.height, this.state.bars, "doc_count", "key");
        var scales = this.setup_scales(domains);
        

        var Bars = this.state.bars.map(function(bar) {
          return (<Bar key={bar.key} data={bar} domains={scales} />);
        }, this);

        return (
          <svg style={svgStyle}>
            <g className="graph">
            {{Bars}}
            <XAxis height={this.state.height} x={scales.x}/>
            <YAxis width={this.state.width} y={scales.y} />
            </g>
          </svg>
        );
    } else {
      return (<div></div>);
    }
  },
  _onChange: function(){
    this.setState({
       bars: BarChartStore.getAll(this.props.id)
     });
  }
});

module.exports = BarChart;