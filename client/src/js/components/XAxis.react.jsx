var React = require('react');
var d3 = require('d3');

var XAxis = React.createClass({
  
  componentDidMount: function() {
    var axis = d3.svg.axis().scale(this.props.x).orient(this.props.orient || 'top').tickSize(-this.props['height']);
    this.d3Node = d3.select(this.getDOMNode());

    this.d3Node.transition()
               .duration(2000)
               .style("opacity", this.props.sorted);

    if(this.props.orient === 'bottom'){
      this.d3Node
        .transition()
        .duration(2000)
        .attr("transform", "translate(0," + this.props['height']  + ")")
    }

    this.d3Node
       .call(axis);

  },
  shouldComponentUpdate: function(nextProps) {
    var axis = d3.svg.axis().scale(nextProps.x).orient(this.props.orient || 'top').tickSize(-nextProps['height']);
    this.d3Node = d3.select(this.getDOMNode());

    this.d3Node.transition()
               .duration(2000)
               .style("opacity", nextProps.sorted);
    
    if(nextProps.orient === 'bottom'){
      this.d3Node
        .transition()
        .duration(2000)
        .attr("transform", "translate(0," + nextProps['height']  + ")")
    }

    this.d3Node
       .call(axis);


    return true;
  },

  render: function() {
    return (
      <g className="x axis" />
    );
  }
});

module.exports = XAxis;