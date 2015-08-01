/*
About Us React View
*/
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
        <div className="container">
          <h2 className="margin-top">The Team</h2>
          <hr />
          <div className="grid">
            <div className="bloc bloc-s-1">
              <div className="circle margin-top"><div></div></div>
              <h3 className="margin-top">Bahia Sharkawy</h3>
              <p>Master of her own domain and knows more about your domain than you do.</p>
              <div><a href="https://github.com/bahiafayez"><img src="../../images/github.png" height="50" width="50" /></a></div>
            </div>
            <div className="bloc bloc-s-1">
              <div className="circle margin-top"><div></div></div>
              <h3 className="margin-top">Francois Romain</h3>
              <p>If you are what you eat, he would be an organic carrot. <br/>Nickname: Swaa.</p>
              <div><a href="https://github.com/francoisromain"><img src="../../images/github.png" height="50" width="50" /></a></div>
            </div>
            <div className="bloc bloc-s-1">
              <div className="circle margin-top"><div></div></div>
              <h3 className="margin-top">Jack McDevitt</h3>
              <p>Born in a city, raised in a city. Still lives in a city, but once did not.</p>
              <div><a href="https://github.com/jackmcd4"><img src="../../images/github.png" height="50" width="50" /></a></div>
            </div>
            <div className="bloc bloc-s-1">
              <div className="circle margin-top"><div></div></div>
              <h3 className="margin-top">Shanan Sussman</h3>
              <p>Some say his beard holds the power to control minds, some people don&#8217;t remember much anymore.</p>
              <div><a href="https://github.com/myfancypants"><img src="../../images/github.png" height="50" width="50" /></a></div>
            </div>
          </div>
          <h2 className="margin-top">Project Synopsis</h2>
          <hr />
          <Project />
        </div>
      </div>
    );
  },

});

module.exports = About;