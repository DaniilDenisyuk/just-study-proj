const Server = require('../lib/server');
const Config = require('../lib/config');
const Database = require('../lib/database');

(async () => {
  const cnf = await new Config('../config');
  const db = new Database(cnf.sections.database);
  const lb = new LoadBalancer(cnf.sections.loadBalancer);
  const server1 = new Server(db).init(8081, () => console.log('server launched'));
  const server2 = new Server(db).init(8082, () => console.log('server launched'));
  const server3 = new Server(db).init(8083, () => console.log('server launched'));
  const serverUrl = new URL('/api/authors/2?sort=-published', 'http://127.0.0.1:8082');
  const serverUrl2 = new URL('/api/books/2', 'http://127.0.0.1:8081');
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

