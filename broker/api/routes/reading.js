const express = require("express");
const router = express.Router();
const fs = require('fs');
const cors = require('cors');
const mysqlClient = require('../db/mysqlClient');
const awsClient = require('../mqtt/aws_mqtt_client');
const dateformat = require('dateformat');

router.options('/', cors());

const MqttHandler = require("../mqtt/mqtt_client");
const mqttClient = new MqttHandler('reading', ['readings'], (topic, message) => {
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
    let cons = JSON.parse(fs.readFileSync(__dirname + '/../db/consoleStatus.json'));
    const apartment = JSON.parse(fs.readFileSync(__dirname + '/../db/apartment.json'));
    let room = apartment.rooms.find(r => r.sensor.id === reading.id);
    cons = cons.find(c => c.roomId === room.id);
    if (cons.active) {
        console.log('cons active from reading');
        if (cons.mode === 'manual') {
            console.log('cons mode manual');
            handleReading(reading, room);
        } else {
            let roomId = room.id;
            checkAndActivateProgrammed(roomId);
        }
    }
});
mqttClient.connect();

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
    let endDate = event.endData;
    let progTemp = event.temp;
    if (now >= startDate && now <= endDate) {
        let startTime = event.startTime;
        let endTime = event.endTime;
        let nowTime = new Date().getHours();
        if (nowTime <= endTime) {
            // supponiamo un grado per ora
            let diffHours = startTime - nowTime;
            let room = JSON.parse(fs.readFileSync(__dirname + '/../db/apartment.json')).rooms.find(r => r.id === event.roomName);
            let sensorId = room.sensor.id;
            let lastReading = Math.round(JSON.parse(fs.readFileSync(__dirname + '/../db/last-readings.json')).find(re => re.id === sensorId).temp);
            // valuto riscaldamento
            if (progTemp > lastReading) {
                let diffTemp = progTemp - lastReading;
                if (diffTemp >= diffHours || diffHours <= 0) {
                    // riscaldo
                    mqttClient.sendMessage('command-' + room.heatAct.id, 'on');
                }
            } else  if (progTemp < lastReading){
                let diffTemp = Math.abs(progTemp - lastReading);
                if (diffTemp >= diffHours || diffHours <= 0) {
                    // raffreddo
                    mqttClient.sendMessage('command-' + room.coolAct.id, 'on');
                }
            } else {
                mqttClient.sendMessage('command-' + room.heatAct.id, 'off');
                mqttClient.sendMessage('command-' + room.coolAct.id, 'off');
            }
        }
    }
};

const handleRepeatable = function (event) {
    let start = mapDay(event.from.toLowerCase());
    let end = mapDay(event.to.toLowerCase());
    let now = new Date();
    let nowDay = now.getDay();
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
            let apartment = JSON.parse(fs.readFileSync(__dirname + '/../db/apartment.json'));
            apartment.rooms.find(r => r.id === event.roomName).progTemp = progTemp;
            fs.writeFileSync(__dirname + '/../db/apartment.json', JSON.stringify(apartment));
            let room = apartment.rooms.find(r => r.id === event.roomName);
            let sensorId = room.sensor.id;
            let lastReading = Math.round(JSON.parse(fs.readFileSync(__dirname + '/../db/last-readings.json')).find(re => re.id === sensorId).temp);
            mqttClient.sendMessage('newTemp', '' + progTemp);
            // valuto riscaldamento
            if (progTemp > lastReading) {
                let diffTemp = progTemp - lastReading;
                if (diffTemp >= diffHours || diffHours <= 0) {
                    // riscaldo
                    mqttClient.sendMessage('command-' + room.heatAct.id, 'on');
                }
            } else if (progTemp < lastReading){
                let diffTemp = Math.abs(progTemp - lastReading);
                if (diffTemp >= diffHours || diffHours <= 0) {
                    // raffreddo
                    mqttClient.sendMessage('command-' + room.coolAct.id, 'on');
                }
            } else {
                mqttClient.sendMessage('command-' + room.heatAct.id, 'off');
                mqttClient.sendMessage('command-' + room.coolAct.id, 'off');
            }
        }
    }
};


const handleReading = function (reading, room) {
    console.log('reading, prog:', reading, room.progTemp);
    if (reading.temp < room.progTemp) {
        mqttClient.sendMessage('command-' + room.heatAct.id,'on');
    }
    else if (reading.temp > room.progTemp) {
        mqttClient.sendMessage('command-' + room.coolAct.id,'on');
    }
    else {
        mqttClient.sendMessage('command-' + room.heatAct.id,'off');
        mqttClient.sendMessage('command-' + room.coolAct.id, 'off');
    }
};

/**
 * monday = 0; tuesday = 1; ...
 * */

const mapDay = function (day) {
    if (day === 'monday') return 0;
    if (day === 'tuesday') return 1;
    if (day === 'wednesday') return 2;
    if (day === 'thursday') return 3;
    if (day === 'friday') return 4;
    if (day === 'saturday') return 5;
    if (day === 'sunday') return 6;
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
