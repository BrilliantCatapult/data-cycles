var React = require('react');
var LegendVisualization = require('../visualizations/LegendVisualization');
//var ViewActionCreators = require('../actions/ViewActionCreators');
var d3 = require('d3');

var Legend = React.createClass({
  componentDidMount: function() {
    this.d3Node = d3.select(this.getDOMNode());
    this.d3Node.datum(this.props.data)
      .call(LegendVisualization.enter,this.props.colors, this.props.width, this.props.index);
  },
  shouldComponentUpdate: function(nextProps) {
    this.d3Node = d3.select(this.getDOMNode());
    this.d3Node.datum(this.props.data)
      .call(LegendVisualization.update,this.props.colors, this.props.width, this.props.index, 200);
    return true;
  },
  render: function() {
    return (
      <g className="legend" />
    );
  }
});



module.exports = Legend;