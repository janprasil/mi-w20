import etag from 'etag';
import http from 'http';
import random from 'random-name';
import { Map, Record } from 'immutable';

const database = {
  customers: {
    id: 0,
    data: Map(),
    lastModified: new Date().getTime(),
  }
};

const Customer = Record({
  id: 0,
  name: 'asdqwe asdqwmke',
  orders: [],
}, 'customer');

const addCustomer = () => {
  database.customers.id += 1;
  const id = database.customers.id;
  const name = random();
  const orders = [];
  for(let i = 0; i < Math.ceil((Math.random() * 100) % 100); i += 1) {
    orders[i] = Math.ceil(Math.random() * 100000);
  }

  const customer = new Customer({ id, name, orders });

  database.customers.data = database.customers.data.set(id, customer);
  database.customers.lastModified = new Date();

  return customer;
};

const Methods = {
  GET: 1,
  POST: 2,
  PUT: 3,
  DELETE: 4,
};

const Conn = {
  req: null,
  res: null,
  hedares: null,
  method: null,
  url: null,
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
    getRouter(url, data);
    return;
  }
  if (method === Methods.POST) {
    postRouter(url, data);
    return;
  }
  Conn.res.statusCode = 404;
  Conn.res.end();
};

const getRouter = (url, data) => {
  switch (url) {
    case '/customers/':
      getCustomers(data);
      return;
    default:
      Conn.res.statusCode = 404;
      Conn.res.end();
  }
};

const postRouter = (url, data) => {
  switch (url) {
    case '/customers/':
      postCustomer(data);
      return;
    default:
      Conn.res.statusCode = 404;
      Conn.res.end();
  }
};

const getCustomers = (data) => {
  const responseBody = JSON.stringify(database.customers.data.toArray());
  const strongEtag = etag(responseBody);

  const dataForWeakEtag = database.customers.data.reduce((prev, cur) => {
    prev.push({ id: cur.id, name: cur.name });
    return prev;
  }, []);
  const weakEtag = etag(JSON.stringify(dataForWeakEtag), {
    weak: true,
  });

  Conn.res.statusCode = 200;
  Conn.res.setHeader('Content-Type', 'application/json');
  Conn.res.setHeader('Last-Modified', database.customers.lastModified);
  Conn.res.setHeader('etag', strongEtag);

  const ifNoneMatch = Conn.headers['if-none-match'];
  if (ifNoneMatch && ifNoneMatch === strongEtag) {
    Conn.res.statusCode = 304;
  }

  const ifModifiedSince = Conn.headers['if-modified-since'];
  console.log(new Date(ifModifiedSince).getTime(), database.customers.lastModified);
  if (ifModifiedSince && new Date(ifModifiedSince).getTime() > database.customers.lastModified) {
    Conn.res.statusCode = 304;
  }

  Conn.res.write(responseBody);
  Conn.res.end();
};

const postCustomer = (data) => {
  Conn.res.statusCode = 200;
  Conn.res.setHeader('Content-Type', 'application/json');

  Conn.res.write(JSON.stringify(addCustomer().toJS()));
  Conn.res.end();
};

server.listen(8080, function() {
  console.log('server started on http://localhost:8080');
});
