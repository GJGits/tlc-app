const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require('cors');

// enable cors options for all routes
app.use(cors());

// logga richieste ricevute su console
app.use(morgan('dev'));

// set parsing options
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// definisco routers
const apartmentRouter = require("./api/routes/apartment");

// mappo routes
app.use("/apartment", apartmentRouter);

// handle 404
app.use((req, res, next) => {
    return res.status(404).send({message: 'Route' + req.url + ' Not found.'});
});

// handle 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).send({error: err});
});

module.exports = app;
