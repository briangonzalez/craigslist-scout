craigslist-scout
----------------

A dead simple command line tool to query multiple Craigslist cities (subdomains) and email out new results.

Installation
------------

```shell
$ npm install craigslist-scout -g
```

Usage
-----

````
  Usage: cl-scout [options]

  Options:

    -c, --cities [type]       Comma delimited list of cities (corresponds to craigslist subdomains)
    -q, --query [type]        Search query: https://losangeles.craigslist.org/search/<<search query>>
    -i, --interval [type]     Query every "n" minutes
    -s, --sender [type]       Sender credentials in the form of sender@gmail.com:my_password; set to false to disable email
    -r, --recipients [items]  Comma delimited list of recipients
    -d, --database [type]     LowDB database to store results in
    -e, --seed                Seed your DB before scouting.
````

Example Query
-------------

To search Craigslist in LA, SLO, San Diego, Fresno, Bako, OC, Inland Empire, and Santa Barbara every 30 seconds for "tacoma" and send new results to `foo@bar.com` and `bar@baz.com` from `foo@baz.com`:

```bash
cl-scout  --interval 0.5 \
          --cities slo,losangeles,sandiego,fresno,bakersfield,orangecounty,inlandempire,santabarbara \
          --query "cto?maxAsk=10000&query=tacoma&sort=date" \
          --recipients "foo@bar.com,bar@baz.com" \
          --sender 'foo@baz.com:foobar'
```

Can't I achieve the same with IFTT?
-----------------------------------

IFTT uses Craigslist's RSS feed to check for new results, but the problem with that is that Craiglist's RSS feed only updates every hour. I found that I was missing items by 30 minutes, and someone else would snatch the item up.


## Author
| ![twitter/brianmgonzalez](http://gravatar.com/avatar/f6363fe1d9aadb1c3f07ba7867f0e854?s=70](http://twitter.com/brianmgonzalez "Follow @brianmgonzalez on Twitter") |
|---|
| [Brian Gonzalez](http://briangonzalez.org) |
