const awsIot = require('aws-iot-device-sdk');
const dateFormat = require('dateformat');

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


/* EVENTS DEFINITION */
const eventMap = new Map([
        [2, "connection to mysql db failed"],
        [3, "an insert query failed"],
        [4, "a reading query failed"],
        [5, "internal server error"],
        [6, "app started"],
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
                console.log('aws device:', ' connected'.green);
                this.device.logEvent(6);
                this.device.subscribe('pl19/notification');
            });

        this.device
            .on('offline', () => {
                console.log('aws device:', 'offline'.red);
            });

        this.device
            .on('reconnect', () => {
                console.log('aws device:', 'reconnect'.yellow);
            });

        this.device
            .on('close', () => {
                console.log('aws device:', 'close'.blue);
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
                        device_mac: macAddress,
                        event: {message: 'ping replay', sequence: notification.event.sequence}
                    };
                    this.device.publish('pl19/event', JSON.stringify(reply));
                    console.log("ping reply:".green, reply.event.sequence);
                }
            });

    }


    logEvent = function (eventId) {
        if (eventMap.has(eventId)) {
            let reply = {
                event_id: eventId,
                timestamp: dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss.f."),
                device_mac: macAddress,
                event: eventMap.get(eventId)
            };
            this.device.publish('pl19/event', JSON.stringify(reply));
            console.log('published event:'.green, eventId);
        } else {
            console.log('evento non trovato:'.red, eventId);
        }
    }

}

// this is a Singletone because this file runs once and node store the value exported in a cache
module.exports = new AWSClient();

