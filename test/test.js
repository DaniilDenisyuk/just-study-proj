'use strict';
const assert = require('assert').strict;
const LoadBalancer = require('../lib/loadBalancer');
const http = require('http');
const Server = require('../lib/server');
const Config = require('../lib/config');

(async () => {
  const cnf = await new Config('../config');
  const lb = new LoadBalancer(cnf.sections.loadBalancer);
  const server1 = new Server(1, cnf);
  const server2 = new Server(2, cnf);
  const server3 = new Server(3, cnf);
  const serverUrl = new URL('/api/authors', 'http://127.0.0.1:8082');
  http.get(serverUrl, resp => {
    let data = '';
    resp.on('data', chunk => {
      data += chunk;
    });
    resp.on('end', () => {
      console.log(data);
    });
  }).on('error', err => {
    console.log('Error: ' + err.message);
  });
})();
//console.dir(cnf.sections);

