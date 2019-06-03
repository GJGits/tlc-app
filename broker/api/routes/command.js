const express = require("express");
const router = express.Router();
const cors = require('cors');
router.options('/', cors());
const MqttHandler = require("../mqtt/mqtt_client");

/**
 * Riceve una post di un comando per un attuatore.
 * Decide se e' necessario agire ed in caso positivo
 * invia una publish.
 */
router.post('/:sensId/:actId', (req, res, next) => {
    const temperaturaDesiderata = req.body.temp;
    const sensId = req.params.sensId;
    const actId = req.params.actId;
    const readings = JSON.parse(fs.readFileSync(__dirname + '/../db/last-readings.json'));
    const acts = JSON.parse(fs.readFileSync(__dirname + '/../db/acts.json'));
    const lastTemp = readings.find(r => r.id === sensId).temp;
    const act = acts.find(a => a.id === actId);
    let heating = act.id.split(':')[0] === 'ah';
    // voglio alzare la temperatura
    if (heating && temperaturaDesiderata > lastTemp && act.status === 'OFF') {
        client.sendMessage('command-' + act.id, 'ON');
    }
    // voglio diminuire la temperatura
    if (!heating && temperaturaDesiderata < lastTemp && act.status === 'OFF') {
        client.sendMessage('command-' + act.id, 'ON');
    }
    return res.status(200);
});

const client = new MqttHandler('command', [], (topic, message) => {
    console.log(`received a message: topic = ${topic}, message = ${message}`);
});

client.connect();


module.exports = router;
