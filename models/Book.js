const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const bookSchema = new Schema({
    bookName: {
        type: String,
        required: [true, "Book name is required."]
    },
    authorName: {
        type: String,
        required: [true, "Author name is required."]
    },
    publishDate: {
        type: Date,
        required: [true, "Publish date is required."]
    },
    thumbnail: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Book', bookSchema);