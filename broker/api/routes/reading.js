const express = require("express");
const router = express.Router();
const fs = require('fs');
const cors = require('cors');

router.options('/', cors());

/**
 * Restituisce l'ultima lettura del sensore specificato dall'id
 */
router.get('/:id', (req, res, next) => {
    let sensorId = req.params.id;
    let readings = JSON.parse(fs.readFileSync(__dirname + '/../db/last-readings.json'));
    let reading = readings.find(r => r.id === sensorId);
    return res.status(200).send(reading);
});

module.exports = router;
