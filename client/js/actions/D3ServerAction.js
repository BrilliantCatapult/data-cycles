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
    // promisify this.. and .then.. do dispatch.
    //var data = 
    WebAPIUtils.getServerData(data_for, start_date, end_date);
    // console.log("DATA IS ", data);
    // D3Dispatcher.dispatch({
    //   type: actions.RECEIVE_DATA,
    //   data: data, 
    //   data_for: data_for
    // }); 
  }, 

  readyToReceiveBubble: function(data_for, start_date, end_date) {
    // promisify this.. and .then.. do dispatch.
    WebAPIUtils.getBubbleData(data_for, start_date, end_date);
    // var data = WebAPIUtils.getServerData(data_for);
    // console.log("DATA IS", data);
    // D3Dispatcher.dispatch({
    //   type: actions.RECEIVE_BUBBLE_DATA,
    //   data: data,
    //   data_for: data_for
    // });
  },

  readyToReceiveLine: function(data_for, start_date, end_date) {
    // promisify this.. and .then.. do dispatch.
    WebAPIUtils.getLineData(data_for, start_date, end_date);
    // console.log("DATA IS bb", data);
    // D3Dispatcher.dispatch({
    //   type: actions.RECEIVE_LINE_DATA,
    //   data: data,
    //   data_for: data_for
    // });
  }
};