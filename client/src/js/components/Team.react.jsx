var React = require('react');
// var Team = require('./Team.react');

var Team = React.createClass({
  render: function () {

    var divStyle = {
      width: '100%'
    };

    var listNames = this.props.names.map(function(name) {
      return <li> {name} </li>;
    });

    return (
      <ul>
        {listNames}
      </ul>
    );
  },

});

module.exports = Team;