var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var D3Dispatcher = require('../dispatcher/D3Dispatcher');
// var ThreadStore = require('./ThreadStore');
var Constants = require('../constants/D3Constants.js');

var _messages = {};
var actions = Constants.actions;
var CHANGE_EVENT = "change";

function _addMessages(data_for, msgs){
  _messages[data_for] = msgs;
}

var BarChartStore = assign({}, EventEmitter.prototype, {
  
  emitChange: function(id){
    this.emit(CHANGE_EVENT, id);
  },
  addChangeListener: function(callback){
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback){
    this.removeListener(CHANGE_EVENT, callback);
  },
  getAll: function(id){
    return _messages[id];
  }

});


BarChartStore.dispatchToken = D3Dispatcher.register(function(action){
  switch(action.type){

    case actions.RECEIVE_DATA:
      _addMessages(action.data_for, action.data);
      BarChartStore.emitChange(action.data_for);
      break;

    default:
      // do nothing
  }
});

module.exports = BarChartStore;