const express = require('express'),
    app = express();
const mongoose = require("mongoose");
const notFoundResponse = require('./helpers/methods').notFoundResponse;
const bodyParser = require('body-parser');
require('dotenv').config();

// ==================== connect database (mongodb) =================== //
mongoose
    .connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongodb')
    .then((x) => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    })
    .catch((error) => {
        console.error('Error connecting to mongo', error.reason)
    });
// ================================================================== //

process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message);
})

// express routes
app.use('/api', require('./routes/auth.route'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(process.env.APP_PORT || 8888, () => {
    console.log(`Server is live on port ${process.env.APP_PORT}`)
});

// Handle 404 not found error
app.use((req, res, next) => {
    res.status(404).send(
        notFoundResponse()
    )
});