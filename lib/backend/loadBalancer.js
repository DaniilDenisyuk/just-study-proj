'use strict';

const http = require('http');
const Heap = require('heap');

const serversPool = [
  { url: '127.0.0.1:8080', healthy: true, connCount: 0 },
  { url: '127.0.0.1:8081', healthy: true, connCount: 0 },
  { url: '127.0.0.1:8082', healthy: true, connCount: 0 },
];

const customPriorityComparator = (a, b) => a[1].connCount - b[1].connCount;
const priorityQueue = new Heap(customPriorityComparator);

const healthChecker = serversPool => setInterval(
  async () => {
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

const redirectRequest = async (req, res) => {
  const bestServer = priorityQueue.peek();
  if (bestServer !== undefined) {
    req.url = bestServer.url;
    bestServer.connCount += 1;
    priorityQueue.heapify();
    res = http.request(req);
    await res;
    bestServer.connCount -= 1;
    priorityQueue.heapify();
  } else {
    res.statusCode = 500;
    res.end('Internal Server Error 500');
  }
};

(async () => {
  healthChecker();
  await priorityQueue.heapify(serversPool);
  http.createServer(async (req, res) => {
    await redirectRequest(req, res);
    console.log('Response: ', res);
  }).listen(8000);
})();
