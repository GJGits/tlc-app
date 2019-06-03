const express = require("express");
const router = express.Router();
const fs = require('fs');
const cors = require('cors');

router.options('/', cors());

/**
 * GET all acts
 */
router.get('/', (req, res, next) => {
    const acts = JSON.parse(fs.readFileSync(__dirname + '/../db/acts.json'));
    return res.status(200).send(acts);
});


module.exports = router;
