var React = require('react');
// var Team = require('./Team.react');

var Project = React.createClass({
  render: function () {
    return (
      <p>
        Data Cycles has made use of a year's worth of data from the Bay Area Bike Share in order to create a simulated real-time visualization. Using an interactive map, we are able to display any day's worth of bike activity and further stastical analysis allows for greater insight into that particular day. WIth the help of non-parametric polynomial regresion, future predictive bike activity is harnessed to recommend an ideal location to rent a bike from.
      </p>
    );
  },

});

module.exports = Project;