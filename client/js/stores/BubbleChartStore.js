var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var D3Dispatcher = require('../dispatcher/D3Dispatcher');
// var ThreadStore = require('./ThreadStore');
var Constants = require('../constants/D3Constants.js');

var _messages = {};
var actions = Constants.actions;
var CHANGE_EVENT = "change";

function _addMessages(data_for, msgs){
  // will process data first!!!
  console.log("MESSSSSS", msgs);
  _messages[data_for] = msgs;
  _messages[data_for].sort(function(a, b) { return b.doc_count - a.doc_count; });
}

var BubbleChartStore = assign({}, EventEmitter.prototype, {
  
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


BubbleChartStore.dispatchToken = D3Dispatcher.register(function(action){
  switch(action.type){

    case actions.RECEIVE_BUBBLE_DATA:
      console.log("JEREEEEEE", action.data_for);
      _addMessages(action.data_for, action.data);
      console.log("after is");
      BubbleChartStore.emitChange(action.data_for);
      break;

    //case actions.LOAD_DATA:


    default:
      // do nothing
  }
});

module.exports = BubbleChartStore;