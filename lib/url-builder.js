
var _ = require('lodash-node');
var util = require('util');

var baseUrl = 'http://%s.craigslist.org/search/%s'

module.exports = {

  getURLs: function(cities, query) {
    cities = cities.split(',');
    return _.map(cities, function(city){
      return util.format(baseUrl, city, query)
    });
  }

}
