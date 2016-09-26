roastr-container
================
A small dependency injection container for node and browsers.

[![Build Status](https://img.shields.io/travis/headzoo/roastr-container/master.svg?style=flat-square)](https://travis-ci.org/headzoo/roastr-container)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/headzoo/roastr-container/master/LICENSE)

[![NPM](https://nodei.co/npm/roastr-container.png)](https://nodei.co/npm/roastr-container)

### Installation

```sh
npm install --save roastr-container
```


### Getting Started
Most of the interaction with the container is through the set(),
factory(), and get() methods.

In *project/src/container.js*

```js
const Container = require('roastr-container');
let container   = new Container();

// Saves a static value in the container using the key 'config'.
container.set('config', {
    disablePoweredBy: true,
    port: 3000
});

// Saves a factory in the container using the key 'express'.
// Unlike the set() method, this method takes a function which will
// be called by the container to create the service. The function
// isn't called until the service is requested, and it's only called
// once. The value returned by the factory will then be cached in the
// container.
container.factory('express', function() {
    let express = require('express')();
    let config  = container.get('config');
    if (config.disablePoweredBy) {
        express.disable('x-powered-by');
    }
    
    return express;
});

// Saves a factory in the container using the key 'server'.
// Note these factory methods get values out of the container to
// construct themselves.
container.factory('server', function() {
    let express = container.get('express');
    return require('http').Server(express);
});

module.exports = container;
```

In *project/src/bootstrap.js*

```js
const container = require('./container');

// Now the container is wired-up, and we can use the values in our
// application.
let config = container.get('config');
let server = container.get('server');
server.listen(config.port, function() {
    console.log('Listening on port ' + config.port);
});
```


### Tagging Services
You may adds tags when saving a service in the container, and then
retrieve services from the container by tag.

```js
const Container = require('roastr-container');
let container   = new Container();

// The second argument here is a list of tags to be applied to the
// service. The second argument may be an array or string.
container.factory('body_parser', ['express.middleware'], function() {
    return require('body-parser').urlencoded({ extended: true })
});

container.factory('body_parser_json', ['express.middleware'], function() {
    return require('body-parser').json()
});

// Now we iterate over each service which has been tagged with
// express.middleware, and add the service to express.
container.factory('express', function() {
    let express = require('express')();
    container.tagged('express.middleware', function(middleware) {
        express.use(middleware);
    });
    
    return express;
});
```


### Expanding Properties
Objects stored in the container may be automatically expanded using the
container get() method and dot notation.

```js
const Container = require('roastr-container');
let container   = new Container();

container.set('config', {
    disablePoweredBy: true,
    port: 3000
});

// We can do this.
let config = container.get('config');
let port = config.port;

// Or we can do this.
let port = container.get('config.port');
```

### License
This project uses the MIT license. See LICENSE for more details.
