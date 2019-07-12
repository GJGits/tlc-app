#include <FS.h>                   //this needs to be first, or it all crashes and burns...
#include <ESP8266WiFi.h>          // ESP8266 Core WiFi Library 
#include <DNSServer.h>            // Local DNS Server used for redirecting all requests to the configuration portal
#include <ESP8266WebServer.h>     // Local WebServer used to serve the configuration portal
#include <WiFiManager.h>          // https://github.com/tzapu/WiFiManager WiFi Configuration Magic
#include <EspMQTTClient.h>
#include <EEPROM.h>
#include "SoftwareSerial.h"
#include <ArduinoJson.h>          //https://github.com/bblanchon/ArduinoJson

const int util = 0;             //led di stato che dovrebbe essere collegato tra GPIO0 e GND per mostrare l'utilizzo dell'ESP8266, ma che non ho utilizzato.
const int led = 2;             // led da controllare via Wifi, collegato tra GPIO2 e GND
EspMQTTClient *client;
char mqtt_server[40];
bool shouldSaveConfig = false;
void onConnectionEstablished();

//callback notifying us of the need to save config
void saveConfigCallback () {
  Serial.println("Should save config");
  shouldSaveConfig = true;
}
void setup() {

  // put your setup code here, to run once:
  pinMode(led, OUTPUT);
  digitalWrite(led, LOW);
  Serial.begin(115200);
  Serial.println("app start...");
  //clean FS, for testing
  //SPIFFS.format();
  //read configuration from FS json
  Serial.println("mounting FS...");
  if (SPIFFS.begin()) {
    Serial.println("mounted file system");
  } else {
    Serial.println("failed to mount FS");
  }
  WiFi.setPhyMode(WIFI_PHY_MODE_11N);
  WiFiManagerParameter custom_mqtt_server("server", "192.168.X.X", mqtt_server, 40);
  WiFiManager wifiManager;
  //reset saved settings
  //wifiManager.resetSettings();
  //set config save notify callback
  wifiManager.setSaveConfigCallback(saveConfigCallback);
  WiFiManagerParameter custom_text("<input type='text' id='broker-ip' name='broker-ip' placeholder='192.168.X.X' value='ciao'>");
  WiFiManagerParameter ip_script("<script type='text/javascript'>fetch('http://localhost:3000/ip').then(response => response.text()).then((resp) => {document.getElementById('broker-ip').value = resp});</script>");
  wifiManager.addParameter(&custom_text);
  wifiManager.addParameter(&ip_script);
  if (!wifiManager.autoConnect("AutoConnectAP", "password")) {
    Serial.println("failed to connect and hit timeout");
    delay(3000);
  }
  //if you get here you have connected to the WiFi
  Serial.println("WiFi connected!");

  //read updated parameters
  const char* brokip = wifiManager.getBrokerIp();
  const char* ssid = wifiManager.getSSID();
  const char* password = wifiManager.getPassword();

  if (!((brokip != NULL) && (brokip[0] == '\0'))) {
    Serial.println("saving config...");
    DynamicJsonBuffer jsonBuffer;
    JsonObject& json = jsonBuffer.createObject();
    json["mqtt_server"] = brokip;
    File configFile = SPIFFS.open("/config.json", "w");
    if (!configFile) {
      Serial.println("failed to open config file for writing");
    } else {
      json.prettyPrintTo(Serial);
      json.printTo(configFile);
      configFile.close();
      Serial.println("config saved!");
      client = new EspMQTTClient(
        ssid,                 // Wifi ssid
        password,                 // Wifi password
        onConnectionEstablished,// MQTT connection established callback
        brokip                   // MQTT broker ip
      );
    }

  } else {
    Serial.println("reading config file...");
    File configFile = SPIFFS.open("/config.json", "r");
    if (configFile) {
      Serial.println("opened config file");
      size_t size = configFile.size();
      // Allocate a buffer to store contents of the file.
      std::unique_ptr<char[]> buf(new char[size]);
      configFile.readBytes(buf.get(), size);
      DynamicJsonBuffer jsonBuffer;
      JsonObject& json = jsonBuffer.parseObject(buf.get());
      json.printTo(Serial);
      if (json.success()) {
        const char *ip = json["mqtt_server"];
        client = new EspMQTTClient(
          ssid,                 // Wifi ssid
          password,                 // Wifi password
          onConnectionEstablished,// MQTT connection established callback
          ip                    // MQTT broker ip
        );
      }
    }
  }
}

void onConnectionEstablished()
{

  client->publish("presence", "ha:" + String(WiFi.macAddress()));
  client->subscribe("command-ha:" + String(WiFi.macAddress()), [](const String & payload) {
    if ( payload == "off" ) {
      digitalWrite(led, LOW);
      Serial.println("entro in off");
    }
    else {
      Serial.println("entro in on");
      digitalWrite(led, HIGH);
    }

  });

}

void loop() {
  client->loop();
}
