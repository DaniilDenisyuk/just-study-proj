'use strict';
const http = require('http');
const { Pool } = require('pg');
const path = require('path');
const Url = require('url');
const fs = require('fs');
const Config = require('./config');
const API_PATH = 'api';
const HEALTH_PATH = 'health';

let config, pool;
(async () => {
  config = await new Config('../config');
  pool = new Pool(config.sections.database);
}
)();

const receiveArgs = async req => new Promise(resolve => {
  const body = [];
  req.on('data', chunk => {
    body.push(chunk);
  }).on('end', async () => {
    const data = body.join('');
    const args = JSON.parse(data);
    resolve(args);
  });
});

const httpError = (res, status, message) => {
  res.statusCode = status;
  res.end(`"${message}"`);
};

const listener = async (req, res) => {
  const { method, url } = req;
  const [first, second] = url.substring(1).split('/');
  if (first === API_PATH) {
    const handler = api[method].get(second);
    if (handler) {
      let args;
      if (method !== 'POST') {
        const query = Url.parse(url).query;
        if (query) {
          const { offset, limit } = query;
          const param = url.substring((first + second).length).split('?')[0];
          args = [param, offset, limit];
        }
      } else args = await receiveArgs(req);
      try {
        const result = await handler(pool);
        res.end(JSON.stringify(result));
      } catch (err) {
        console.dir({ err });
        httpError(res, 500, 'Internal server error');
      }
    } else httpError(res, 501, 'Not implemented');
  } else if (first === HEALTH_PATH) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`server ${req.rawHeaders[1]} is ok`);
  } else httpError(res, 501, 'Not implemented');
};

class Server {
  constructor(id) {
    const port = config.sections.server.ports[id - 1];
    this.instance = http.createServer(listener);
    this.instance.listen(port, config.sections.server.host);
  }

  close() {
    this.instance.close(err => {
      console.dir(err);
    });
  }
}

module.exports = Server;
