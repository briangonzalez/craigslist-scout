
var _ = require('lodash-node');
var fs = require('fs');
var clc = require('cli-color');
var jsdom = require('jsdom');
var jquery = fs.readFileSync('./vendor/jquery.js', "utf-8");

var EventEmitter = require('events').EventEmitter;

function CLHound(options){}

CLHound.prototype = new EventEmitter();
CLHound.prototype.start = function(options) {

  var self = this;
  var interval = options.interval * 60 * 1000
  var start = interval;

  var request = function() {

    // Loop over all URLs and make a request.
    _.each(options.urls, function(url){
      console.log(clc.blue('** Request to:', url));

      jsdom.env({
          url: url,
          src: jquery,
          done: function (errors, window) {

            if ( !errors ) {
              var $ = window.$;

              var results = _.map( window.$(".hdrlnk"), function(el){
                var $el = $(el);
                return { title: $el.text(), link: el.href, id: $el.attr('data-id')  }
              });

              self.emit('data_received', { results: results, count: results.length, host: window.location.host });

            } else {
              console.log(clc.red('Error for:', url));
            }

          }

      });

    });

    // Increment and recurse.
    interval = interval + start;
    if (!options.seed) setTimeout(function(){ request(); }, interval)
  }

  // Kick it off.
  request();

};

module.exports = new CLHound();
