const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require('cors');
const awsClient = require("./api/mqtt/aws_mqtt_client");

// enable cors options for all routes
app.use(cors());

// logga richieste ricevute su console
app.use(morgan('dev'));

// set parsing options
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// definisco routers
const apartmentRouter = require("./api/routes/apartment");
const readingsRouter = require("./api/routes/reading");
const updateTempRouter = require("./api/routes/updateTemp");
const sensRouter = require("./api/routes/sens");
const actsRouter = require("./api/routes/acts");
const commandRouter = require('./api/routes/command');
const presenceRouter = require('./api/routes/presence');
const authRouter = require('./api/routes/auth');
const userRouter = require('./api/routes/user');
const eventsRouter = require('./api/routes/events');
const deviceRouter = require('./api/routes/device-info');

// mappo routes
app.use("/apartment", apartmentRouter);
app.use('/reading', readingsRouter);
app.use('/updateTemp', updateTempRouter);
app.use("/sens", sensRouter);
app.use("/acts", actsRouter);
app.use("/command", commandRouter);
app.use("/presence", presenceRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use('/events', eventsRouter);
app.use('/device-info', deviceRouter);

// handle 404
app.use((req, res, next) => {
    return res.status(404).send({message: 'Route' + req.url + ' Not found.'});
});

// handle 500
app.use((err, req, res, next) => {
    awsClient.logEvent(5);
    console.error(err.stack);
    return res.status(500).send({error: err});
});

module.exports = app;
