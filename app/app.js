const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');

let app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://mongo:27017/interviews', { useNewUrlParser: true });

const db = mongoose.connection;

db.once('open', () => {
    console.log('mongoDB is connected!');
});

// log
app.use(morgan('dev'));


require('./src/routers')(app);


// handle error
app.use((req, res, next) => {
    let error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;