var React = require('react');
var Layout = require('./Layout.react.jsx');

var FileNotFound = React.createClass({  
  render: function () {

    var divStyle = {
      width: '100%'
    };

    return (
      <div>
        <Layout />
        <div style={divStyle} className="container">
          <h1 className="container">404! File Not Found </h1>
        </div>
      </div>
    );
  },

});

module.exports = FileNotFound;