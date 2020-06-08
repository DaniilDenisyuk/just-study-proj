/* eslint-disable object-shorthand */
'use strict';
class api  {
  constructor() {
    this.routing = {
      'post': () => { console.log(this); },
      'get': () => { this.db.query(); },
      'put': () => { this.db.query(); },
      'delete': () => { this.db.query(); }
    };
  }
}
class server  {
  constructor() {
    this.db = { query: () => { console.log('querying'); } },
    this.api = new api();
  }
}

const serve1 = new server();
serve1.api.routing['post']();
serve1.api.routing['post']();
serve1.api.routing['put']();

