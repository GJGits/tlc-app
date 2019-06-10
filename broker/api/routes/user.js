const express = require("express");
const router = express.Router();
const request = require("request");
const awsURL = "http://ec2-34-220-162-82.us-west-2.compute.amazonaws.com:5002";

/**
 * GET GROUP INFO
 * */

router.get('/:groupID', (req, res, next) => {
    console.log(req.header("authorization").split(" ")[1]);
    const groupID = req.params.groupID;
    const clientOptions = {
        uri: awsURL + "/user/" + groupID,
        body: JSON.stringify(req.body),
        method: 'GET',
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
});

module.exports = router;
