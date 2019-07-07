const express = require('express');
const router = express.Router();
const os = require('os');
const ifaces = os.networkInterfaces();
const fs = require('fs');
let ip;

/* GET home page. */
router.get('/', function (req, res, next) {
    if (ifaces.wlan0) {
        const wlan0 = ifaces.wlan0;
        wlan0.forEach(iface => {
            if (iface.family === "IPv4") {
                ip = iface.address;
                fs.writeFileSync(__dirname + '/ip.json', JSON.stringify({ip: ip}));
                return res.send("address setted!");
            }
        });
    }
    res.send(JSON.stringify(ifaces));
});

router.get('/ip', (req, res, next) => {
    if (ip) {
        return res.send(ip);
    }
    const ipFromJson = fs.readFileSync(__dirname + '/ip.json');
    return ipFromJson.ip ? res.send(ipFromJson.ip) : res.status(400).send("interface's IPv4 not found");
});

module.exports = router;
