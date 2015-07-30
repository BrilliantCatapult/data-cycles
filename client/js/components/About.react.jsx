var React = require('react');
var Layout = require('./Layout.react.jsx');
var Team = require('./Team.react');
var Project = require('./Project.react');

var About = React.createClass({
  getInitialState: function(){
    return {
      teammates: ['Bahia Sharkawy', 'Francois Romain', 'Jack McDevitt', 'Shanan Sussman']
    }

  },
  
  render: function () {

    var divStyle = {
      width: '100%'
    };

    return (
      <div>
        <Layout />
        <div style={divStyle} className="container">
          <div className="team">The Team</div>
            <Team names={this.state.teammates} />
          <div className="project">Project Synopsis</div>
            <Project />
        </div>
      </div>
    );
  },

});

module.exports = About;