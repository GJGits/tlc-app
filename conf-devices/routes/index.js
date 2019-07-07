const express = require('express');
const router = express.Router();
const os = require('os');
const ifaces = os.networkInterfaces();
let ip;

/* GET home page. */
router.get('/', function (req, res, next) {
    if (ifaces.enp0s3) {
        const wlan0 = ifaces.enp0s3;
        wlan0.forEach(iface => {
            if (iface.family === "IPv4") {
                ip = iface.address;
                return res.send("address setted!");
            }
        });
    }
    res.status(500).send("interface's IPv4 not found")
});

router.get('/ip', (req, res, next) => {
   return ip ? res.send(ip) : res.status(400).send("interface's IPv4 not found");
});

module.exports = router;
