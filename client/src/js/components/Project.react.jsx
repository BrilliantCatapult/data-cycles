var React = require('react');
// var Team = require('./Team.react');

var Project = React.createClass({
  render: function () {
    return (
      <p className="lead margin-top">
        Data Cycles has made use of a year's worth of Bay Area Bike Share data to create a simulated real-time visualization, statistics and predictions. An interactive map displays a chosen day's worth of bike and dock activity. Further stastical analysis provides insight into that particular day with graphs of data. Future predictive bike activity can recommend an ideal location to rent a bike from.
      </p>
    );
  }

});

module.exports = Project;