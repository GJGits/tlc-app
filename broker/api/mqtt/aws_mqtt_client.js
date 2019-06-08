var awsIot = require('aws-iot-device-sdk');

//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourCustomEndpoint>'
// with a unique client identifier and custom host endpoint provided in AWS IoT.
// NOTE: client identifiers must be unique within your AWS account; if a client attempts 
// to connect with a client identifier which is already in use, the existing 
// connection will be terminated.
//
var device = awsIot.device({
    keyPath: __dirname + '/PL-student.private.key',
    certPath: __dirname + '/PL-student.cert.pem',
    caPath: __dirname + '/root-CA.crt',
    clientId: 'sdk-nodejs-1',
    host: 'a3cezb6rg1vyed-ats.iot.us-west-2.amazonaws.com'
});

//
// Device is an instance returned by mqtt.Client(), see mqtt.js for full
// documentation.
//
device
    .on('connect', function () {
        console.log('connect');
        device.subscribe('pl19/notification');
        device.publish('pl19/event', JSON.stringify({test_data: 'NodeJS server connected...'}));
    });

device
    .on('offline', function () {
        console.log('offline');
    });

device
    .on('reconnect', function () {
        console.log('reconnect');
    });

device
    .on('close', function () {
        console.log('close');
    });

device
    .on('message', function (topic, payload) {
        console.log('message', topic, payload.toString());
    });

device
    .on('error', function(err) {
        console.log(err);
    });
