var React = require('react');
//var ViewActionCreators = require('../actions/ViewActionCreators');
var d3 = require('d3');

var YAxis = React.createClass({
  componentDidMount: function() {

    // wrap element in d3
    var yAxis = d3.svg.axis().scale(this.props.y).orient("left").tickSize(0);
    this.d3Node = d3.select(this.getDOMNode());

    this.d3Node.transition()
               .duration(2000)
               .style("opacity", this.props.sorted);


    this.d3Node
       .call(yAxis);

  },
  shouldComponentUpdate: function(nextProps) {
    var yAxis = d3.svg.axis().scale(nextProps.y).orient("left").tickSize(0);
    this.d3Node = d3.select(this.getDOMNode());

    this.d3Node.transition()
               .duration(2000)
               .style("opacity", nextProps.sorted);
    
    this.d3Node
       .call(yAxis);

    return true;
  },
  // componentDidUpate() {
  //   this.d3Node.datum(this.props.data);
  // },
  // componentWillUnMount() {

  // },
  render: function() {
    return (
      <g className="y axis" />
    );
  }
});

module.exports = YAxis;