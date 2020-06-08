'use strict';

const fs = require('fs');
const path = require('path');
const apiPath = '../api';

const cacheFile = storage => (name, method) => {
  const filePath = path.join(apiPath, method, name);
  const key = path.basename(filePath, '.js');
  try {
    const libPath = require.resolve(filePath);
    delete require.cache[libPath];
  } catch (e) {
    return;
  }
  try {
    const handler = require(filePath);
    storage[method].set(key, handler);
  } catch (e) {
    storage[method].delete(key);
  }
};

// const watch = path => {
//   fs.watch(path, (event, file) => {
//     cacheFile(file);
//   });
// };

//watch(apiPath);

class RestApi {
  constructor(db) {
    this.db = db;
    this.routing = {};
    this.cacheApi().then(() => {
      console.log(this.routing);
    });
  }
  async cacheApi(apiPath) {
    const cacheApiFile = cacheFile(this.routing);
    await fs.readdir(apiPath, async (err, list) => {
      if (err) return;
      await Promise.all(list.map(async item => {
        const dir = path.resolve(apiPath, item);
        if (fs.statSync(dir).isDirectory()) {
          await fs.readdir(dir, async (err, files) => {
            if (err) return;
            await Promise.all(files.map(async file => {
              cacheApiFile(file, dir);
            }));
          });
        }
      }));
    });
  }
}
