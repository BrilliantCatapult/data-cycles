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
        <RouteHandler/>
      </div>
    )
  }
}); 


// declare our routes and their hierarchy
var routes = (
  <Route handler={App} location="history">
    <Route name="map_base" path="/" handler={MapPage}/>
    <Route name="statistics_date" path="/statistics/:date" handler={Statistics}/>
    <Route name="statistics" path="/statistics" handler={Statistics}/>
    <Route name="map_datetime" path="/map/:date/:time" handler={MapPage}/>
    <Route name="map_date" path="/map/:date" handler={MapPage}/>
    <Route name="map" path="/map" handler={MapPage}/>
    <Route name="predictions" path="predictions/" handler={Predictions}/>
  </Route>
);


Router.run(routes, Router.HashLocation, function(Root) {
  React.render(<Root/>,  document.getElementById('react'));
});
