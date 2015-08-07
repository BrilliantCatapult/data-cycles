var elasticClient = require('../config/elasticsearch');

module.exports = {
  get: function (req, res, next) {
    elasticClient.search({
      index: 'bikeshare',
      type: 'station',
      body: {
                "fields": ["station_id", "name"],
                "query" : {
                    "matchAll" : {}
                },
                "size": 100
            }
      // type: 'testtype',
      // id: '3'
      //q: 'fare:'+date
    }).then(function (resp) {
      var hits = resp.hits.hits;
      //console.log(resp);
      res.json(hits);
    }, function (err) {
      res.json({"message": "oh no"})
      console.trace(err.message);
    });
  }
};