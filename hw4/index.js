import express from 'express';
import customer from './customer';

export const port = 8080;
export const baseUrl = `http://localhost:${port}`;
export const Status = {
  ok: 201,
  badRequest: 400,
  notFound: 404,
  serverError: 500,
};

const initRoute = async (req, res, next) => {
  res.status(404).send({ error: 'This page does not exist' });
};

const app = express();

app.get('/', initRoute);
app.use(customer);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
