const express = require("express");
const router = express.Router();
const fs = require('fs');
const MqttHandler = require("../mqtt/mqtt_client");
const mqttClient = new MqttHandler('apartmentHandler', [], function (){console.log('do nothing')});
mqttClient.connect();

removeAct = function (act) {
    let acts = JSON.parse(fs.readFileSync(__dirname + '/../db/acts.json'));
    let actIndex = acts.findIndex(a => act.id === a.id);
    if (actIndex !== -1) {
        acts.splice(actIndex, 1);
        fs.writeFileSync(__dirname + '/../db/acts.json', JSON.stringify(acts));
        console.log('scritto file: ' + JSON.stringify(acts));
    }
};

removeSensor = function (sensor) {
    let acts = JSON.parse(fs.readFileSync(__dirname + '/../db/sens.json'));
    console.log('type of acts: ' + (typeof acts));
    let actIndex = acts.findIndex(a => sensor.id === a.id);
    if (actIndex !== -1) {
        acts.splice(actIndex, 1);
        fs.writeFileSync(__dirname + '/../db/sens.json', JSON.stringify(sensor));
        console.log('scritto file: ' + JSON.stringify(sensor));
    }
};

/** Manage sensors and actuators availability **/
manageElements = function (apartment) {
    if (apartment.rooms.length > 0) {
        for (let room of apartment.rooms) {
            let sensor = room.sensor;
            let heatAct = room.heatAct;
            let coolAct = room.coolAct;
            removeAct(heatAct);
            removeAct(coolAct);
            removeSensor(sensor);
        }
    }
};

/** GET apartment **/
router.get('/', (req, res, next) => {
    let apartment = JSON.parse(fs.readFileSync(__dirname + '/../db/apartment.json'));
    return res.status(200).send(apartment);
});

//** POST apartment **/
router.post('/', (req, res, next) => {
    let apartment = JSON.parse(fs.readFileSync(__dirname + '/../db/apartment.json'));
    apartment = req.body;
    fs.writeFileSync(__dirname + '/../db/apartment.json', JSON.stringify(apartment));
    manageElements(apartment);
    console.log('scritto file: ' + JSON.stringify(apartment));
    return res.status(200);
});

/** POST update prog temp **/
router.post('/updateProgTemp', (req, res, next) => {
    let apartment = JSON.parse(fs.readFileSync(__dirname + '/../db/apartment.json'));
    let room = req.body;
    apartment.rooms.find(r => r.id === room.id).progTemp = room.progTemp;
    const lastReading = JSON.parse(fs.readFileSync(__dirname + '/../db/last-readings.json')).find(r => r.id === room.sensor.id);
    const consoleStatus = JSON.parse(fs.readFileSync(__dirname + '/../db/consoleStatus.json')).find(c => c.roomId === room.id);
    fs.writeFileSync(__dirname + '/../db/apartment.json', JSON.stringify(apartment));
    console.log('upartment updated');
    if (lastReading && consoleStatus.active) {
        const lastTemp = lastReading.temp;
        if (lastTemp < room.progTemp) {
            mqttClient.sendMessage('command-' + room.heatAct.id, 'on');
        }
        else if (lastTemp > room.progTemp) {
            mqttClient.sendMessage('command-' + room.coolAct.id, 'on');
        }
        else {
            mqttClient.sendMessage('command-' + room.heatAct.id, 'off');
            mqttClient.sendMessage('command-' + room.coolAct.id, 'off');
        }
    }
    return res.status(200);
});

module.exports = router;
