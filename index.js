#!/usr/bin/env node

var program = require('commander');
var app = require('./package.json');
var urlBuilder = require('./lib/url-builder');
var hound = require('./lib/cl-hound');
var Secretary = require('./lib/secretary');

program
  .version( app.version )
  .usage('[options]')
  .option('-c, --cities [type]',              'Comma delimited list of cities (corresponds to craigslist subdomains)', 'losangeles,fresno')
  .option('-q, --query [type]',               'Search query: https://slo.craigslist.org/search/<<search query>>',
                                              'cto?maxAsk=10000&query=tacoma%20prerunner&sort=rel')
  .option('-i, --interval [type]',            'Query every "n" minutes', 1)
  .option('-s, --sender [type]',              'Sender credentials', 'bar@gmail.com:123456')
  .option('-r, --recipients [type]',          'Comma delimited list of recipients', 'bar@gmail.com')
  .option('-d, --database [type]',            'LowDB database to store results in', 'db.json')
  .option('-e, --seed',                       'Seed your DB before beginning.')
  .parse(process.argv);

//
// 1. Get URLs for all cities.
// 2. Start ping the URLs
// 3. Save URLs to DB via secretary.
//
var urls = urlBuilder.getURLs(program.cities, program.query);

var secretary = new Secretary({
    database: program.database,
    sender: program.sender,
    seed: program.seed
  });

secretary.listen(hound);

hound.start({ urls: urls, interval: program.interval, seed: program.seed })
