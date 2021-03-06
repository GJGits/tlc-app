const express = require("express");
const router = express.Router();
const request = require("request");
const awsURL = "http://ec2-34-220-162-82.us-west-2.compute.amazonaws.com:5002";

/* MAC ADDRESS DEFINITION */
const mac = require('getmac');
let macAddress;
mac.getMac({iface: 'wlan0'}, (err, address) => {
    if (!err) {
        macAddress = address;
        console.log('device mac address:'.green, address);
    } else {
        // give a fake mac address
        console.log('set device mac failed'.red);
        macAddress = "01:01:01:01:01:01";
    }

});

sendRequest = function (url, method, req, res, parse) {
    const clientOptions = {
        uri: url,
        body: JSON.stringify(req.body),
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + req.header("authorization").split(" ")[1]
        }
    };
    request(clientOptions, (error, response) => {
        if (!error) {
            if(parse) {
                return res.status(200).send(response.body
                    .replace(/\\/g, '')
                    .replace(/\\\\/g, '')
                    .replace(/""/g, '"')
                    .replace(/"{/g, '{')
                    .replace(/}"/g, '}'));
            }
            return res.status(200).send(response.body);
        } else {
            console.error(error);
        }
    })
};

/**
 * GET GROUP INFO
 * */

router.get('/:groupID', (req, res, next) => {
    const groupID = req.params.groupID;
    const uri = awsURL + "/user/" + groupID;
    return sendRequest(uri, 'GET', req, res, false);
});

/**
 * POST GROUP INFO
 * */

router.post('/:groupID', (req, res, next) => {
    const groupID = req.params.groupID;
    const uri = awsURL + "/user/" + groupID;
    return sendRequest(uri, 'POST', req, res, false);
});

/**
 * GET DEVICE INFO
 * */

router.get('/:groupID/devices', (req, res, next) => {
    const groupID = req.params.groupID;
    const uri = awsURL + "/user/" + groupID + "/devices";
    return sendRequest(uri, 'GET', req, res, false);
});

/**
 * POST DEVICE INFO
 * */

router.post('/:groupID/devices', (req, res, next) => {
    const groupID = req.params.groupID;
    req.body.device_mac = macAddress;
    req.body.configuration = JSON.parse(fs.readFileSync(__dirname + '/../db/apartment.json'));
    req.body.device_status = 1;
    const uri = awsURL + "/user/" + groupID + "/devices";
    return sendRequest(uri, 'POST', req, res, false);
});

/**
 * GET LOGS
 * */

router.get('/:groupID/logs', (req, res, next) => {
    const groupID = req.params.groupID;
    const uri = awsURL + "/user/" + groupID + "/logs";
    return sendRequest(uri, 'GET', req, res, true);
});

module.exports = router;
