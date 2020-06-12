'use strict';

const http = require('http');
const Heap = require('heap');

const customPriorityComparator = (a, b) => a.connCount - b.connCount;
const priorityQueue = new Heap(customPriorityComparator);

const checkHealth = serversPool => setInterval(
  () => {
    for (const server of serversPool) {
      (async () => {
        const serverUrl = new URL('/health', `http://${server.url}`);
        http.get(serverUrl, resp => {
          let data = '';
          resp.on('data', chunk => {
            data += chunk;
          });
          resp.on('end', () => {
            console.log(data);
            if (resp.statusCode !== 200)
              server.healthy = false;
            else if (!server.healthy) {
              server.healthy = true;
              priorityQueue.push(server);
            }
          });
        }).on('error', err => {
          console.log('Error: ' + err.message);
        });
      })();
    }
  }, 5 * 1000);

const min = pq => {
  let server = pq.peek();
  if (!server) {
    console.log('No servers left in heap!!!');
  } else if (!server.healthy) {
    pq.pop();
    server = min(pq);
  }
  return server;
};

const redirectRequest = (req, res) => {
  const bestServer = min(priorityQueue);
  if (bestServer !== undefined) {
    req.url = bestServer.url;
    bestServer.connCount += 1;
    priorityQueue.updateItem(bestServer);
    console.log(req.url);
    http.request(
      req, resp => {
        let data = '';
        resp.on('data', chunk => {
          data += chunk;
        });
        resp.on('end', () => {
          res = JSON.parse(data);
          console.log(res.statusCode);
        });
      }).on('error', err => {
      console.log('Error: ' + err.message);
    });
    bestServer.connCount -= 1;
    priorityQueue.updateItem(bestServer);
  } else {
    res.statusCode = 500;
    res.end('Internal Server Error 500');
  }
};

const listener = (req, res) => {
  redirectRequest(req, res);
  console.log('Response: ', res.statusCode);
};

class LoadBalancer {
  constructor(config) {
    this.config = config;
    this.serversPool = config.serversPool;
    this.instance = http.createServer(listener);
    for (const server of this.serversPool) {
      priorityQueue.push(server);
    }
  }
  async init() {
    this.healthChecker = checkHealth(this.serversPool);
    this.instance.listen(this.config.port, this.config.host);
  }

  close() {
    clearInterval(this.healthChecker);
    this.instance.close();
  }
}

module.exports = LoadBalancer;
