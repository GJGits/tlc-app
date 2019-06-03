const mqtt = require('mqtt');

class MqttHandler {

    constructor(handlerName, subTopics, subToWriteCallback) {
        this.handlerName = handlerName;
        this.subTopics = subTopics;
        this.subToWriteCallback = subToWriteCallback;
        this.mqttClient = null;
        this.host = 'mqtt://localhost';
    }

    connect() {
        // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
        this.mqttClient = mqtt.connect(this.host);

        // Mqtt error calback
        this.mqttClient.on('error', (err) => {
            console.log(err);
            this.mqttClient.end();
            console.log(`${this.handlerName} end.`)
        });

        // Connection callback
        this.mqttClient.on('connect', () => {
            console.log(`${this.handlerName} client connected`);
        });

        // mqtt subscriptions
        for (let i = 0; i < this.subTopics.length; i++) {
            // todo: check qos options
            this.mqttClient.subscribe(this.subTopics[i], {qos: 0});
        }


        // When a message arrives, console.log it
        this.mqttClient.on('message', this.subToWriteCallback);

        this.mqttClient.on('close', () => {
            console.log(`${this.handlerName} client disconnected`);
        });
    }

    // Sends a mqtt message to topic
    sendMessage(topic, message) {
        console.log(`${this.handlerName} client: published ${message} on topic: ${topic}`);
        this.mqttClient.publish(topic, message);
    }
}

module.exports = MqttHandler;
