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
     <div className="container clearfix">
         <nav className="menu right">
           <Link to="map_datetime" params={{date: this.props.start_date || "2013-12-18", time: this.props.time || "00:00"}} className="btn btn-m xs">Map</Link>
           <Link to="statistics_datetime" params={{date: this.props.start_date || "2013-12-18", time: this.props.time || "00:00"}}  className="btn btn-m xs">Statistics</Link>
           <Link to="predictions" className="btn btn-m xs">Predications</Link>
           <Link to="about" className="btn btn-m xs">About</Link>
         </nav>
         <div>
           <h1 className="title margin-top">Data Cycles</h1>
           <h6 className="title-sub">Bay Area Bike Share <br />Data-visualization</h6>
          </div>
      </div> 
    );
  },
 
});

module.exports = Layout;