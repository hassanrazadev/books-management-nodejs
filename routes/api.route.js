const express = require('express');
const isAuthenticated = require('../middlewares/auth.middleware')

const publicRouter = express.Router(),
      privateRouter = express.Router();

const BookController = require('../controllers/book.controller');

/**
 * private / Protected routes
 */
privateRouter.use(isAuthenticated);
privateRouter.post('/books', BookController.uploadBookImage, BookController.create);
privateRouter.put('/books/:id', BookController.uploadBookImage, BookController.update)
privateRouter.delete('/books/:id', BookController.delete)

/**
 * Public / unprotected routes
 */
publicRouter.get('/books', BookController.index);
publicRouter.get('/books/:id', BookController.getById);

module.exports = {
    publicRouter, privateRouter
};