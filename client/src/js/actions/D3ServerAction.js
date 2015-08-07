var D3Dispatcher = require('../dispatcher/D3Dispatcher');
var Constants = require('../constants/D3Constants');
var WebAPIUtils = require('../utils/WebAPIUtils');
 
var actions = Constants.actions;
 
module.exports = {
  // When Bar graph data is received from the server, notify the store, using the dispatcher
  receiveAll: function (data, data_for) {
    D3Dispatcher.dispatch({
      type: actions.RECEIVE_DATA,
      data: data,
      data_for: data_for
    });
  },
  // When Bubble graph data is received from the server, notify the store, using the dispatcher
  receiveBubble: function (data, data_for) {
    D3Dispatcher.dispatch({
      type: actions.RECEIVE_BUBBLE_DATA,
      data: data,
      data_for: data_for
    });
  },
  // When Line graph data is received from the server, notify the store, using the dispatcher
  receiveLine: function (data, data_for) {
    D3Dispatcher.dispatch({
      type: actions.RECEIVE_LINE_DATA,
      data: data,
      data_for: data_for
    });
  },
  // When station data received, notify store, using the dispatcher.
  receiveStation: function (data) {
    D3Dispatcher.dispatch({
      type: actions.RECEIVE_STATION_DATA,
      data: data,
    });
  },
  // View is loaded, and is ready to receive server bar data
  readyToReceive: function(data_for, start_date, end_date) {
    WebAPIUtils.getServerData(data_for, start_date, end_date);
  }, 
  // View is loaded, and is ready to receive server bubble data
  readyToReceiveBubble: function(data_for, start_date, end_date) {
    WebAPIUtils.getBubbleData(data_for, start_date, end_date);
  },
  // View is loaded, and is ready to receive server line data
  readyToReceiveLine: function(data_for, start_date, end_date) {
    WebAPIUtils.getLineData(data_for, start_date, end_date);
  },
  // Get all station ids and names
  readyToReceiveStation: function() {
    WebAPIUtils.getStationData();
  }
};