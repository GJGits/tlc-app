const express = require("express");
const router = express.Router();
const fs = require('fs');
let ip;

/**
 * get device ip
 */
router.get('/', (req, res, next) => {
    if (ip) {
        return res.send(ip);
    }
    const ipFromJson = JSON.parse(fs.readFileSync(__dirname + '/../db/ip.json'));
    return ipFromJson.ip ? res.send(ipFromJson) : res.status(400).send({message: "interface's IPv4 not found"});
});

module.exports = router;
