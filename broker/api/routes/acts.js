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

    removeAct = function (act) {
    let acts = JSON.parse(fs.readFileSync(__dirname + '/../db/acts.json'));
    let actIndex = acts.findIndex(a => act.id === a.id);
    if (actIndex !== -1) {
        acts.splice(actIndex, 1);
        fs.writeFileSync(__dirname + '/../db/acts.json', JSON.stringify(acts));
        console.log('scritto file: ' + JSON.stringify(acts));
    }
};
module.exports = router;

