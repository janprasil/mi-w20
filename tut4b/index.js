import http from 'http';
const url = require('url');

export const Methods = {
  GET: 1,
  POST: 2,
  PUT: 3,
  DELETE: 4,
  OPTIONS: 5,
};

export const Conn = {
  req: null,
  res: null,
  hedares: null,
  method: null,
  url: null,
};

const users = [
  { name: 'Honza' },
  { name: 'Pepa' },
  { name: 'Jirka' },
  { name: 'Karel' },
  { name: 'Vratislav' },
  { name: 'Kuba' },
  { name: 'Oldřich' },
];

export const getMethod = (uri, data) => {
  Conn.res.statusCode = 200;
  Conn.res.setHeader('Content-Type', 'application/json');
  Conn.res.setHeader('Access-Control-Allow-Origin', '*');

  const urlParts = url.parse(uri, true);
  const query = urlParts.query;

  const cb = query.cb;
  if (cb) {
    Conn.res.write(`${cb}(${JSON.stringify(users)})`);
  } else {
    Conn.res.write(JSON.stringify(users));
  }

  Conn.res.end();
};


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
    router(Methods[method], url, body);
  });
});

const router = (method, url, data) => {
  if (method === Methods.GET) {
    getMethod(url, data);
    return;
  }
  Conn.res.statusCode = 404;
  Conn.res.end();
};

server.listen(8000, function() {
  console.log('server started on http://localhost:8080');
});
