var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: 'http://searchonly:ooc3id6jupw6e9u0ha@b856e0e6cb149c5f2876528086313183.us-east-1.aws.found.io:9200',
    //host: 'localhost:9200',
    log: 'trace'
  });

module.exports = client;