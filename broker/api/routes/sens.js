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

module.exports = router;
