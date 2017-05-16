import http from 'http';
import fs from 'fs';
import WebSocket from 'ws';

const Methods = {
  GET: 1,
  POST: 2,
  PUT: 3,
  DELETE: 4,
  OPTIONS: 5,
};

const Conn = {
  req: null,
  res: null,
  hedares: null,
  method: null,
  url: null,
};

const messages = [];
let requests = [];

const server = http.createServer((req, res) => {
  const headers = req.headers;
  const method = req.method;
  const url = req.url;

  Conn.req = req;
  Conn.res = res;
  Conn.headers = headers;
  Conn.method = method;
  Conn.url = url;

  const body = [];

  req.on('data', chunk => {
    body.push(chunk);
  }).on('end', () => {
    Conn.body = body.join('');
    router(Methods[method], url, Conn.body);
  });
});

const router = (method, url, data) => {
  fs.readFile('./tut5/index2.html', (err, html) => {
    if (err) {
      Conn.res.statusCode = 404;
      Conn.res.end();
      return;
    }
    Conn.res.writeHeader(200, {'Content-Type': 'text/html'});
    Conn.res.write(html);
    Conn.res.end();
  });
}

const wss = new WebSocket.Server({ server });

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });
});

server.listen(8080, function() {
  console.log('server started on http://localhost:8080');
});
