'use strict';

const http = require('http');
const Heap = require('heap');

const customPriorityComparator = (a, b) => a[1].connCount - b[1].connCount;

const checkHealth = serversPool => setInterval(
  () => {
    for (const [server, props] of Object.entries(serversPool)) {
      const healthy = http.request(
        { method: 'GET', url: `${props.connCount}/health`, timeout: 2000 },
        res => 200 <= res.statusCode < 300);
      if (!healthy) {
        serversPool[server].healthy = false;
      } else if (!serversPool[server].healthy) {
        serversPool[server].healthy = true;
      }
    }
  }, 10 * 1000);

const redirectRequest = (req, res) => {
  const bestServer = this.priorityQueue.peek();
  if (bestServer !== undefined) {
    req.url = bestServer.url;
    bestServer.connCount += 1;
    this.priorityQueue.heapify();
    res = http.request(req);
    bestServer.connCount -= 1;
    this.priorityQueue.heapify();
  } else {
    res.statusCode = 500;
    res.end('Internal Server Error 500');
  }
};

const listener = (req, res) => {
  redirectRequest(req, res);
  console.log('Response: ', res);
};

class LoadBalancer {
  constructor(config) {
    this.config = config;
    this.serversPool = config.serversPool;
    this.priorityQueue = new Heap(customPriorityComparator);
    this.instance = http.createServer(listener);
    this.priorityQueue.heapify(this.serversPool);
    this.healthChecker = checkHealth(this.serversPool);
    this.instance.listen(config.port, config.host);
  }
  close() {
    clearInterval(this.healthChecker);
    this.instance.close();
  }
}

module.exports = LoadBalancer;
