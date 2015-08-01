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
              <p>Donec ullamcorper nulla non metus auctor fringilla. Donec sed odio dui.</p>
            </div>
            <div className="bloc bloc-s-1">
              <div className="circle margin-top"><div></div></div>
              <h3 className="margin-top">Francois Romain</h3>
              <p>Nulla vitae elit libero, a pharetra augue. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
            </div>
            <div className="bloc bloc-s-1">
              <div className="circle margin-top"><div></div></div>
              <h3 className="margin-top">Jack McDevitt</h3>
              <p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec ullamcorper nulla non metus auctor fringilla.</p>
            </div>
            <div className="bloc bloc-s-1">
              <div className="circle margin-top"><div></div></div>
              <h3 className="margin-top">Shanan Sussman</h3>
              <p>Etiam porta sem malesuada magna mollis euismod. Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
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