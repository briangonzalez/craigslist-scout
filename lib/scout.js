
var _ = require('lodash-node');
var fs = require('fs');
var clc = require('cli-color');
var jsdom = require('jsdom');
var jquery = fs.readFileSync('./vendor/jquery.js', "utf-8");

var EventEmitter = require('events').EventEmitter;

function Scout(options){}

Scout.prototype = new EventEmitter();
Scout.prototype.start = function(options) {

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

              var $el, id, img, $a, url;
              var results = _.map( window.$("p[data-pid]"), function(el){
                $el = $(el);
                id = $el.attr('data-pid');
                img = $el.find('img').attr('src');
                $a = $el.find('a.hdrlnk');
                url = $a.get(0).href;

                return { title: $el.text(), id : id, url: url, img: img };
              });

              self.emit('data_received', { results: results, count: results.length, host: window.location.host });
              window.close();
            } else {
              console.log(clc.red('** Error while requesting:', url));
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

module.exports = new Scout();
