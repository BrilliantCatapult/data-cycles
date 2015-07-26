var React = require('react');
//var ViewActionCreators = require('../actions/ViewActionCreators');
var d3 = require('d3');

var XAxis = React.createClass({
  componentDidMount: function() {

    // wrap element in d3
    
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
    // if (nextProps.data.update) {
    //   this.d3Node.datum(nextProps.data);
    // }
    var axis = d3.svg.axis().scale(nextProps.x).orient(this.props.orient || 'top').tickSize(-nextProps['height']);
    this.d3Node = d3.select(this.getDOMNode());

    this.d3Node.transition()
               .duration(2000)
               .style("opacity", nextProps.sorted);
    
    this.d3Node
       .call(axis);

    if(nextProps.orient === 'bottom'){
      this.d3Node
        .transition()
        .duration(2000)
        .attr("transform", "translate(0," + nextProps['height']  + ")")
    }

    return true;
  },
  // componentDidUpate() {
  //   this.d3Node.datum(this.props.data);
  // },
  // componentWillUnMount() {

  // },
  render: function() {
    return (
      <g className="x axis" />
    );
  }
});

module.exports = XAxis;