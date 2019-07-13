const express = require("express");
const router = express.Router();
const fs = require('fs');
const MqttHandler = require("../mqtt/mqtt_client");
let apartment = JSON.parse(fs.readFileSync(__dirname + '/../db/apartment.json'));

/** Save apartment in async mode **/
saveApartment = function (apa) {
    fs.writeFile(__dirname + '/../db/apartment.json', JSON.stringify(apa), (err) => {
        if (err) throw err;
        console.log('apartment updated'.green);
    });
};

const mqttClient = new MqttHandler('apartmentHandler', [], function () {
    console.log('do nothing')
});
mqttClient.connect();

removeAct = function (act) {
    let acts = JSON.parse(fs.readFileSync(__dirname + '/../db/acts.json'));
    let actIndex = acts.findIndex(a => act.id === a.id);
    if (actIndex !== -1) {
        acts.splice(actIndex, 1);
        fs.writeFileSync(__dirname + '/../db/acts.json', JSON.stringify(acts));
        console.log('aggiornata lista act:'.green);
    }
};

removeSensor = function (sensor) {
    let acts = JSON.parse(fs.readFileSync(__dirname + '/../db/sens.json'));
    let actIndex = acts.findIndex(a => sensor.id === a.id);
    if (actIndex !== -1) {
        acts.splice(actIndex, 1);
        fs.writeFileSync(__dirname + '/../db/sens.json', JSON.stringify(sensor));
        console.log('aggiornata lista sensori'.green);
    }
};

/** Manage sensors and actuators availability **/
manageElements = function (apartment) {
    if (apartment.rooms) {
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
    return res.status(200).send(apartment);
});

//** POST apartment **/
router.post('/', (req, res, next) => {
    apartment = req.body;
    saveApartment(apartment);
    manageElements(apartment);
    return res.status(200).send(apartment);
});

/** POST update prog temp **/
router.post('/updateProgTemp', (req, res, next) => {
    let room = req.body;
    apartment.rooms.find(r => r.id === room.id).progTemp = room.progTemp;
    const lastReading = JSON.parse(fs.readFileSync(__dirname + '/../db/last-readings.json')).find(r => r.id === room.sensor.id);
    const consoleStatus = JSON.parse(fs.readFileSync(__dirname + '/../db/consoleStatus.json')).find(c => c.roomId === room.id);
    saveApartment(apartment);
    if (lastReading && consoleStatus.active) {
        const lastTemp = Math.round(lastReading.temp);
        if (lastTemp < room.progTemp) {
            mqttClient.sendMessage('command-' + room.heatAct.id, 'on');
            mqttClient.sendMessage('command-' + room.coolAct.id, 'off');
        } else if (lastTemp > room.progTemp) {
            mqttClient.sendMessage('command-' + room.coolAct.id, 'on');
            mqttClient.sendMessage('command-' + room.heatAct.id, 'off');
        } else {
            mqttClient.sendMessage('command-' + room.heatAct.id, 'off');
            mqttClient.sendMessage('command-' + room.coolAct.id, 'off');
        }
    }
    return res.status(200).send(apartment);
});

module.exports = router;
