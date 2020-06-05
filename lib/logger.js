'use strict';

const { fs, util, path } = require('./dependencies.js');

const COLORS = {
  info: '\x1b[1;37m',
  debug: '\x1b[1;33m',
  error: '\x1b[0;31m',
};

class Logger {
  constructor(logPath, threadId = 0) {
    this.path = logPath;
    const date = new Date().toISOString().substring(0, 10);
    const filePath = path.join(logPath, `${date}-W${threadId}.log`);
    this.stream = fs.createWriteStream(filePath, { flags: 'a' });
    this.regexp = new RegExp(path.dirname(this.path), 'g');
  }

  write(level = 'info', s) {
    const date = new Date().toISOString();
    const color = COLORS[level];
    const line = date + '\t' + s;
    console.log(color + line + '\x1b[0m');
    const out = line.replace(/[\n\r]\s*/g, '; ') + '\n';
    this.stream.write(out);
  }

  log(...args) {
    const msg = util.format(...args);
    this.write('info', msg);
  }

  dir(...args) {
    const msg = util.inspect(...args);
    this.write('info', msg);
  }

  debug(...args) {
    const msg = util.format(...args);
    this.write('debug', msg);
  }

  error(...args) {
    const msg = util.format(...args).replace(/[\n\r]{2,}/g, '\n');
    this.write('error', msg.replace(this.regexp  start() {
    const { interval } = application.resmon.config;
    setInterval(() => {
      const stats = application.resmon.getStatistics();
      const { heapTotal, heapUsed, external, contexts, detached } = stats;
      const total = application.utils.bytesToSize(heapTotal);
      const used = application.utils.bytesToSize(heapUsed);
      const ext = application.utils.bytesToSize(external);
      console.log(`Heap: ${used} of ${total}, ext: ${ext}`);
      console.log(`Contexts: ${contexts}, detached: ${detached}`);
    }, interval);
  }, ''));
  }
}

module.exports = Logger;
