/*
About Us React View
*/
var React = require('react');
var Layout = require('./Layout.react.jsx');
var Team = require('./Team.react');
var Project = require('./Project.react');

var About = React.createClass({
  getInitialState: function(){
    return {
      teammates: ['Bahia Sharkawy', 'Francois Romain', 'Jack McDevitt', 'Shanan Sussman']
    }
  },
  
  render: function () {

    var divStyle = {
      width: '100%'
    };

    return (
      <div>
        <Layout />
        <div className="container margin-top">
          <div className="grid">
            <div className="bloc bloc-s-2">
              <p className="lead">
                Data Cycles uses <a href="http://www.bayareabikeshare.com/datachallenge">a year’s worth of Bay Area Bike Share data</a> to create a simulated real-time visualization, statistics and predictions. </p>
              <p><a href="https://github.com/BrilliantCatapult/data-cycles"><i className="left icon icon-github"></i> Data Cycles on Github</a></p>
            </div>
          </div>
          
          <h2 className="margin-top">Team</h2>
          <hr />
          <div className="grid">
            <div className="bloc bloc-s-1">
              <div className="circle margin-top"><img src="../../img/profile-bahia.png" /></div>
              <h3 className="margin-top">Bahia Sharkawy</h3>
              <div><a href="https://github.com/bahiafayez"><i className="icon icon-github"></i></a> <a href="http://www.calcium-c.com/"><i className="icon icon-globe"></i></a></div>
              <p>Master of her own domain and knows more about your domain than you do.</p>
            </div>
            <div className="bloc bloc-s-1">
              <div className="circle margin-top"><img src="../../img/profile-francois.png" /></div>
              <h3 className="margin-top">Francois Romain</h3>
              <div><a href="https://github.com/francoisromain"><i className="icon icon-github"></i></a> <a href="https://twitter.com/d_sgnl"><i className="icon icon-twitter"></i></a></div>
              <p>If you are what you eat, he would be an organic carrot. <br/>Nickname: Swaa.</p>
              
            </div>
            <div className="bloc bloc-s-1">
              <div className="circle margin-top"><img src="../../img/profile-jack.png" /></div>
              <h3 className="margin-top">Jack McDevitt</h3>
              <div><a href="https://github.com/jackmcd4"><i className="icon icon-github"></i></a></div>
              <p>Born in a city, raised in a city. Still lives in a city, but once did not.</p>
            </div>
            <div className="bloc bloc-s-1">
              <div className="circle margin-top"><img src="../../img/profile-shanan.png" /></div>
              <h3 className="margin-top">Shanan Sussman</h3>
              <div><a href="https://github.com/myfancypants"><i className="icon icon-github"></i></a></div>
              <p>Some say his beard holds the power to control minds, some people don&#8217;t remember much anymore.</p>
            </div>
          </div>
          <h2 className="margin-top">Tech stack</h2>
          <hr />
          <div className="grid">
            <div className="bloc bloc-s-1">
              <h3 className="margin-top">Front end</h3>
              <ul>
                <li><a href="http://facebook.github.io/react/">React</a> / <a href="http://facebook.github.io/flux/">Flux</a></li>
                <li><a href="http://webpack.github.io/">Webpack</a></li>
                <li><a href="http://sass-lang.com/">SASS</a> / <a href="http://compass-style.org/">Compass</a></li>
              </ul>
            </div>
            <div className="bloc bloc-s-1">
              <h3 className="margin-top">Data-vizualisation</h3>
              <ul>
                <li><a href="http://d3js.org/">D3</a></li>
                <li><a href="http://leafletjs.com/">Leaflet</a></li>
              </ul>
            </div>
            <div className="bloc bloc-s-1">
              <h3 className="margin-top">Machine learning</h3>
              <ul>
                <li>Vanilla javascript calculating <a href="https://en.wikipedia.org/wiki/Polynomial_regression">non-parametric polynomial regresion</a></li>
              </ul>
            </div>
            <div className="bloc bloc-s-1">
              <h3 className="margin-top">Back end, databases</h3>
              <ul>
                <li><a href="https://nodejs.org/">Node</a> / <a href="http://expressjs.com/">Express</a></li>
                <li><a href="https://www.elastic.co/products/elasticsearch">Elastic search</a></li>
                <li><a href="http://redis.io/">Redis</a></li>
              </ul>
            </div>
            <div className="bloc bloc-s-1">
              <h3 className="margin-top">Automations and deployment</h3>
              <ul>
                <li><a href="https://www.heroku.com/">Heroku</a></li>
                <li><a href="http://gulpjs.com/">Gulp</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  },

});

module.exports = About;