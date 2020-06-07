'use strict';
const assert = require('assert').strict;
const LoadBalancer = require('../lib/loadBalancer');
const http = require('http');
const Server = require('../lib/server');
const Config = require('../lib/config');

(async () => {
  const cnf = await new Config('../config');
  const lb = new LoadBalancer(cnf.sections.loadBalancer);
  const server1 = new Server(1);
  const server2 = new Server(2);
  const server3 = new Server(3);
  const serverUrl = new URL('/api/authors', 'http://127.0.0.1:8082');
  const serverUrl2 = new URL('/api/books', 'http://127.0.0.1:8081');
  const serverUrl3 = new URL('/api/publishers', 'http://127.0.0.1:8083');
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
  http.get(serverUrl3, resp => {
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
  http.get(serverUrl2, resp => {
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

