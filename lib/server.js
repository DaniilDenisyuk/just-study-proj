'use strict';
//:todo param and query parsing, segregate api in separate files
const http = require('http');
const url = require('url');
const Config = require('./config');
const Database = require('./database');

const API_PATH = '/api';
const HEALTH_PATH = '/health';

const GetAPI = {
  '/': this['/books/'],
  '/authors': async (limit = 15) => {

  },
  '/authors/id': () => {},
  '/books/': () => {},
  '/books/id': () => {},
  '/publishers': () => {},
  '/publishers/id': () => {}
};

const PostAPI = {
  '/books/add': () => {}
};

const PutAPI = {
  '/books/id/modify': () => {},
  '/authors/id/modify': () => {},
  '/publishers/id/modify': () => {}
};

const DeleteAPI = {};

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
  const { method, url, connection } = req;
  if (url.startsWith(API_PATH)) {
    const apiMethod = url.substring(API_PATH.length);
    let handler;
    switch (method) {
    case 'GET': {
      handler = GetAPI[apiMethod];
      break;
    }
    case 'POST': {
      handler = PostAPI[apiMethod];
      break;
    }
    case 'PUT': {
      handler = PutAPI[apiMethod];
      break;
    }
    case 'DELETE': {
      handler = DeleteAPI[apiMethod];
      break;
    }
    default: break;
    }
    if (handler) {
      const args = await receiveArgs(req);
      try {
        const result = await method(...args);
        if (!result) {
          httpError(res, 500, 'Internal server error');
          return;
        }
        res.end(JSON.stringify(result));
      } catch (err) {
        console.dir({ err });
        httpError(res, 501, 'Not implemented');
      }
    }
  } else if (url.startsWith(HEALTH_PATH)) {
    res.end(req);
  } else httpError(res, 501, 'Not implemented');
};

class Server {
  constructor(id) {
    this.db = new Database();
    const port = ports.length > id ? ports[id - 1] : 8080 + id;
    this.ports = config.ports.slice(1);
    const transport = threadId === 1 ? http : https;
    this.instance = transport.createServer({ ...application.cert }, listener);
    this.instance.listen(port, host);
  }

  async close() {
    this.instance.close(err => {});
  }
}

module.exports = Server;
