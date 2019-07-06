const express = require('express');
const logger = require('morgan');
const cors = require('cors');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
// enable cors options for all routes
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
