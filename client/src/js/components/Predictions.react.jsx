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
          <h2>Predictions</h2>
          <hr />
          <div className="grid">
            <div className="bloc bloc-s-1">
              <p>Select a date in the future and a terminal number to get an estimate of the number of bikes available.</p>
            </div>
            <div className="bloc bloc-s-1">
              <h3>Future date</h3>
              <input type="text" name="inp" id="inp" className="input-alt" placeholder="MM/DD/YYYY" />
              <span id="errMessage"></span>
              <input onClick={this._onClick} type="button" value="Submit" className="btn btn-full btn-alt btn-m margin-top"/>
            </div>
            <div className="bloc bloc-s-1">
              <h3>Terminal</h3>
              <select name="select" id="inp2" className="input-alt">
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
              <input onClick={this._getRegs} type="button" value="Submit" className="btn btn-full btn-alt btn-m margin-top"/>
            </div>
          </div>
        </div>
        <div className="container hide" id="res-single">
          <h3>Single dock activity prediction</h3>
          <div id="regs" className="aGraph"></div>
        </div>
        <div className="container hide" id="res-every">
          <h3>Every dock activity prediction</h3>
          <div id="graph" className="aGraph" style={divStyle}></div>
          <div>Find the best time to pick up a bike on <span id="date"></span> below!</div>
          <table id="results">
            <tr><td>Dock</td><td>Max Bikes</td><td>Hour(Max)</td><td>Min Bikes</td><td>Hour(Min)</td><td>Standard Deviation</td><td>Standard Error</td><td>Equation (10th Degree)</td>
            </tr>
          </table>
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
  