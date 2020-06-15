'use strict';
const http = require('http');
const path = require('path');
const Url = require('url');
const fs = require('fs');

const apiFolder = '../api';
const API_PATH = 'api';
const HEALTH_PATH = 'health';

const defaultQuery = {
  sort: null,
  offset: null,
  limit: 15
};

const receiveArgs = async req => new Promise(resolve => {
  const body = [];
  req.on('data', chunk => {
    body.push(chunk);
  }).on('end', async () => {
    const data = body.join('');
    if (!data) {
      resolve(null);
      return;
    }
    const args = JSON.parse(data);
    resolve(args);
  });
});

const checkQuery = query => {
  if (!query) {
    query = defaultQuery;
    return query;
  }
  for (const key of Object.keys(defaultQuery)) {
    if (!query.key) {
      query.key = defaultQuery.key;
    }
  }
  return query;
};

const parseRequest = async req => {
  const result = {
    method: null,
    path: null,
    route: null,
    parameter: null,
    option: null,
    query: null,
    bodyData: null
  };
  result.method = req.method;
  const { pathname, query } = Url.parse(req.url, true);
  result.query = checkQuery(query);
  // eslint-disable-next-line max-len
  [result.path, result.route, result.parameter, result.option] = pathname.substring(1).split('/');
  result.bodyData = await receiveArgs(req);
  return result;
};

const httpError = (res, status, message) => {
  res.statusCode = status;
  res.end(`"${message}"`);
};

//http://127.0.0.1:8081/path=api/route=books/parameter=:id/option=column|query=?sort=-published
async function listener(req, res) {
  // eslint-disable-next-line max-len
  const { method, path, route, parameter, option, query, bodyData } = await parseRequest(req);
  if (path === API_PATH) {
    const handler = this[method.toLowerCase()].get(route).bind(this);
    if (handler) {
      try {
        const result = await handler(parameter, option, query, bodyData);
        res.end(JSON.stringify(result));
      } catch (err) {
        console.log(err.toString());
        httpError(res, 500, 'Internal server error');
      }
    } else httpError(res, 501, 'Not implemented');
  } else if (path === HEALTH_PATH) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`server ${req.rawHeaders[1]} is ok`);
  } else httpError(res, 501, 'Not implemented');
}

class Server {
  constructor(dbPool) {
    this.get = new Map();
    this.post = new Map();
    this.put = new Map();
    this.delete = new Map();
    this.db = dbPool;
    this.instance = http.createServer(listener.bind(this));
  }

  async init(port, callback) {
    await this.loadFolder(apiFolder);
    this.instance.listen(port, callback);
  }

  async loadFile(filePath) {
    const [field, file] = filePath.split('/').slice(-2);
    const { name, ext } = path.parse(file);
    if (ext !== '.js' || name.startsWith('.')) {
      return;
    }
    try {
      const func = require(filePath);
      this[field].set(name, func);
    } catch (e) {
      console.log(e);
      this[field].delete(name);
    }
  }

  async loadFolder(folderPath) {
    await fs.readdir(folderPath, async (err, files) => {
      if (err) {
        console.log(err.toString());
        return;
      }
      await Promise.all(files.map(
        async file => {
          const filePath = path.join(folderPath, file);
          if (fs.statSync(filePath).isDirectory()) {
            await this.loadFolder(filePath);
          } else {
            await this.loadFile(filePath);
          }
        }
      ));
      fs.watch(folderPath, (event, fileName) => {
        const filePath = path.join(folderPath, fileName);
        this.loadFile(filePath);
      });
    });
  }

  close() {
    this.instance.close(err => {
      console.dir(err);
    });
  }
}

module.exports = Server;
