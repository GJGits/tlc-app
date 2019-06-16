const awsIot = require('aws-iot-device-sdk');
const dateFormat = require('dateformat');

/* MAC ADDRESS DEFINITION */
/*
const mac = require('getmac');
let macAddress;
mac.getMac({iface: 'eth0'}, (err, address) => {
    if (err) throw err;
    macAddress = address;
});

 */

/* EVENTS DEFINITION */
const eventMap = new Map([
        [2, "connection to mysql db failed"],
        [3, "an insert query failed"],
        [4, "a reading query failed"],
        [5, "internal server error"],
        [6, "some message"],
        [7, "some message"],
        [8, "some message"]
    ]
);

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
                let notification = JSON.parse(payload);
                if (notification.event_id === 0) {
                    let reply = {
                        event_id: 1,
                        timestamp: dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss.F"),
                        device_mac: "01:01:01:01:01:01",
                        event: {message: 'ping replay', sequence: notification.event.sequence}
                    };
                    this.device.publish('pl19/event', JSON.stringify(reply));
                    console.log("emitted ping reply:", JSON.stringify(reply));
                }
            });

    }

    logEvent(eventId) {
        if (eventMap.has(eventId)) {
            let reply = {
                event_id: eventId,
                timestamp: dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss.f."),
                device_mac: "01:01:01:01:01:01",
                event: eventMap.get(eventId)
            };
        }
    }

}

// this is a Singletone because this file runs once and node store the value exported in a cache
module.exports = new AWSClient();

