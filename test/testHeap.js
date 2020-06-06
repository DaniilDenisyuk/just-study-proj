'use strict';
const Heap = require('heap');
const assert = require('assert');

const customPriorityComparator = (a, b) => a.connCount - b.connCount;
const priorityQueue = new Heap(customPriorityComparator);

const serversPool = [
  { url: '127.0.0.1:8081', healthy: true, connCount: 10 },
  { url: '127.0.0.1:8082', healthy: true, connCount: 11 },
  { url: '127.0.0.1:8083', healthy: true, connCount: 9 }
];

const min = pq => {
  let server = pq.peek();
  if (!server) {
    console.log('No servers left in heap!!!');
    return undefined;
  } else if (!server.healthy) {
    pq.pop();
    server = min(pq);
  }
  return server;
};

for (const server of serversPool) {
  priorityQueue.push(server);
}

let minServer = min(priorityQueue);
assert(minServer.connCount === 9);
minServer.connCount += 3;
priorityQueue.updateItem(minServer);

minServer = min(priorityQueue);
assert(minServer.connCount === 10);
minServer.connCount += 3;
priorityQueue.updateItem(minServer);
serversPool[1].healthy = false;
//suppose server stop responding (current conn [13-healthy 10-not 12-healthy])
minServer = min(priorityQueue);
assert(minServer.connCount === 12);
assert(priorityQueue.nodes.length === 2);
