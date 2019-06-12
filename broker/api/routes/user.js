const express = require("express");
const router = express.Router();
const request = require("request");
const awsURL = "http://ec2-34-220-162-82.us-west-2.compute.amazonaws.com:5002";

sendRequest = function (url, method, req, res) {
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
    return sendRequest(uri, 'GET', req, res);
});

/**
 * POST GROUP INFO
 * */

router.post('/:groupID', (req, res, next) => {
    const groupID = req.params.groupID;
    const uri = awsURL + "/user/" + groupID;
    return sendRequest(uri, 'POST', req, res);
});

/**
 * GET DEVICE INFO
 * */

router.get('/:groupID/devices', (req, res, next) => {
    const groupID = req.params.groupID;
    const uri = awsURL + "/user/" + groupID + "/devices";
    return sendRequest(uri, 'GET', req, res);
});

/**
 * POST DEVICE INFO
 * */

router.post('/:groupID/devices', (req, res, next) => {
    const groupID = req.params.groupID;
    const uri = awsURL + "/user/" + groupID + "/devices";
    return sendRequest(uri, 'POST', req, res);
});

/**
 * GET LOGS
 * */

router.get('/:groupID/logs', (req, res, next) => {
    const groupID = req.params.groupID;
    const uri = awsURL + "/user/" + groupID + "/logs";
    return sendRequest(uri, 'GET', req, res);
});

module.exports = router;
