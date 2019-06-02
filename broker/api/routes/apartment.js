const express = require("express");
const router = express.Router();
const fs = require('fs');

/** GET apartment **/
router.get('/', (req, res, next) => {
    let apartment = JSON.parse(fs.readFileSync(__dirname + '/../db/apartment.json'));
    return res.status(200).send(apartment);
});

/** POST update prog temp **/
router.post('updateProgTemp', (req, res, next) => {
    /*
    let apartment = JSON.parse(fs.readFileSync(__dirname + '/../db/apartment.json'));
    let room = req.body;
    apartment.rooms.find(r => r.id === room.id).progTemp = room.progTemp;
    fs.writeFileSync(__dirname + '/../db/apartment.json', JSON.stringify(apartment));
    console.log('scritto file: ' + JSON.stringify(apartment));
    //todo: check if a publish is needed
    return res.status(200);
     */
    console.log('OK');
});

module.exports = router;
