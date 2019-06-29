const express = require("express");
const router = express.Router();
const fs = require('fs');

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
        schedule(req.body.roomId);
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
