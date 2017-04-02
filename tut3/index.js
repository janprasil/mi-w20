import express from 'express';
import orders from './orders';

export const baseUrl = 'http://localhost:8080';
export const Status = {
  ok: 201,
  notFound: 404,
  serverError: 500,
  s200: 200,
  s400: 400,
  s201: 201,
};

const init = async (req, res, next) => {
  res.status(404).send({ error: 'This page does not exist' });
};

const app = express();

app.get('/', init);
app.use(orders);

app.listen(8080, () => {
  console.log(`Server started at http://localhost:8080`);
});
