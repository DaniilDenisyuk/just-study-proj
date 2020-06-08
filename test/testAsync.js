/* eslint-disable object-shorthand */
const restApi = {
  db: { query: () => { console.log('querying'); } },
  routing: {
    'post': function() { console.log(this); },
    'get': db => () => { db.query(); },
    'put': () => { this.db.query(); },
    'delete': () => { this.db.query(); }
  }
};

const server = {
  api: restApi,
};
server.api.routing['get'](restApi.db)();
