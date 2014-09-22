
var _ = require('lodash-node');
var low = require('lowdb');
var fs = require('fs');
var clc = require('cli-color');
var mailer = require('../lib/mailer');


function Secretary(options){
  this.options = options || {};
  var dbPath  = options.database;

  try {
    this.db = low(dbPath);
  } catch(e) {
    fs.writeFileSync(dbPath, JSON.stringify({}))
    this.db = low(dbPath);
  }
}

Secretary.prototype.listen = function(badger, options) {
  badger.on('data_received', this.curate.bind(this))
}

Secretary.prototype.curate = function(payload) {
  var self = this;
  console.log(clc.yellow("** Found", payload.results.length, 'for', payload.host));

  //
  // Seed the DB for this domain if not seeded.
  //
  if ( this.db('results').size() < 1 && !this.options.seed ) {
    throw "** Your DB appears to be empty. Please seed your DB before scouting craigslist."
  }

  //
  // Loop over all results, adding them them to the DB, or emailing.
  //
  _.each(payload.results, function(result){
    var item = self.db('results').find({ id: result.id })

    if (!item.value()) {
      self.db('results').push(result)
      self.handleResult(result)
    }

  });

};

Secretary.prototype.handleResult = function(result) {
  if (this.options.seed) {
    console.log(clc.green('** Adding:', result.title, result.url));
  } else {
    console.log(clc.green.bold('** Hit!', new Date().toString(), result.title, result.url));
    mailer.mail({ result: result, recipients: this.options.recipients, sender: this.options.sender })
  }

}

module.exports = Secretary;
