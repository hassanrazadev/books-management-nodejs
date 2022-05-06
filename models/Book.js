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
    thumbnail: {
        type: String,
        get: (v) => {
            let baseUrl = process.env.APP_URL;
            if (!baseUrl.endsWith('/')) {
                baseUrl = baseUrl + '/';
            }
            return baseUrl + v;
        }
    },
}, {
    timestamps: true,
    toJSON: { getters: true }
});


module.exports = mongoose.model('Book', bookSchema);