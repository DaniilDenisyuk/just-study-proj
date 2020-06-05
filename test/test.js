'use strict';
const assert = require('assert').strict;
const LoadBalancer = require('../lib/loadBalancer');
const Server = require('../lib/server');
const Config = require('../lib/config');

(async () => {
  const cnf = await new Config('../config');
  const lb = new LoadBalancer(cnf.sections.loadBalancer);
  const server1 = new Server(1, cnf);
  const server2 = new Server(2, cnf);
  const server3 = new Server(3, cnf);
  console.dir(cnf.sections);
})();
//console.dir(cnf.sections);

