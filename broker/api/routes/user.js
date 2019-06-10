const express = require("express");
const router = express.Router();
const request = require("request");
const awsURL = "http://ec2-34-220-162-82.us-west-2.compute.amazonaws.com:5002";

/**
 * GET GROUP INFO
 * */

router.get('/:groupID', (req, res, next) => {
    const groupID = req.params.groupID;
    console.log(req.headers);
    const clientOptions = {
        uri: awsURL + "/user/" + groupID,
        body: JSON.stringify(req.body),
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
});

module.exports = router;
