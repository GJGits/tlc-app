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
        temp: +tokens[0].split("=")[1],
        hum: +tokens[1].split("=")[1],
        index: +tokens[2].split("=")[1]
    };
    writeReading(reading);
    mysqlClient.insertReading(reading);
    const cons = JSON.parse(fs.readFileSync(__dirname + '/../db/consoleStatus.json'));
    const apartment = JSON.parse(fs.readFileSync(__dirname + '/../db/apartment.json'));
    let room = apartment.rooms.find(r => r.sensor.id === reading.id);
    if (cons.active) {
        if (cons.mod === 'manual') {
            handleReading(reading, room);
        } else {
            let roomId = room.id;
            checkAndActivateProgrammed(roomId);
        }
    }
});
client.connect();

const checkAndActivateProgrammed = function (roomId) {
    let repeatableEvents = JSON.parse(fs.readFileSync(__dirname + '/../db/reapEvents.json'));
    let index = repeatableEvents.findIndex(ev => ev.roomName === roomId);
    if (index !== -1) {
        handleRepeatable(repeatableEvents.find(ev => ev.roomName === roomId));
    }
    let simpleEvents = JSON.parse(fs.readFileSync(__dirname + '/../db/simpEvents.json'));
    index = simpleEvents.findIndex(ev => ev.roomName === roomId);
    if (index !== -1) {
        handleSimple(simpleEvents.find(ev => ev.roomName === roomId));
    }
};

const handleSimple = function (event) {
    let now = dateformat(new Date(), 'yyyy-mm-dd');
    let startDate = event.startDate;
    let endDate = event.endDate;
    if (now >= startDate && no <= endDate) {
        let startTime = event.startTime;
        let endTime = event.endTime;
        let nowTime = new Date().getHours();
        if (nowTime <= endTime) {
            // supponiamo un grado per ora
            let diffHours = startTime - nowTime;
            let room = JSON.parse(fs.readFileSync(__dirname + '/../db/apartment.json')).rooms.find(r => r.id === event.roomName);
            let sensorId = room.sensor.id;
            let lastReading = JSON.parse(fs.readFileSync(__dirname + '/../db/last-readings.json')).find(re => re.id === sensorId);
            // valuto riscaldamento
            if (progTemp > lastReading) {
                let diffTemp = progTemp - lastReading;
                if (diffTemp >= diffHours || diffHours < 0) {
                    // riscaldo
                    mqttClient.sendMessage('command-ha:' + room.heatAct.id, 'on');
                }
            } else {
                let diffTemp = Math.abs(progTemp - lastReading);
                if (diffTemp >= diffHours || diffHours < 0) {
                    // raffreddo
                    mqttClient.sendMessage('command-ca:' + room.coolAct.id, 'on');
                }
            }
        }
    }
};

const handleRepeatable = function (event) {
    let start = mapDay(event.from.toLowerCase());
    let end = mapDay(event.to.toLowerCase());
    let now = new Date();
    let nowDay = mapDay(now.getDay());
    if (nowDay <= end && nowDay >= start) {
        // ora di accendere?
        let nowTime = now.getHours();
        let progTemp = event.temp;
        let startTime = event.startTime;
        let endTime = event.endTime;
        // metodo chiamato in caso di ON, se siamo ancora in tempo scheduliamo
        if (nowTime <= endTime) {
            // supponiamo un grado per ora
            let diffHours = startTime - nowTime;
            let room = JSON.parse(fs.readFileSync(__dirname + '/../db/apartment.json')).rooms.find(r => r.id === event.roomName);
            let sensorId = room.sensor.id;
            let lastReading = JSON.parse(fs.readFileSync(__dirname + '/../db/last-readings.json')).find(re => re.id === sensorId);
            // valuto riscaldamento
            if (progTemp > lastReading) {
                let diffTemp = progTemp - lastReading;
                if (diffTemp >= diffHours || diffHours < 0) {
                    // riscaldo
                    mqttClient.sendMessage('command-ha:' + room.heatAct.id, 'on');
                }
            } else {
                let diffTemp = Math.abs(progTemp - lastReading);
                if (diffTemp >= diffHours || diffHours < 0) {
                    // raffreddo
                    mqttClient.sendMessage('command-ca:' + room.coolAct.id, 'on');
                }
            }
        }
    }
};


const handleReading = function (reading, room) {
    if (reading.temp > room.progTemp) {
        client.sendMessage('command-ha:' + room.heatAct.id,'on');
    }
    else if (reading.temp < room.progTemp) {
        client.sendMessage('command-ca:' + room.coolAct.id,'on');
    }
    else {
        client.sendMessage('command-ha:' + room.heatAct.id,'off');
        client.sendMessage('command-ca:' + room.coolAct.id, 'off');
    }
};

const writeReading = function (reading) {
    // recupero ultima lettura sensore
    console.log('reading', reading);
    let readings = JSON.parse(fs.readFileSync(__dirname + '/../db/last-readings.json'));
    readings.forEach((item, index) => {
        if (item.id === reading.id) readings.splice(index, 1)
    });
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
