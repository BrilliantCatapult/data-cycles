var React = require('react');
var Line = require('./Line.react');
var LineChartStore = require('../stores/LineChartStore');
var d3 = require('d3');
var Utils = require('../utils/WebAPIUtils');
var D3Utils = require('../utils/D3Utils');
var XAxis = require('./XAxis.react');
var YAxisLine = require('./YAxisLine.react');
var Legend = require('./Legend.react');
var D3ServerAction = require('../actions/D3ServerAction');

var CHANGE_EVENT="change";
var parseDate = d3.time.format("%m/%d/%Y %H:%M").parse;

var getDataFromServer = function(id){
  // console.log(LineChart.props);
  var data = LineChartStore.getAll(id);
  return data;
}




var LineChart = React.createClass({
  getInitialState: function(){

    // get data from server.
    //D3ServerAction.readyToReceive(this.props.id);
    // var data = getDataFromServer();

    return{
      bars: [],//data.raw_data,
      width: this.props.width,
      height: this.props.height,
      activity: [],//data.activity
      start_date: "05/06/2014 00:00",
      end_date: "05/07/2014 00:00"
    };
  },
  getDefaultProps: function(){
    return {
      width: '500',
      height: '500',
    };
  },
  // componentWillMount: function(){

  // },
  updateDimensions: function(){
    setTimeout(function(){
      var el = React.findDOMNode(this);
      var d3node = d3.select(el);
      //console.log("AND HERE ", d3node.node().parentNode.offsetWidth);
      this.setState({width: d3node.node().parentNode.offsetWidth});
    }.bind(this),500);  
  },
  setupChart: function(){
    var el = React.findDOMNode(this);
    var d3node = d3.select(el);
    var parentNode = d3node.node().parentNode;

    this.state.tooltip = D3Utils.setupTooltip(parentNode);
    this.state.width = parentNode.offsetWidth;
    d3node.select('g')
      .attr("transform", "translate(" + 20 + "," + 20 + ")");
  },
  componentWillMount: function(){
    //console.log("HERE IN LINE ", this.props.id);
    //D3ServerAction.readyToReceiveLine(this.props.id);
    //Utils.getServerData(this.props.id);
    
  },
  componentDidMount: function(){
    this.setupChart();
    this.state.colors = D3Utils.calculateColor([0, 100]);
    
    D3ServerAction.readyToReceiveLine(this.props.id, this.state.start_date, this.state.end_date);
    LineChartStore.addChangeListener(this._onChange);
    
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
    
    //this._onChange();
  },
  setup_scales: function(domains){
    var x = d3.time.scale()
       .range([0, this.state.width - 80])
       .domain([parseDate(this.state.start_date), parseDate(this.state.end_date)]);

    var ydomain = [
            0,
            d3.max(this.state.activity, function(c) { 
              if(c.visible)
                return d3.max(c.values, function(v) { return v.activity; }); 
              else
                return 0;
            })
          ]
    var y = d3.scale.linear()
      .range([this.state.height , 0])
      .domain(ydomain);
    // console.log("MAX Y IS ", ydomain[1]);
    // console.log("HEIGHT IS ", this.state.height);
    // console.log("draw at ", y(ydomain[1]));
    this.state.scales = {x: x,y: y};

    return {x: x,y: y};
  },
  componentDidUpdate: function(){
    if(this.state.bars){
      this.setupChart();
      var context = this;
      d3.select('#mouse_tracker').on('mousemove', function(){
        //console.log("CALLED AGAIN??", this);
        var bisectDate = d3.bisector(function(d) {
           return d.date; 
         }).left;

        var el = React.findDOMNode(context);
        var d3node = d3.select(el);
        var mouse_x = d3.mouse(this)[0] // Finding mouse x position on rect
        var graph_x = context.state.scales.x.invert(mouse_x); // 
        var format = d3.time.format('%b %Y'); // Format hover date text to show three letter month and full year
         /* d3.mouse(this)[0] returns the x position on the screen of the mouse. xScale.invert function is reversing the process that we use to map the domain (date) to range (position on screen). So it takes the position on the screen and converts it into an equivalent date! */
        
        d3node
        .selectAll(".tooltip2").text(function(d){

           i = bisectDate(d.values, graph_x, 0); // use our bisectDate function that we declared earlier to find the index of our data array that is close to the mouse cursor
           d0 = d.values[i - 1];
           d1 = d.values[i];
           if(d1 && d0)
             d = graph_x - d0.date > d1.date - graph_x ? d1 : d0;
           else if(d0)
             d = d0;
           else
             d={activity: null};

           return (d.activity);
        });
      });
    }
  },
  render: function () {
    console.log("re-rendering")
    var svgStyle = {
      width: this.state.width,
      height: Number(this.state.height) + 50,
    };
    if(this.state.bars && this.state.bars.length > 0){

        //console.log(this.state.activity);

        var el = React.findDOMNode(this);
        var d3node = d3.select(el);

        var setup = {}//D3Utils.calculatePosition(this.state.width, this.state.height, this.state.bars, "doc_count", "key");
        var scales = this.setup_scales(setup);

        
        setup.start_date = this.state.start_date;
        setup.end_date = this.state.end_date;
        
        var Lines = this.state.activity.map(function(bar, i) {
            return (<Line key={bar.key} data={bar} domains={setup} scales={this.state.scales} color={this.state.colors} tooltip={this.state.tooltip} activity={this.state.activity} width={this.state.width} index={i} parent={d3node} view={this}/>);
        }, this);

  
        return (
            <svg style={svgStyle}>            
              <g className="graph">
                <rect id="mouse_tracker" width={this.state.width} height={this.state.height} x="0" y="0" className="mouse-tracker" style={{fill:'white'}}></rect>
                {{Lines}}
                <XAxis height={this.state.height} x={this.state.scales.x} orient="bottom"/>
                <YAxisLine width={this.state.width} y={this.state.scales.y}/>
              </g>
            </svg>
        );
    } else {
      return (<div></div>);
    }
  },
  _onChange: function(){
    //console.log("in change");
    var data = getDataFromServer(this.props.id);
    //console.log("DATA is ", data);
    this.setState({
       bars: data.raw_data,
       activity: data.activity
     });
  },

});

module.exports = LineChart;