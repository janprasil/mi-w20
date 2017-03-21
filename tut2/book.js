import bodyParser from 'body-parser';
import express from 'express';
import { Storage, Status, Book } from './index';

const app = express();

const getBooks = async (req, res) => {
  console.log('GETTING BOOKS');
  res.status(Status.ok).send(
    Storage.books.toArray()
  );
};

const postBook = async (req, res) => {
  console.log('POST BOOKS');
  if (!req.body) return res.status(Status.serverError).send('');
  req.body.id = ++Storage.booksId;

  const book = new Book(req.body);
  Storage.books = Storage.books.set(book.id, book);

  res.setHeader('Location', `/book/${book.id}`);
  res.
    status(Status.ok).
    send(book);
};

const putBooks = async (req, res) => {
  console.log('PUT BOOKS');
  if (req.body === []) {
    Storage.books = Storage.books.clear();
    return res.status(Status.ok).send([]);
  }
  res.status(Status.notFound).send('');
};

const putBook = async (req, res) => {
  console.log('PUT BOOKS');
  if (!req.body) return res.status(Status.serverError).send('');

  const id = parseInt(req.params['0'], 10);

  if (!Storage.books.get(id)) {
    return res.status(Status.notFound).send({});
  }

  req.body.id = id;
  const book = new Book(req.body);
  Storage.books = Storage.books.set(id, book);

  res.status(Status.ok).send(book);
};

const getBook = async (req, res) => {
  console.log('GET BOOK');
  const id = parseInt(req.params['0'], 10);
  const book = Storage.books.get(id);

  if (!book) {
    return res.status(Status.notFound).send({});
  }

  res.status(Status.ok).send(book);
};

const deleteBook = async (req, res) => {
  console.log('DELETE BOOK');
  const id = parseInt(req.params['0'], 10);
  const book = Storage.books.get(id);
  if (!book) {
    return res.status(Status.notFound).send({});
  }

  Storage.books = Storage.books.delete(id);

  res.status(Status.ok).send(book);
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/book', getBooks);
app.post('/book', postBook);
app.put('/book', putBooks);

app.get('/book/*', getBook);
app.put('/book/*', putBook);
app.delete('/book/*', deleteBook);

export default app;
