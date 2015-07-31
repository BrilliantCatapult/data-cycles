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
        <div className="container">
          <div className="pred">Input date (MM/DD/YYYY):</div>
            <input type="text" name="inp" id="inp" />
            <input onClick={this._onClick} type="button" value="Submit" />
            <span id="errMessage"></span>
            <div className="pred">Input San Francisco Dock:</div>
            <input type="text" name="inp" id="inp2" />
            <input onClick={this._getRegs} type="button" value="Submit" />
            <div id="graph" className="aGraph" style={divStyle}></div> 
            <div id="regs" className="aGraph"></div> 
            <table id="results" border="1" cellPadding="2" cellSpacing="2"></table>
        </div>
      </div>
    );
  },

  _onClick: function(){
    PredictionLogic.getData();
    console.log(document.getElementById("regs"));
    if(document.getElementById("regs").children.length > 0){
      PredictionLogic.getRegs();
    }
  },

  _getRegs: function(){
    PredictionLogic.getRegs();
  }

});

module.exports = Predictions;
  