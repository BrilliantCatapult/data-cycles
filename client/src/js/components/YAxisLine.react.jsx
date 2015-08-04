var React = require('react');
var d3 = require('d3');

var YAxis = React.createClass({

  componentDidMount: function() {
    // wrap element in d3
    var yAxis = d3.svg.axis().scale(this.props.y).orient("left").tickSize(0);
    this.d3Node = d3.select(this.getDOMNode());

    this.d3Node
        .transition()
        .duration(1000)
        .call(yAxis)

    this.d3Node.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("class", "ytext")
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Station Activity ["+ this.props.name + "]");

  },
  shouldComponentUpdate: function(nextProps) {
    var yAxis = d3.svg.axis().scale(nextProps.y).orient("left").tickSize(0);
    this.d3Node = d3.select(this.getDOMNode());

    this.d3Node
    .transition()
    .duration(500)
    .call(yAxis)
        .select(".ytext")
         .transition()
         .duration(2000)
         .attr("transform", "rotate(-90)")
         .attr("y", 6)
         .attr("dy", ".71em")
         .style("text-anchor", "end")
         .text("Station Activity ["+ this.props.name + "]");

    return true;
  },
  
  render: function() {
    return (
      <g className="y axis" />
    );
  }
});

module.exports = YAxis;