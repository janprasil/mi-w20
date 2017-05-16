import http from 'http';
// import { getMethod, postMethod, deleteMethod, putMethod } from 'methods';

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

export const getMethod = (url, data) => {
  Conn.res.statusCode = 200;
  Conn.res.setHeader('Content-Type', 'application/json');
  Conn.res.setHeader('Access-Control-Allow-Origin', 'http://users.fit.cvut.cz');

  Conn.res.write(JSON.stringify({ hello: 'world' }));
  Conn.res.end();
};
export const postMethod = (url, data) => {
  Conn.res.statusCode = 200;
  Conn.res.setHeader('Content-Type', 'application/json');
  Conn.res.setHeader('Access-Control-Allow-Origin', 'http://users.fit.cvut.cz');
  Conn.res.setHeader('Access-Control-Allow-Methods', 'POST');
  Conn.res.setHeader('Access-Control-Allow-Headers', 'content-type');
  Conn.res.setHeader('Access-Control-Max-Age', '86400');

  Conn.res.write(JSON.stringify({ hello: 'world' }));
  Conn.res.end();
};

export const putMethod = (url, data) => {
  Conn.res.statusCode = 200;
  Conn.res.setHeader('Content-Type', 'application/json');
  Conn.res.setHeader('Access-Control-Allow-Origin', 'http://users.fit.cvut.cz');
  Conn.res.setHeader('Access-Control-Allow-Methods', 'PUT');
  Conn.res.setHeader('Access-Control-Allow-Headers', 'content-type');
  Conn.res.setHeader('Access-Control-Max-Age', '86400');

  Conn.res.write(JSON.stringify({ hello: 'world' }));
  Conn.res.end();
};

export const deleteMethod = (url, data) => {
  Conn.res.statusCode = 200;
  Conn.res.setHeader('Content-Type', 'application/json');
  Conn.res.setHeader('Access-Control-Allow-Origin', 'http://users.fit.cvut.cz');
  Conn.res.setHeader('Access-Control-Allow-Methods', 'DELETE');
  Conn.res.setHeader('Access-Control-Allow-Headers', 'content-type');
  Conn.res.setHeader('Access-Control-Max-Age', '86400');

  Conn.res.write(JSON.stringify({ hello: 'world' }));
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
  if (method === Methods.GET && url === '/get/') {
    getMethod(url, data);
    return;
  }
  if ((method === Methods.POST || method === Methods.OPTIONS) && url === '/post/') {
    postMethod(url, data);
    return;
  }
  if ((method === Methods.PUT || method === Methods.OPTIONS) && url === '/put/') {
    putMethod(url, data);
    return;
  }
  if ((method === Methods.DELETE || method === Methods.OPTIONS) && url === '/delete/') {
    deleteMethod(url, data);
    return;
  }
  Conn.res.statusCode = 404;
  Conn.res.end();
};

server.listen(8888, function() {
  console.log('server started on http://localhost:8080');
});
