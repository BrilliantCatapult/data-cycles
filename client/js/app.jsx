var WebAPIUtils = require('./utils/WebAPIUtils.js');
var React = require('react');


var Router = require('react-router');
var Link = Router.Link;
//var History = require('react-router/lib/BrowserHistory');
var Route = Router.Route;
//var History = Router.BrowserHistory;
var RouteHandler = Router.RouteHandler;

var Statistics = require('./components/Chart.react');
var MapPage = require('./components/MapPage.react');
var Predictions = require('./components/Predictions.react');


var App = React.createClass({
  render () {
    return (
      <div>
        <div className="container">
            <nav className="menu right">
              <Link to="map" params={{userId: 1}}>Map</Link>
              <Link to="statistics" params={{userId: 1}}>Statistics</Link>
              <Link to="predictions" params={{userId: 1}}>Predications</Link>
            </nav>
            <h1>Data Cycles</h1>
            <h3>Bay Area Bike Share data visualization</h3>
         </div>
        <RouteHandler/>
      </div>
    )
  }
});


// declare our routes and their hierarchy
var routes = (
  <Route handler={App} location="history">
    <Route name="statistics" path="statistics" handler={Statistics}/>
    <Route name="map" path="map" handler={MapPage}/>
    <Route name="predictions" path="predictions" handler={Predictions}/>
  </Route>
);


Router.run(routes, Router.HashLocation, function(Root) {
  React.render(<Root/>,  document.getElementById('react'));
});
