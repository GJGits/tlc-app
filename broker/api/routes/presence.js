const express = require("express");
const router = express.Router();
const fs = require('fs');
const MqttHandler = require("../mqtt/mqtt_client");
// const awsClient = require("../mqtt/aws_mqtt_client");

const client = new MqttHandler('presence', ['presence'], (topic, message) => {
    console.log(`received a message: topic = ${topic}, message = ${message}`);
    let strMessage = message.toString();
    let idTokens = strMessage.split(':');
    if (idTokens[0] === 's') {
        writeToFile(strMessage, '/../db/sens.json', false);
    } else {
        writeToFile(strMessage, '/../db/acts.json', true);
    }
});
client.connect();

const writeToFile = function (id, path, act) {
    // se id non presente
    let elementsBuffered = fs.readFileSync(__dirname + path);
    let elements = JSON.parse(elementsBuffered);
    let found = false;
    for (let element of elements) {
        if (element.id === id)
            found = true;
    }
    if (!found) {
        act ? elements.push({id: id, status: 'OFF'}) : elements.push({id: id});
        fs.writeFileSync(__dirname + path, JSON.stringify(elements));
        console.log('scritto file: ' + JSON.stringify(elements));
    }
};

module.exports = router;
