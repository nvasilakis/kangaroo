Kangaroo
======
#### A node.js template application for quick scaffolding!

It comes bundled with the following functionality:
* visually-appealing, cross-device template based on a modified bootstrap
* register, login, verification, lost password, user settings, homepage (_and more_) functionality
* user notifications and security logging (IP, changes) echoed to the backend (DB)
* Database abstraction (works with [redis](http://redis.io/), [mongo](http://www.mongodb.org/), [hyperdex](http://hyperdex.org/))

## Setup

### Dead-simple way
[Fork](https://github.com/nvasilakis/kangaroo/fork) the repository and run `./scripts/init --setup`. It will ask for
some info and make appropriate arrangements (name, theme, setup database etc.) for you.

### Terminal-easy
Fire up your terminal and run:
`curl n.vasilak.is/kinit | bash`

It will do all of the above behind the scenes, and give you a tiny bit
more control (e.g., allowing you to have multiple forks of the repo,
still in sync with upstream).

## Dependencies
All dependencies are shown if you run `./scripts/init --show-deps` at
top-level. In brief, they are node 0.11+, npm 1.4+, and [all packages
listed in package.json] (./package.json).

## License

(The MIT License)

Copyright (c) 2014 Nikos Vasilakis <nikos@vasilak.is>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## TODO
#### (notes et al.)

* bring variables to local scope 
* Need auth. email for bots
* __Urgent__: need to change `email` to `id` wherever needed
* Fix script
* html header (keywords, favicon etc.)
* ~~allow node to render headers, footers, menus~~ Done!
* Add support for http://twitter.github.io/typeahead.js/examples/
* notification text `We sent a verification email to nikos@vasilak.is.  Please follow the instructions in it.`
* prep i18n strings

#### More
* Key-Value stores http://kkovacs.eu/cassandra-vs-mongodb-vs-couchdb-vs-redis
* Hyperdex: http://hyperdex.org/doc/latest/
* Simple JS stores: https://nodejsmodules.org/tags/key-value
* MongoDB seems to pay back when dataset becomes huge (also: http://oldblog.antirez.com/post/MongoDB-and-Redis.html)
* http://www.scotchmedia.com/tutorials/express/authentication/1/01

