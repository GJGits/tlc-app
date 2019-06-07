const express = require("express");
const router = express.Router();
const fs = require('fs');
const cors = require('cors');

router.options('/', cors());

/**
 * GET all sensors
 */
router.get('/', (req, res, next) => {
    const sens = JSON.parse(fs.readFileSync(__dirname + '/../db/sens.json'));
    return res.status(200).send(sens);
});

    removeSensor = function(sensor) {
    let acts = JSON.parse(fs.readFileSync(__dirname + '/../db/sens.json'));
    let actIndex = acts.findIndex(a => sensor.id === a.id);
    if (actIndex !== -1) {
        acts.splice(actIndex, 1);
        fs.writeFileSync(__dirname + '/../db/sens.json', JSON.stringify(acts));
        console.log('scritto file: ' + JSON.stringify(acts));
    }
};

module.exports = router;
