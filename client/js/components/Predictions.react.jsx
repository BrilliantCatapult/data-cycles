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
          <h3>Use our Machine Learning Algorithm to predict how many bikes will be at each dock!</h3>
          <div className="pred">Input date (MM/DD/YYYY):</div>
            <input type="text" name="inp" id="inp" />
            <span id="errMessage"></span>
          <div className="pred">Select a San Francisco Dock:</div>
            <select name="select" id="inp2">
              <option>41</option> 
              <option>42</option>
              <option>45</option>
              <option>46</option>
              <option>47</option>
              <option>48</option>
              <option>49</option>
              <option>50</option>
              <option>51</option>
              <option>53</option>
              <option>54</option>
              <option>55</option>
              <option>56</option>
              <option>57</option>
              <option>58</option>
              <option>59</option>
              <option>60</option>
              <option>61</option>
              <option>62</option>
              <option>63</option>
              <option>64</option>
              <option>65</option>
              <option>66</option>
              <option>67</option>
              <option>68</option>
              <option>69</option>
              <option>70</option>
              <option>71</option>
              <option>72</option>
              <option>73</option>
              <option>74</option>
              <option>75</option>
              <option>76</option>
              <option>77</option>
              <option>82</option>
            </select>
          <div>Checkout All Docks: <input onClick={this._onClick} type="button" value="Submit" /></div>
          <div>Checkout Regression Progression For A Specific Dock: <input onClick={this._getRegs} type="button" value="Submit" /></div>
            <div id="graph" className="aGraph" style={divStyle}></div>
            <div id="regs" className="aGraph"></div> 
        </div>
      <table id="results"></table>
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
  