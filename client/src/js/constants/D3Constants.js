var constants = {};
var keyMirror = require('keymirror');

constants.actions = keyMirror({
  RECEIVE_BIKE_DATA: null,
  RECEIVE_DATA: null,
  LOAD_DATA: null,
  RECEIVE_LINE_DATA: null,
  RECEIVE_STATION_DATA: null,
  RECEIVE_INFO_DATA: null
});



module.exports = constants;