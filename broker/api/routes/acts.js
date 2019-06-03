const express = require("express");
const router = express.Router();
const fs = require('fs');
const cors = require('cors');

router.options('/', cors());

/**
 * GET heat acts
 */
router.get('/heat', (req, res, next) => {
    const acts = JSON.parse(fs.readFileSync(__dirname + '/../db/acts.json'));
    let heatActs = [];
    for (let a of acts) {
        if(a.id.split(':')[0] === "ah") {
            heatActs.push(a);
        }
    }
    return res.status(200).send(heatActs);
});

/**
 * GET cool acts
 */
router.get('/cool', (req, res, next) => {
    const acts = JSON.parse(fs.readFileSync(__dirname + '/../db/acts.json'));
    let coolActs = [];
    for (let a of acts) {
        if(a.id.split(':')[0] === "ac") {
            coolActs.push(a);
        }
    }
    return res.status(200).send(coolActs);
});


module.exports = router;
