/*
  Bars view for each bar in the bar chart
*/
var React = require('react');
var BarVisualization = require('../visualizations/BarVisualization');
var d3 = require('d3');

var Bar = React.createClass({
  componentDidMount: function() {
    this.d3Node = d3.select(this.getDOMNode());
    this.d3Node.datum(this.props.data)
      .call(BarVisualization.enter, this.props.domains);
  },
  shouldComponentUpdate: function(nextProps) {
    this.d3Node = d3.select(this.getDOMNode());
    this.d3Node.datum(nextProps.data)
    .call(BarVisualization.update, nextProps.domains, 200);
    return true;
  },
 componentDidUpate: function() {
 },
 // shouldComponentUpdate: function(nextProps) {
 //   if (nextProps.data.update) {
 //     this.d3Node.datum(nextProps.data);
 //   }
 //   return true;
 // },
 componentDidUpate: function() {
   this.d3Node.datum(this.props.data);
 },
  render: function() {
    return (
      <g className="Bar" />
    );
  }
});

module.exports = Bar;