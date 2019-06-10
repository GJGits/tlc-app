const express = require("express");
const router = express.Router();
const request = require("request");
const awsURL = "http://ec2-34-220-162-82.us-west-2.compute.amazonaws.com:5002";

// forward auth to the server and send back response to user
router.post('/', (req, res, next) => {
    const clientOptions = {
        uri: awsURL + "/auth",
        body: JSON.stringify(req.body),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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
