#include <ESP8266WiFi.h>          // ESP8266 Core WiFi Library 
#include <DNSServer.h>            // Local DNS Server used for redirecting all requests to the configuration portal
#include <ESP8266WebServer.h>     // Local WebServer used to serve the configuration portal
#include <WiFiManager.h>          // https://github.com/tzapu/WiFiManager WiFi Configuration Magic
#include <EspMQTTClient.h>
#include <EEPROM.h>
#include "DHT.h"
#include "SoftwareSerial.h"

#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
uint8_t DHTPIN = D2;
DHT dht(DHTPIN, DHTTYPE);
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
  Serial.begin(115200);
  pinMode(DHTPIN, INPUT);
  dht.begin(); 
  Serial.println("app start...");
  WiFi.setPhyMode(WIFI_PHY_MODE_11N);
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
  if (!wifiManager.autoConnect("AutoConnectAP", "password")) {
    Serial.println("failed to connect and hit timeout");
    delay(3000);
  }
  const char* ssid = wifiManager.getSSID();
  const char* password = wifiManager.getPassword();
  const char* brokip = wifiManager.getBrokerIp();
  Serial.println("Wi-Fi connected: " + String(ssid) + " " + String(password));
  client = new EspMQTTClient(
  ssid,                 // Wifi ssid
  password,                 // Wifi password
  onConnectionEstablished,// MQTT connection established callback
  brokip                    // MQTT broker ip
);
}

void onConnectionEstablished()
{
  float h = 0;
  float t = 0;
  float hic = 0;

  while(t == 0 || isnan(t)) {
  h = dht.readHumidity();
  t = dht.readTemperature();
  // Compute heat index in Celsius (isFahreheit = false)
  hic = dht.computeHeatIndex(t, h, false);
  Serial.println(t);
  delay(100);
  }
  
    client->publish("presence", "s:" + String(WiFi.macAddress()));
    client->publish("readings","t="+String(t)+", h="+String(h)+", index="+String(hic)+", id=s:" + String(WiFi.macAddress()));

    Serial.print(F("Humidity: "));
    Serial.print(h);
    Serial.print(F("%  Temperature: "));
    Serial.print(t);
    Serial.print(hic);
    Serial.print(F("°C "));

    delay(100);
   // 

}

void loop(){
  client->loop();
}
