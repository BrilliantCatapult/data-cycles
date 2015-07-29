var WebAPIUtils = require('./utils/WebAPIUtils.js');
var React = require('react');

var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Redirect = Router.Redirect;
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
    <Route name="statistics_datetime" path="/statistics/:date/:time" handler={Statistics}/>
    <Route name="map_datetime" path="/map/:date/:time" handler={MapPage} ignoreScrollBehavior/>
    <Route name="predictions" path="predictions/" handler={Predictions}/>
    <Redirect path="/" to="map_datetime" params={{date:"22-12-2013", time:"06:24"}} />
    <Redirect path="/statistics" to="statistics_datetime" params={{date:"22-12-2013", time:"06:24"}} />
  </Route>
);


Router.run(routes, Router.HashLocation, function(Root) {
  React.render(<Root/>,  document.getElementById('react'));
});
