import bodyParser from 'body-parser';
import express from 'express';
import { Map } from 'immutable';
import { Status, baseUrl } from './index';

const storage = {
  confirms: Map(),
  second: Map(),
};

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const putCustomer = async (req, res) => {
  const id = parseInt(req.params['0'], 10);
  storage.confirms = storage.confirms.set(id, true);

  res.setHeader('Location', `/customer/${id}`);
  res.status(Status.ok).send({ id });
};

const deleteCustomer = async (req, res) => {
  const id = parseInt(req.params['0'], 10);
  storage.confirms = storage.confirms.set(id, false);

  const result = await checkForConfirmation(0, id);

  if (result) {
    res.status(Status.ok).send({ id });
  } else {
    res.status(Status.badRequest).send({ id });
  }
};

const maxCount = 10;
const timeToWait = 500;

const delay = (ms) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(ms), ms);
  });
}

const checkForConfirmation = async (count, id) => {
  await delay(timeToWait);

  const confirmed = storage.confirms.get(id);

  if (confirmed) return true;
  if (count > maxCount) return false;

  return await checkForConfirmation(count + 1, id);
};

const deleteCustomerFirst = async (req, res) => {
  const id = parseInt(req.params['0'], 10);
  storage.second = storage.second.set(id, true);

  res.status(Status.ok).send({
    id,
    '_links': [
      { href: `${baseUrl}/customer/second/${id}`, rel: 'DELETE_confirm' }
    ],
  });
};

const deleteCustomerSecond = async (req, res) => {
  const id = parseInt(req.params['0'], 10);
  const isWaiting = storage.second.get(id);

  if (isWaiting) {
    storage.second = storage.second.set(id, false);
    res.status(Status.ok).send({ id });
  } else {
    res.status(Status.badRequest).send({ id });
  }
};


app.delete('/customer/first/*', deleteCustomerFirst);
app.delete('/customer/second/*', deleteCustomerSecond);

app.put('/customer/*', putCustomer);
app.delete('/customer/*', deleteCustomer);

export default app;
