const Book = require('../models/Book');
const methods = require('../helpers/methods');
const fileUploader = require('../helpers/uploadFile');

exports.uploadBookImage = fileUploader
    .uploadFile('uploads/books', 1024 * 1024 * 5)
    .single('thumbnail');

/**
 * list all books
 * @param request
 * @param response
 * @param next
 */
exports.index = (request, response, next) => {
    Book.find((error, books) => {
        if (error) {
            response.status(500).send(
                methods.failResponse(error)
            )
        } else {
            response.status(200).send(
                methods.successResponse("Books", {
                    books: books
                })
            )
        }
    });
}

/**
 * existing book
 * @param request
 * @param response
 * @param next
 */
exports.getById = (request, response, next) => {
    Book.findById(request.params.id, (error, book) => {
        if (error) {
            response.status(404).send(
                methods.notFoundResponse()
            )
        } else {
            response.status(200).send(
                methods.successResponse("Book", {
                    book: book
                })
            )
        }
    })
}

/**
 * create new book
 * @param request
 * @param response
 * @param next
 */
exports.create = (request, response, next) => {
    let data = request.body;
    data.thumbnail = request.file.path;
    Book.create(data, (error, book) => {
        if (error) {
            response.status(500).send(
                methods.failResponse(error)
            )
        } else {
            response.status(200).send(
                methods.successResponse("New book added to collection", {
                    book: book
                })
            )
        }
    })
}

/**
 * update existing book
 * @param request
 * @param response
 * @param next
 */
exports.update = (request, response, next) => {
    let data = request.body;
    if (request.file) {
        data.thumbnail = request.file.path;
    }
    Book.findById(request.params.id, async (error, book) => {
        if (error) {
            response.status(404).send(
                methods.notFoundResponse(error.message)
            )
        } else {

            let bookOldThumbnail = null;

            book.bookName = data.bookName;
            book.authorName = data.authorName;
            book.publishDate = data.publishDate;
            if (data.thumbnail) {
                bookOldThumbnail = book.thumbnail
                book.thumbnail = data.thumbnail;
            }
            book.save((error, result) => {
                if (error) {
                    response.status(500).send(
                        methods.failResponse(error)
                    )
                } else {
                    // delete old thumbnail if updated
                    if (bookOldThumbnail) {
                        fileUploader.deleteFile(bookOldThumbnail);
                    }

                    response.status(200).send(
                        methods.successResponse("Book was updated.", {
                            book: book
                        })
                    )
                }
            })
        }
    });
}

/**
 * delete existing book & thumbnail
 * @param request
 * @param response
 * @param next
 */
exports.delete = (request, response, next) => {
    Book.findByIdAndRemove(request.params.id, (error, book) => {
        if (error) {
            response.status(500).send(
                methods.failResponse(error)
            )
        } else {
            fileUploader.deleteFile(book.thumbnail);
            response.status(200).send(
                methods.successResponse("Book was deleted.", {
                    book: book
                })
            )
        }
    });
}