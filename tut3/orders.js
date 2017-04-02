import bodyParser from 'body-parser';
import express from 'express';
import { Storage, Order, Item, Customer } from './storage';
import { Status, baseUrl } from './index';

const app = express();

const getOrders = async (req, res) => {
    const orders = Storage.orders.toArray().map(x => x.withLinks());
    if (!orders) {
        res.status(Status.s400).send({});
        return;
    }
    res.status(Status.s200).send({
        orders,
        '_links': [
            { href: `${baseUrl}/orders/`, rel: 'all' },
            { href: `${baseUrl}/orders/`, rel: 'post' },
        ]
    });
};

const postOrder = async (req, res) => {
  const key = req.query.key;
  console.log('KEY', key);
  if (!req.body) return res.status(Status.serverError).send('');
  const customer = Storage.customers.filter(x => x.apiKey === key).first();
  console.log('CUSTOMER', customer);
  if (!customer || !req.body.itemId) {
    res.status(Status.s400).send({});
    return;
  }

  req.body.id = ++Storage.orderIds;
  req.body.customerId = customer.id;
  const order = new Order(req.body);
  Storage.orders = Storage.orders.set(order.id, order);

  const result = {};
  result['_links'] = [{ href: `${baseUrl}/orders/${order.id}`, rel: 'get' }];

  res.setHeader('Location', `/orders/${order.id}`);
  res.status(Status.s201).send(result);
};

const getOrder = async (req, res) => {
  const id = parseInt(req.params['0'], 10);
  const order = Storage.orders.get(id);

  if (!order) {
    return res.status(Status.s400).send({});
  }

  res.status(Status.s200).send(order.withLinks());
};

const deleteOrder = async (req, res) => {
  const id = parseInt(req.params['0'], 10);
  const key = req.query.key;
  const customer = Storage.customers.filter(x => x.apiKey === key).first();

  const order = Storage.orders.get(id);

  if (!order || !customer || customer.id !== order.customerId) {
    return res.status(Status.s400).send({});
  }

  Storage.orders = Storage.orders.delete(id);
  res.status(Status.s200).send({ '_links': [ { href: `${baseUrl}/orders`, rel: 'all' } ] });
};


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/orders', getOrders);
app.post('/orders', postOrder);

app.get('/orders/*', getOrder);
app.delete('/orders/*', deleteOrder);

export default app;
