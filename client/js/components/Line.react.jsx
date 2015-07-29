var React = require('react');
var LineVisualization = require('../visualizations/LineVisualization');
//var ViewActionCreators = require('../actions/ViewActionCreators');
var d3 = require('d3');

var Line = React.createClass({
  componentDidMount: function() {
    this.d3Node = d3.select(this.getDOMNode());
    this.d3Node.datum(this.props.data)
      .call(LineVisualization.enter,this.props.domains, this.props.scales, this.props.radius, this.props.color, this.props.tooltip, this.props.activity, this.props.width, this.props.index, this.props.parent, this.props.view)
  },
  shouldComponentUpdate: function(nextProps) {
     this.d3Node = d3.select(this.getDOMNode())
     this.d3Node//.datum(this.props.data)
     .call(LineVisualization.update,this.props.domains, nextProps.scales, this.props.radius, this.props.color, this.props.tooltip, nextProps.activity, nextProps.width, this.props.index, this.props.parent, this.props.view, 200)
     return true;
  },
   componentDidUpate: function() {
   },
  render: function() {
    return (
      <g className="city" />
    );
  }
});

module.exports = Line;