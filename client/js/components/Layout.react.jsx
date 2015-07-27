var React = require('react');
var Router = require('react-router');
var Link = Router.Link;


var Layout = React.createClass({
  render: function () {

    var divStyle = {
      width: '100%'
    };

    return (
     <div className="container">
         <nav className="menu right">
           <Link to="map" params={start_date: this.props.start_date}>Map</Link>
           <Link to="statistics" params={start_date: this.props.start_date}>Statistics</Link>
           <Link to="predictions">Predications</Link>
         </nav>
         <h1>Data Cycles</h1>
         <h3>Bay Area Bike Share data visualization</h3>
         <h3>PROPS: </h3> 
      </div> 
    );
  },

});

module.exports = Layout;