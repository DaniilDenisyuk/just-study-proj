({
  host: '127.0.0.1',
  port: 8080,
  serversPool: [
    { url: '127.0.0.1:8081', healthy: true, connCount: 0 },
    { url: '127.0.0.1:8082', healthy: true, connCount: 0 },
    { url: '127.0.0.1:8083', healthy: true, connCount: 0 }
  ]
});
