#!/usr/bin/env node

var program = require('commander');
var app = require('./package.json');
var urlBuilder = require('./lib/url-builder');
var scout = require('./lib/scout');
var Secretary = require('./lib/secretary');

program
  .version( app.version )
  .usage('[options]')
  .option('-c, --cities [type]',              'Comma delimited list of cities (corresponds to craigslist subdomains)', 'losangeles,ventura')
  .option('-q, --query [type]',               'Search query: https://losangeles.craigslist.org/search/<<search query>>',
                                              'cto?maxAsk=10000&query=tacoma&sort=rel')
  .option('-i, --interval [type]',            'Query every "n" minutes', 1)
  .option('-s, --sender [type]',              'Sender credentials in the form of sender@gmail.com:my_password; set to false to disable email', 'false')
  .option('-r, --recipients [items]',         'Comma delimited list of recipients', 'bar@gmail.com,foo@baz.com')
  .option('-d, --database [type]',            'LowDB database to store results in', 'db.json')
  .option('-e, --seed',                       'Seed your DB before scouting.')
  .parse(process.argv);

//
// 1. Get URLs for all cities.
// 2. Start pinging the URLs
// 3. Save URLs to DB.
// 4. Email new results.
//
var urls = urlBuilder.getURLs(program.cities, program.query);

var secretary = new Secretary({
    database: program.database,
    seed: program.seed,
    recipients: program.recipients,
    sender: program.sender,
  });

secretary.listen(scout);

scout.start({ urls: urls, interval: program.interval, seed: program.seed })
