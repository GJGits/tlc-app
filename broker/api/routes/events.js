const express = require("express");
const router = express.Router();
const fs = require('fs');

router.post('/status', (req, res, next) => {
    fs.writeFileSync(__dirname + '/../db/consoleStatus.json', JSON.stringify(req.body));
    // todo: se status on schedulare con crontab altrimenti eliminare scheduling
    return res.status(200).send(req.body);
});

router.get('/status', (req, res, next) => {
    const consoleStatus = JSON.parse(fs.readFileSync(__dirname + '/../db/consoleStatus.json'));
   return res.status(200).send(consoleStatus);
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

module.exports = router;
