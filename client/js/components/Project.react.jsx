var React = require('react');
// var Team = require('./Team.react');

var Project = React.createClass({
  render: function () {
    return (
      <p>
        Data Cycles has made use of a year's worth of Bay Area Bike Share data to create a simulated real-time visualization. Our interactive map displays a chosen day's worth of bike and dock activity with the ability to change animation speed. Further stastical analysis provides insight into that particular day with graphs of data displayed on the statistics page. With the help of non-parametric polynomial regresion, future predictive bike activity is harnessed to recommend an ideal location to rent a bike from.
      </p>
    );
  }

});

module.exports = Project;