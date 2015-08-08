/*
Info section view
*/

var React = require('react');
var Utils = require('../utils/WebAPIUtils');
var D3ServerAction = require('../actions/D3ServerAction');
var Moment = require('moment');
var Loader = require('react-loader');
var InfoStore = require('../stores/InfoStore');


var Info = React.createClass({
  // initially, there's no data [we get data asynchronously from the server]
  // width and height can be passed in as props (Attributes)
  // startdate and enddate are also passed in as attributes.
  // loaded is set to false initially. this controls the loading bar.
  getInitialState: function(){
    return{
      start_date: this.props.start_date,
      end_date: this.props.end_date,
    };
  },
  getDefaultProps: function(){
    return {
      width: '500',
      height: '200',
    };
  },
  componentWillReceiveProps: function(nextProps) {
          // if (typeof nextProps.showAdvanced === 'boolean') {
               this.setState({
                  start_date: nextProps.start_date,
                  end_date: nextProps.end_date,
               });
          // }
        D3ServerAction.readyToReceiveInfo(this.props.id, this.props.order, nextProps.start_date, nextProps.end_date);
    },
  // when component is about to mount, call action to start receiving server data.
  componentWillMount: function(){
    D3ServerAction.readyToReceiveInfo(this.props.id, this.props.order, this.state.start_date, this.state.end_date);
  },
  // after component mounts, attach all listeners
  componentDidMount: function(){
    InfoStore.addChangeListener(this._onChange);
  },
  // before component unmounds, remove all event listeners.
  componentWillUnmount: function(){
    InfoStore.removeChangeListener(this._onChange);
  },
  // when component updates, setup chart again, which sets up width.
  componentDidUpdate: function(){
  },
  // render the component
  render: function () {
    return (
      <div></div>
      );
  },
  _onChange: function(s){
    if(s === this.props.id){
      var el = React.findDOMNode(this);
      var d3node = d3.select(el);
      var data = InfoStore.getAll(this.props.id);

      // when store data changes, this will be called to reset the data and re-render the chart.
      d3node.text("Bike #"+data.aggregations.filter_by_date.rides_per_bike.buckets[0].key+", "+data.aggregations.filter_by_date.rides_per_bike.buckets[0].doc_count);
    }
  }
});

module.exports = Info;
