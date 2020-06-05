'use strict';
const http = require('http');
const { Pool } = require('pg');
const Config = require('./config');
const path = require('path');
const fs = require('fs');
//const Database = require('./database');
//const db = new Database(Config.sections.database);

const API_PATH = 'api';
const HEALTH_PATH = 'health';
const apiPath = '../api';

const api = {
  'GET': new Map(),
  'POST': new Map(),
  'PUT': new Map(),
  'DELETE': new Map()
};

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

const cacheFile = name => {
  const filePath = apiPath + name;
  const key = path.basename(filePath, '.js');
  try {
    const libPath = require.resolve(filePath);
    delete require.cache[libPath];
  } catch (e) {
    return;
  }
  try {
    const method = require(filePath);
    api.set(key, method);
  } catch (e) {
    api.delete(key);
  }
};

const cacheFolder = path => {
  fs.readdir(path, (err, files) => {
    if (err) return;
    files.forEach(cacheFile);
  });
};

const watch = path => {
  fs.watch(path, (event, file) => {
    cacheFile(file);
  });
};

cacheFolder(apiPath);
watch(apiPath);

setTimeout(() => {
  console.dir({ api });
}, 1000);


const listener = async (req, res) => {
  const { method, url } = req;
  const [first, second] = url.substring(1).split('/');
  if (first === API_PATH) {
    const handler = api[method].get(second);
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
    } else httpError(res, 501, 'Not implemented');
  } else if (first === HEALTH_PATH) {
    res.end(req);
  } else httpError(res, 501, 'Not implemented');
};

class Server {
  constructor(id) {
    this.config = new Config('../config');
    this.pool = new Pool(this.config.sections.database);
    const port = 8080 + id;
    const host = '127:0:0:1';
    this.instance = http.createServer(listener);
    this.instance.listen(port, host);
  }

  close() {
    this.instance.close(err => {
      console.dir(err);
    });
  }
}

module.exports = Server;
