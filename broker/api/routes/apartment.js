const express = require("express");
const router = express.Router();
const fs = require('fs');
const cors = require('cors');

router.options('/', cors());

/** GET apartment **/
router.get('/', (req, res, next) => {
    let apartment = JSON.parse(fs.readFileSync(__dirname + '/../db/apartment.json'));
    return res.status(200).send(apartment);
});

module.exports = router;
