var React = require('react');
var Router = require('react-router');
var Link = Router.Link;


var Layout = React.createClass({
  render: function () {

    console.log("LAYOUT START-DATE ", this.props.start_date);
    
    var divStyle = {
      width: '100%'
    };

    return (
     <div className="container">
         <nav className="menu right">
           <Link to="map_datetime" params={{date: this.props.start_date, time: this.props.time}} >Map</Link>
           <Link to="statistics_date" params={{date: this.props.start_date}} >Statistics</Link>
           <Link to="predictions">Predications</Link>
         </nav>
         <h1>Data Cycles</h1>
         <h3>Bay Area Bike Share data visualization</h3>
      </div> 
    );
  },

});

module.exports = Layout;