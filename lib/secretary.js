
var _ = require('lodash-node');
var low = require('lowdb');
var fs = require('fs');
var clc = require('cli-color');

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
    throw "Please seed your DB before hounding."
  }

  //
  // Loop over all results, added them to the DB.
  //
  _.each(payload.results, function(result){
    var item = self.db('results').find({ id: result.id })

    if (!item.value()) {
      self.db('results').push(result)
      self.email(result)
    }

  });

};

Secretary.prototype.email = function(result) {
  if (this.options.seed) {
    console.log(clc.green('Adding:', result.title, result.link));
  } else {
    console.log(clc.green.bold('Hit!', result.title, result.link));
  }

}

module.exports = Secretary;
