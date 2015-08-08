/*
About Us React View
*/
var React = require('react');
var Moment = require('moment');
var Router = require('react-router');
var D3ServerAction = require('../actions/D3ServerAction');

// var formatMoment = function(date, format){
//   return Moment(date, "MM/DD/YYYY HH:mm").format(format);
// };

var LineLegend = React.createClass({

  // contextTypes: {
  //    router: React.PropTypes.func
  // },
  getInitialState: function(){
    return {
      // width: 0,
      // start_date: this.props.start_date,
      // margins: 20,
      // dateMinValue: '2013-08-29',
      // dateMaxValue: '2014-09-01',
      // dateStartValue: formatMoment(this.props.start_date, "YYYY/MM/DD"),
      // time: this.props.time,
      // parent: this.props.parent
      colors: this.props.colors
    }

  },
  updateDimensions: function(){
    var el = React.findDOMNode(this);
    var d3node = d3.select(el);
    this.state.width= d3node.node().parentNode.offsetWidth;
  },
  componentWillMount: function(){

  },
  componentDidMount: function(){
    console.log("in mountttt");
    var el = React.findDOMNode(this);
    var d3node = d3.select(el);
    var legendSpace = 450 / 3//activity.length; 
    var color = this.state.colors;

    //d3node
    

    //d3node
    //.data([1,2,3])

    d3node
    .selectAll("rect")//all station ids
    .data([1,2,3])
    .enter()
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)                                    
    //.attr("x", width - 80) 
    .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 8; })  // spacing
    .attr("fill",function(d) {
      return color(d); // If array key "visible" = true then color rect, if not then make it grey 
    })
    .attr("class", "legend-box")

    // .on("click", function(d){ // On click make d.visible 
    //   d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true

    //   var maxY = findMaxY(activity); // Find max Y rating value categories data with "visible"; true
    
    //   y.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
    //    view.setState({
    //     scales: {x: x,y: y}
    //    })

    //  selection
    //    .select("path")
    //     .style("opacity", 0)
    //     .attr("d", function(d){
    //       return d.visible ? line(d.values) : null; //// If d.visible is true then draw line for this d selection
    //     })
    //     .transition()
    //     .duration(1000)
    //     .style("opacity", 1);

    //   selection.select("rect")
    //     .transition()
    //     .duration(5000)
    //     .attr("fill", function(d) {
    //     return d.visible ? color(d.name) : "#F1F1F2";
    //   });
    // });

    // selection.select("text")
    //     .attr("x", width - 50) 
    //     .attr("y", function (d, i) {

    //       return (legendSpace)+index*(legendSpace); 
    //      })  // (return (11.25/2 =) 5.625) + i * (5.625) 
    //     .text(function(d) { return d.name; }); 

  },
  render: function () {

    var divStyle = {
      width: '100%'
    };

    return (
      <div></div>
    );
  }

});

module.exports = LineLegend;