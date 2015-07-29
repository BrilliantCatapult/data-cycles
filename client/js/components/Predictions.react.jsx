var React = require('react');
var Layout = require('./Layout.react.jsx');
var Moment = require('moment');
var PredictionLogic = require('../polyMLA/tenDegPoly');

var Predictions = React.createClass({

  
  render: function () {

    var divStyle = {
      width: '100%'
    };

    return (
      <div>
        <Layout />
        <div class="container">
          <div class="pred">Input date (MM/DD/YYYY):</div>
            <input type="text" name="inp" id="inp" />
            <input onClick={this._onClick} type="button" value="Submit" />
            <div class="pred">Input San Francisco Dock:</div>
            <input type="text" name="inp" id="inp2" />
            <input onClick={this._getRegs} type="button" value="Submit" />
            <div id="graph" class="aGraph"></div> 
        </div>
      </div>
    );
  },

  _onClick: function(){
    PredictionLogic.getData();
  },

  _getRegs: function(){
    PredictionLogic.getRegs();
  }

});

module.exports = Predictions;
  