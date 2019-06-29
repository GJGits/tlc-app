const express = require("express");
const router = express.Router();
const fs = require('fs');
const mqttClient = new MqttHandler('eventsHandler');

/**
 * permette di gestire lo stato delle console per le varie stanze
 */

router.post('/status', (req, res, next) => {
    const consoleStatus = JSON.parse(fs.readFileSync(__dirname + '/../db/consoleStatus.json'));
    consoleStatus.forEach((item, index) => {
        if (item.roomId === req.body.roomId) consoleStatus.splice(index, 1)
    });
    consoleStatus.push(req.body);
    fs.writeFileSync(__dirname + '/../db/consoleStatus.json', JSON.stringify(consoleStatus));
    if (consoleStatus.active) {
        handleOn(consoleStatus);
    }
    return res.status(200).send(req.body);
});

router.get('/status/:roomId', (req, res, next) => {
    const roomId = req.params.roomId;
    const consoleStatus = JSON.parse(fs.readFileSync(__dirname + '/../db/consoleStatus.json'));
    return res.status(200).send(consoleStatus.find(cs => cs.roomId === roomId));
});

router.get('/repeatable', (req, res, next) => {
    let events = JSON.parse(fs.readFileSync(__dirname + '/../db/reapEvents.json'));
    return res.status(200).send(events);
});

router.get('/simple', (req, res, next) => {
    let events = JSON.parse(fs.readFileSync(__dirname + '/../db/simpEvents.json'));
    return res.status(200).send(events);
});

router.post('/repeatable', (req, res, next) => {
    let events = JSON.parse(fs.readFileSync(__dirname + '/../db/reapEvents.json'));
    events.push(req.body);
    fs.writeFileSync(__dirname + '/../db/reapEvents.json', JSON.stringify(events));
    return res.status(200).send(req.body);
});

router.post('/simple', (req, res, next) => {
    let events = JSON.parse(fs.readFileSync(__dirname + '/../db/simpEvents.json'));
    events.push(req.body);
    fs.writeFileSync(__dirname + '/../db/simpEvents.json', JSON.stringify(events));
    return res.status(200).send(req.body);
});

router.delete('/deleteSimple/:roomName/:startDate/:startTime', (req, res, next) => {
    const roomName = req.params.roomName;
    const startDate = req.params.startDate;
    const startTime = req.params.startTime;
    let simpleEvents = JSON.parse(fs.readFileSync(__dirname + '/../db/simpEvents.json'));
    simpleEvents = simpleEvents.filter(ev => ev.roomName !== roomName && ev.startDate !== startDate && ev.startTime !== startTime);
    fs.writeFileSync(__dirname + '/../db/simpEvents.json', JSON.stringify(simpleEvents));
    return res.status(200);
});

router.delete('/deleteRepeatable/:roomName/:repeat/:startTime', (req, res, next) => {
    const roomName = req.params.roomName;
    const repeat = req.params.repeat;
    const startTime = req.params.startTime;
    console.log([roomName, repeat, startTime]);
    let events = JSON.parse(fs.readFileSync(__dirname + '/../db/reapEvents.json'));
    events = events.filter(ev => ev.roomName !== roomName && ev.repeat !== repeat && ev.startTime !== startTime);
    fs.writeFileSync(__dirname + '/../db/reapEvents.json', JSON.stringify(events));
    return res.status(200);
});

const schedule = function (roomId) {
    let repeatableEvents = JSON.parse(fs.readFileSync(__dirname + '/../db/reapEvents.json'));
    let simpleEvents = JSON.parse(fs.readFileSync(__dirname + '/../db/simpEvents.json'));
    let repeatable = repeatableEvents.findIndex(r => r.roomName === roomId) !== -1 ? repeatableEvents.findIndex(r => r.roomName === roomId) : simpleEvents.findIndex(r => r.roomName === roomId);
    repeatable ? scheduleRepeatable(repeatableEvents.find(r => r.roomName === roomId)) : scheduleSimple(simpleEvents.find(r => r.roomName === roomId))
};

/**
 * primo processo lanciato quando si riceve un console ON
 * */
const handleOn = function (consoleStatus) {
    const roomId = consoleStatus.roomId;
    if (consoleStatus.mode === 'programmed') {
        checkAndActivateProgrammed(roomId);
    }
};

const checkAndActivateProgrammed = function (roomId) {
    let repeatableEvents = JSON.parse(fs.readFileSync(__dirname + '/../db/reapEvents.json'));
    let index = repeatableEvents.findIndex(ev => ev.roomName === roomId);
    if (index !== -1) {
        handleRepeatable(event);
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
        if (nowTime >= startTime && nowTime <= endTime) {
            // supponiamo un grado per ora
            let diffHours = startTime - nowTime;
            let room = JSON.parse(fs.readFileSync(__dirname + '/../db/apartment.json')).rooms.find(r => r.id === event.roomName);
            let sensorId = room.sensor.id;
            let lastReading = JSON.parse(fs.readFileSync(__dirname + '/../db/last-readings.json')).find(re => re.id === sensorId);
            // valuto riscaldamento
            if (progTemp > lastReading) {
                let diffTemp = progTemp - lastReading;
                if (diffTemp >= diffHours) {
                    // riscaldo
                    mqttClient.sendMessage('command-ha:' + room.heatAct.id, 'on');
                }
            } else {
                let diffTemp = Math.abs(progTemp - lastReading);
                if (diffTemp >= diffHours) {
                    // raffreddo
                    mqttClient.sendMessage('command-ca:' + room.coolAct.id, 'on');
                }
            }
        }
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

const scheduleRepeatable = function (event) {

    // todo: schedule here

    setTimeout(function () {
        // todo: un schedule here
    }, 0);

};

const scheduleSimple = function (event) {

    // todo: schedule here

    setTimeout(function () {
        // todo: un schedule here
    }, 0);

};

module.exports = router;
