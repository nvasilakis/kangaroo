Kangaroo
======

A node template for quick scaffolding!

It comes bundled with the following functionality:
* visually-appealing template with menu/search/edit profile
* register, login, logout functionality
* preferences/email
* simple key-value DB connection

## Setup

Make sure you have the requirements: npm 1.4+, node 0.11+. Then,

```
git clone git@github.com:nvasilakis/temple.git
cd temple && ./trymenode
```

or 

`curl n.vasilak.is/trymenode | bash`

## TODO

* Need auth. email for bots
* __Urgent__: need to change `email` to `id` wherever needed
* Fix script
* html header (keywords, favicon etc.)
* ~~allow node to render headers, footers, menus~~ Done!
* Add support for http://twitter.github.io/typeahead.js/examples/

## More
* Key-Value stores http://kkovacs.eu/cassandra-vs-mongodb-vs-couchdb-vs-redis
* Hyperdex: http://hyperdex.org/doc/latest/
* Simple JS stores: https://nodejsmodules.org/tags/key-value
* MongoDB seems to pay back when dataset becomes huge (also: http://oldblog.antirez.com/post/MongoDB-and-Redis.html)
* http://www.scotchmedia.com/tutorials/express/authentication/1/01
