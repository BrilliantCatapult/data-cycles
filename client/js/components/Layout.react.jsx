var React = require('react');
var Router = require('react-router');
var Link = Router.Link;


var Layout = React.createClass({
  componentDidUpdate: function(newProps){
  },
  render: function () {

    var divStyle = {
      width: '100%'
    };

    return (
     <div className="container">
         <nav className="menu right">
           <Link to="map_datetime" params={{date: this.props.start_date || "2013-12-18", time: this.props.time || "00:00"}} >Map</Link>
           <Link to="statistics_datetime" params={{date: this.props.start_date || "2013-12-18", time: this.props.time || "00:00"}} >Statistics</Link>
           <Link to="predictions">Predications</Link>
           <Link to="about">About</Link>
         </nav>
         <h1>Data Cycles</h1>
         <h3>Bay Area Bike Share data visualization</h3>
      </div> 
    );
  },
 
});

module.exports = Layout;