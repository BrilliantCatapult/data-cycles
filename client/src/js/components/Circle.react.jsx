var React = require('react');
var CircleVisualization = require('../visualizations/CircleVisualization');
//var ViewActionCreators = require('../actions/ViewActionCreators');
var d3 = require('d3');

var Circle = React.createClass({
  componentDidMount: function() {
    this.d3Node = d3.select(this.getDOMNode());
    this.d3Node.datum(this.props.data)
      .call(CircleVisualization.enter,this.props.domains, this.props.scales, this.props.radius, this.props.color, this.props.tooltip, this.props.sorted);
  },
  shouldComponentUpdate: function(nextProps) {
    this.d3Node = d3.select(this.getDOMNode());
    this.d3Node.datum(nextProps.data)
    .call(CircleVisualization.update,nextProps.domains, nextProps.scales, nextProps.radius, nextProps.color, nextProps.tooltip,nextProps.sorted, 200);
    return true;
  },
   // componentDidUpate: function() {
   // },
 //  componentDidUpate: function(props) {
 //   this.d3Node.datum(props.data);
 // },
  render: function() {
    return (
      <circle className="circle" />
    );
  }
});

module.exports = Circle;