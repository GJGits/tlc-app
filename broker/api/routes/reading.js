const express = require("express");
const router = express.Router();
const fs = require('fs');
const cors = require('cors');
const mysqlClient = require('../db/mysqlClient');
const awsClient = require('../mqtt/aws_mqtt_client');

router.options('/', cors());

const MqttHandler = require("../mqtt/mqtt_client");
const client = new MqttHandler('reading', ['readings'], (topic, message) => {
    console.log(`received a message: topic = ${topic}, message = ${message}`);
    let strMessage = message.toString();
    let tokens = strMessage.split(', ');
    let reading = {
        id: tokens[3].split("=")[1],
        temp: tokens[0].split("=")[1],
        hum: tokens[1].split("=")[1],
        index: tokens[2].split("=")[1]
    };
    writeReading(reading);
    mysqlClient.insertReading(reading);
});
client.connect();

const writeReading = function (reading) {
    // recupero ultima lettura sensore
    let readings = JSON.parse(fs.readFileSync(__dirname + '/../db/last-readings.json'));
    let lastReadIndex = readings.findIndex(r => r.id === reading.id);
    readings.splice(lastReadIndex, 1);
    readings.push(reading);
    fs.writeFileSync(__dirname + '/../db/last-readings.json', JSON.stringify(readings));
    console.log('scritto file: ' + JSON.stringify(readings));
};

/**
 * Restituisce l'ultima lettura del sensore specificato dall'id
 */
router.get('/:id', (req, res, next) => {
    let sensorId = req.params.id;
    let readings = JSON.parse(fs.readFileSync(__dirname + '/../db/last-readings.json'));
    let reading = readings.find(r => r.id === sensorId);
    return res.status(200).send(reading);
});

router.get('/lastReadings/:id', (req, res, next) => {
    const sensorId = req.params.id;
   mysqlClient.getLastReading(sensorId, res);

});

module.exports = router;
