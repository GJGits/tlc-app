const express = require("express");
const router = express.Router();
const fs = require('fs');
const MqttHandler = require("../mqtt/mqtt_client");
const colors = require('colors');
const mqttClient = new MqttHandler('eventsHandler', [], function () {
    console.log('do nothing')
});
mqttClient.connect();
const dateformat = require('dateformat');

/**
 * permette di gestire lo stato delle console per le varie stanze
 */

router.post('/status', (req, res, next) => {
    const consoleStatus = JSON.parse(fs.readFileSync(__dirname + '/../db/consoleStatus.json'));
    consoleStatus.forEach((item, index) => {
        if (item.roomId === req.body.roomId) consoleStatus.splice(index, 1)
    });
    let cons = req.body;
    consoleStatus.push(cons);
    fs.writeFileSync(__dirname + '/../db/consoleStatus.json', JSON.stringify(consoleStatus));
    if (cons.active) {
        console.log('console attivata:'.green, req.body.roomId);
        handleOn(cons);
    } else {
        let room = JSON.parse(fs.readFileSync(__dirname + '/../db/apartment.json')).rooms.find(r => r.id === cons.roomId);
        let heatId = room.heatAct.id;
        let coolId = room.coolAct.id;
        mqttClient.sendMessage('command-' + heatId, 'off');
        mqttClient.sendMessage('command-' + coolId, 'off');
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
    return res.status(200).send({room: roomName});
});

router.delete('/deleteRepeatable/:roomName/:repeat/:startTime', (req, res, next) => {
    const roomName = req.params.roomName;
    const repeat = req.params.repeat;
    const startTime = req.params.startTime;
    let events = JSON.parse(fs.readFileSync(__dirname + '/../db/reapEvents.json'));
    events = events.filter(ev => ev.roomName !== roomName && ev.repeat !== repeat && ev.startTime !== startTime);
    fs.writeFileSync(__dirname + '/../db/reapEvents.json', JSON.stringify(events));
    return res.status(200).send({room: roomName});
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
    if (consoleStatus.mode === 'manual') {
        console.log('mod manuale:'.green, roomId);
        checkAndActivateManual(JSON.parse(fs.readFileSync(__dirname + '/../db/apartment.json')).rooms.find(r => r.id === consoleStatus.roomId));
    }
};

const checkAndActivateProgrammed = function (roomId) {
    let repeatableEvents = JSON.parse(fs.readFileSync(__dirname + '/../db/reapEvents.json'));
    for (let event of repeatableEvents) {
        if (event.roomName === roomId) {
            handleRepeatable(event);
        }
    }
    let simpleEvents = JSON.parse(fs.readFileSync(__dirname + '/../db/simpEvents.json'));
    for (let event of simpleEvents) {
        if (event.roomName === roomId) {
            handleSimple(event);
        }
    }
};

const checkAndActivateManual = function (room) {
    let sensorId = room.sensor.id;
    let lastReading = JSON.parse(fs.readFileSync(__dirname + '/../db/last-readings.json')).find(re => re.id === sensorId);
    if (room.progTemp > lastReading.temp) {
        mqttClient.sendMessage('command-' + room.heatAct.id, 'on');
    }
    if (room.progTemp < lastReading.temp) {
        mqttClient.sendMessage('command-' + room.coolAct.id, 'on');
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
        let apartment = JSON.parse(fs.readFileSync(__dirname + '/../db/apartment.json'));
        apartment.rooms.find(r => r.id === event.roomName).progTemp = progTemp;
        fs.writeFileSync(__dirname + '/../db/apartment.json', JSON.stringify(apartment));
        let room = apartment.rooms.find(r => r.id === event.roomName);
        if (nowTime <= endTime) {
            // supponiamo un grado per ora
            let diffHours = startTime - nowTime;
            let sensorId = room.sensor.id;
            let lastReading = Math.round(JSON.parse(fs.readFileSync(__dirname + '/../db/last-readings.json')).find(re => re.id === sensorId).temp);
            // valuto riscaldamento
            if (progTemp > lastReading) {
                let diffTemp = progTemp - lastReading;
                if (diffTemp >= diffHours || diffHours <= 0) {
                    // riscaldo
                    mqttClient.sendMessage('command-' + room.heatAct.id, 'on');
                    mqttClient.sendMessage('command-' + room.coolAct.id, 'off');
                    mqttClient.sendMessage('newTemp', '' + progTemp);
                }
            } if (progTemp < lastReading) {
                let diffTemp = Math.abs(progTemp - lastReading);
                if (diffTemp >= diffHours || diffHours <= 0) {
                    // raffreddo
                    mqttClient.sendMessage('command-' + room.coolAct.id, 'on');
                    mqttClient.sendMessage('command-' + room.heatAct.id, 'off');
                    mqttClient.sendMessage('newTemp', '' + progTemp);
                }
            }
        } else {
            mqttClient.sendMessage('command-' + room.coolAct.id, 'off');
            mqttClient.sendMessage('command-' + room.heatAct.id, 'off');
        }
    }
};

const handleRepeatable = function (event) {
    let start = mapDay(event.from.toLowerCase());
    let end = mapDay(event.to.toLowerCase());
    let now = new Date();
    let nowDay = now.getDay(); // restituisce giorno della settimana come numero
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
            // valuto riscaldamento
            if (progTemp > lastReading) {
                let diffTemp = progTemp - lastReading;
                if (diffTemp >= diffHours || diffHours <= 0) {
                    // riscaldo
                    mqttClient.sendMessage('newTemp', '' + progTemp);
                    mqttClient.sendMessage('command-' + room.heatAct.id, 'on');
                    mqttClient.sendMessage('command-' + room.coolAct.id, 'off');
                }
            } if (progTemp < lastReading) {
                let diffTemp = Math.abs(progTemp - lastReading);
                if (diffTemp >= diffHours || diffHours <= 0) {
                    // raffreddo
                    mqttClient.sendMessage('newTemp', '' + progTemp);
                    mqttClient.sendMessage('command-' + room.coolAct.id, 'on');
                    mqttClient.sendMessage('command-' + room.heatAct.id, 'off');
                }
            }
        } else {
            // spengo tutto: o l'evento e' finito o e' stato programmato un evento gia' concluso
            mqttClient.sendMessage('command-' + room.coolAct.id, 'off');
            mqttClient.sendMessage('command-' + room.heatAct.id, 'off');
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


module.exports = router;
