const express = require("express");
const router = express.Router();
const os = require('os');
const ifaces = os.networkInterfaces();
const fs = require('fs');
const wifi = require('node-wifi');

/**
 * set device ip
 */
router.get('/', (req, res, next) => {
    if (ifaces.wlan0) {
        const wlan0 = ifaces.wlan0;
        wlan0.forEach(iface => {
            if (iface.family === "IPv4") {
                ip = iface.address;
                fs.writeFileSync(__dirname + '/ip.json', JSON.stringify({ip: ip}));
                return res.send({message: "address setted!"});
            }
        });
    }
});

wifi.init({
    iface: 'wlan0'
});

/**
 * GET AVAIBLE NETWORKS
 */
router.get('/avaible', (req, res, next) => {
    wifi.scan((err, networks) => {
        if (!err) {
            console.log(networks);
            res.status(200).send(networks);
        } else {
            console.log(err);
            res.status(500).send({error: 'something went wrong'});
        }
    });
});

/**
 * TRY TO CONNECT TO A GIVEN NETWORK
 */
router.post('/connect', (req, res, next) => {
    const credentials = req.body;
    wifi.connect(credentials, (err) => {
        if (err) {
            console.log(err);
            return res.status(200).send({connection: 'failed'});
        } else {
            return res.status(200).send({connection: 'ok'});
        }
    });

});

module.exports = router;
