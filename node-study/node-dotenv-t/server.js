// require('dotenv').config()
require('dotenv-flow').config();

const http = require('http');

const hostname = '0.0.0.0';
const port = 5678;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(`${process.env.DB_HOST}`);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
