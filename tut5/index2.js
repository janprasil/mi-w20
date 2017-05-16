import http from 'http';
import fs from 'fs';

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

const postMessages = (url, data) => {
  messages.push(JSON.parse(data).message);
  Conn.res.statusCode = 200;
  Conn.res.end();
};

const getMessages = (url, data) => {
  requests.push({
    res: Conn.res,
    time: new Date().getTime(),
    body: [],
  });
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
    router(Methods[method], url, Conn.body);
  });
});

const router = (method, url, data) => {
  if (method === Methods.GET && url === '/messages/') {
    getMessages(url, data);
    return;
  }
  if (method === Methods.POST && url === '/messages/') {
    postMessages(url, data);
    return;
  }
  fs.readFile('./tut5/index.html', (err, html) => {
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

server.listen(8080, function() {
  console.log('server started on http://localhost:8080');
});

const messageWatcher = () => {

  var expiration = new Date().getTime() - 10000;
  requests.forEach(cur => {
    const req = requests.pop();
    const res = req.res;

    for (let i = 0; i < messages.length; i+=1) {
      const message = messages.pop();
      req.body.push({ message });
    }

    if (expiration > cur.time) {
      requests.push(req);
    } else {
      res.writeHeader(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(req.body));
      res.end();
    }

    return;
  });


};

setInterval(messageWatcher, 2000);
