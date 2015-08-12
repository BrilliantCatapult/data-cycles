var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var D3Dispatcher = require('../dispatcher/D3Dispatcher');
// var ThreadStore = require('./ThreadStore');
var Constants = require('../constants/D3Constants.js');
var _messages = {};
var actions = Constants.actions;
var CHANGE_EVENT = "change";

// var parseDate = d3.time.format("%m/%d/%Y %H:%M").parse;

function _addMessages(msgs){

  processed= {};
  msgs.forEach(function(station, index){
    var id = station.fields.station_id[0];
    var name = station.fields.name[0];
    processed[id] = name;
  });

  _messages = {
      raw_data: msgs,
      processed: processed
  };



}

var ChartStore = assign({}, EventEmitter.prototype, {
  
  emitChange: function(){
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function(callback){
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback){
    this.removeListener(CHANGE_EVENT, callback);
  },
  getAll: function(){
    return _messages['processed'];
  }

});


ChartStore.dispatchToken = D3Dispatcher.register(function(action){
  switch(action.type){

    case actions.RECEIVE_STATION_DATA:
      _addMessages(action.data);
      ChartStore.emitChange();
      break;

    default:
      // do nothing
  }
});

module.exports = ChartStore;