#include <FS.h>                   //this needs to be first, or it all crashes and burns...
#include <ESP8266WiFi.h>          //https://github.com/esp8266/Arduino
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>          //https://github.com/tzapu/WiFiManager
#include <EEPROM.h>

char mqtt_server[40];
bool shouldSaveConfig = false;

//callback notifying us of the need to save config
void saveConfigCallback () {
  Serial.println("Should save config");
  shouldSaveConfig = true;
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  // id/name placeholder/prompt default length
  WiFiManagerParameter custom_mqtt_server("server", "192.168.X.X", mqtt_server, 40);
  WiFiManager wifiManager;
  //reset saved settings
  wifiManager.resetSettings();

  //set config save notify callback
  wifiManager.setSaveConfigCallback(saveConfigCallback);
  saveConfigCallback();

  WiFiManagerParameter custom_text("<input type='text' id='broker-ip' name='broker-ip' placeholder='192.168.X.X' value='ciao'>");
  WiFiManagerParameter ip_script("<script type='text/javascript'>fetch('http://localhost:3000/ip').then(response => response.text()).then((resp) => {document.getElementById('broker-ip').value = resp});</script>");
  wifiManager.addParameter(&custom_text);
  wifiManager.addParameter(&ip_script);

  //fetches ssid and pass and tries to connect
  //if it does not connect it starts an access point with the specified name
  //here  "AutoConnectAP"
  //and goes into a blocking loop awaiting configuration
  if (!wifiManager.autoConnect("AutoConnectAP", "password")) {
    Serial.println("failed to connect and hit timeout");
    delay(3000);
  }

  //if you get here you have connected to the WiFi
  Serial.println("connected...yeey :)");

  //read updated parameters
  const char* saved_mqtt = custom_text.getValue();

  //save the custom parameters to EEPROM
    const char* brokip = wifiManager.getBrokerIp();
    Serial.println("mqtt ip:");
    Serial.println(brokip);
    EEPROM.begin(512);
    int eeAddress = 0;   //Location we want the data to be put.
    //One simple call, with the address first and the object second.
    EEPROM.put(eeAddress, brokip);
    EEPROM.commit();
    Serial.println("scritto broker-ip in eeprom!");
    char* read_value;
    EEPROM.get(eeAddress, read_value);
    Serial.println("read from eeprom");
    Serial.println(read_value);
}

void loop() {
  // put your main code here, to run repeatedly:

}
