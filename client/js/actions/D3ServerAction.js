var D3Dispatcher = require('../dispatcher/D3Dispatcher');
var Constants = require('../constants/D3Constants');
var WebAPIUtils = require('../utils/WebAPIUtils');
 
var actions = Constants.actions;
 
module.exports = {
  receiveAll: function (data, data_for) {
    D3Dispatcher.dispatch({
      type: actions.RECEIVE_DATA,
      data: data,
      data_for: data_for
    });
  },
  receiveBubble: function (data, data_for) {
    D3Dispatcher.dispatch({
      type: actions.RECEIVE_BUBBLE_DATA,
      data: data,
      data_for: data_for
    });
  },
  receiveLine: function (data, data_for) {
    D3Dispatcher.dispatch({
      type: actions.RECEIVE_LINE_DATA,
      data: data,
      data_for: data_for
    });
  },
  readyToReceive: function(data_for, start_date, end_date) {
    WebAPIUtils.getServerData(data_for, start_date, end_date);
  }, 

  readyToReceiveBubble: function(data_for, start_date, end_date) {
    WebAPIUtils.getBubbleData(data_for, start_date, end_date);
  },

  readyToReceiveLine: function(data_for, start_date, end_date) {
    WebAPIUtils.getLineData(data_for, start_date, end_date);
  }
};