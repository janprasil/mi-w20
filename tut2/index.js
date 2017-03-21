import http from 'http';
import express from 'express';
import { Map, Record } from 'immutable';
import book from './book';

export const Book = Record({
  id: '',
  name: '',
  author: '',
  year: '',
  description: '',
  publisher: '',
  country: '',
  language: '',
}, 'book');

export const Storage = {
  books: Map(),
  booksId: 0,
};

export const Status = {
  ok: 201,
  notFound: 404,
  serverError: 500,
};


const init = async (req, res, next) => {
  res.status(404).send({ error: 'This page does not exist' });
};


const app = express();

app.get('/', init);
app.use(book);

app.listen(8080, () => {
  console.log(`Server started at http://localhost:8080`);
});
