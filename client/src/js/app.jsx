var WebAPIUtils = require('./utils/WebAPIUtils.js');
var React = require('react');

var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var Redirect = Router.Redirect;
var Link = Router.Link;
//var History = require('react-router/lib/BrowserHistory');
var Route = Router.Route;
//var History = Router.BrowserHistory;
var RouteHandler = Router.RouteHandler;
 
var Statistics = require('./components/Chart.react');
var MapPage = require('./components/MapPage.react');
var Predictions = require('./components/Predictions.react');
var About = require('./components/About.react');
var FileNotFound = require('./components/404.react');


var App = React.createClass({
  render () {
    return (
      <div>
        <div className="page"> 
          <RouteHandler/>
          <div className="push-footer"></div>
        </div>
        <footer className="footer container margin-top"><hr />2015</footer>
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

    <Route name="about" path="about/" handler={About}/>
    <Redirect path="/" to="map_datetime" params={{date:"2013-11-21", time:"10:00"}} />
    <Redirect path="/statistics" to="statistics_datetime" params={{date:"2013-11-21", time:"10:00"}} />
    <NotFoundRoute handler={FileNotFound}/>
  </Route>
);


Router.run(routes, Router.HashLocation, function(Root) {
  React.render(<Root/>,  document.getElementById('react'));
});
