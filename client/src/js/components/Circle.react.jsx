var React = require('react');
var CircleVisualization = require('../visualizations/CircleVisualization');
//var ViewActionCreators = require('../actions/ViewActionCreators');
var d3 = require('d3');

var Circle = React.createClass({
  componentDidMount: function() {
    this.d3Node = d3.select(this.getDOMNode());
    this.d3Node.datum(this.props.data)
      .call(CircleVisualization.enter,this.props.domains, this.props.scales, this.props.radius, this.props.color, this.props.tooltip);
  },
  shouldComponentUpdate: function(nextProps) {
    this.d3Node = d3.select(this.getDOMNode());
    this.d3Node.call(CircleVisualization.update,this.props.domains, this.props.scales, this.props.radius, this.props.color, this.props.tooltip,nextProps.sorted, 200);
    return true;
  },
   componentDidUpate: function() {
   },
  render: function() {
    return (
      <circle className="circle" />
    );
  }
});

module.exports = Circle;