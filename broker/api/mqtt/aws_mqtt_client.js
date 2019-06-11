const awsIot = require('aws-iot-device-sdk');

class AWSClient {

    constructor() {
        this.device = AWSClient.initializeDevice();
        this.setConnectionStrategy();
        this.setErrorHandler();
        this.startPingService();
    }

    static initializeDevice() {
        return awsIot.device({
            keyPath: __dirname + '/PL-student.private.key',
            certPath: __dirname + '/PL-student.cert.pem',
            caPath: __dirname + '/root-CA.crt',
            clientId: 'sdk-nodejs-*',
            host: 'a3cezb6rg1vyed-ats.iot.us-west-2.amazonaws.com'
        });
    }

    setConnectionStrategy() {

        this.device
            .on('connect', () => {
                console.log('aws device: ', ' connected');
                this.device.subscribe('pl19/notification');
            });

        this.device
            .on('offline', () => {
                console.log('offline');
            });

        this.device
            .on('reconnect', () => {
                console.log('reconnect');
            });

        this.device
            .on('close', () => {
                console.log('close');
            });


    }

    setErrorHandler() {
        this.device
            .on('error', (err) => {
                console.log(err);
            });
    }

    startPingService() {
        this.device
            .on('message', (topic, payload) => {
                console.log('message', topic, payload.toString());
            });

    }
}
// this is a Singletone because this file runs once and node store the value exported in a cache
module.exports = new AWSClient();

