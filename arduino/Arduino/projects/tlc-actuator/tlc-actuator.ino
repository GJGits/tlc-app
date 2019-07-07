#include <ESP8266WiFi.h>          // ESP8266 Core WiFi Library 
#include <DNSServer.h>            // Local DNS Server used for redirecting all requests to the configuration portal
#include <ESP8266WebServer.h>     // Local WebServer used to serve the configuration portal
#include <WiFiManager.h>          // https://github.com/tzapu/WiFiManager WiFi Configuration Magic
#include <EspMQTTClient.h>
#include <ESP8266HTTPClient.h>

const int util = 0;             //led di stato che dovrebbe essere collegato tra GPIO0 e GND per mostrare l'utilizzo dell'ESP8266, ma che non ho utilizzato.
const int led = D2;             // led da controllare via Wifi, collegato tra GPIO2 e GND
EspMQTTClient *client;
void onConnectionEstablished();

void setup() {
  
  // put your setup code here, to run once:
  pinMode(led, OUTPUT);
  digitalWrite(led, LOW);
  Serial.begin(115200);
  Serial.println("app start...");
  WiFiManager wifiManager;
  wifiManager.autoConnect("admin", "TLC-AP01"); // AP-NAME, AP-PASSWORD (8 to 63 ASCII-encoded characters in the range of 32 to 126 (decimal)
  const char* ssid = wifiManager.getSSID();
  const char* password = wifiManager.getPassword();
  Serial.println("Wi-Fi connected: " + String(ssid) + " " + String(password));
  HTTPClient http;
  http.begin("http://gjcode-vb:3000/device-info/ip"); // da cambiare con raspberrypi
  int code = http.GET();
  if (code < 0) {
  Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(code).c_str());
  }
  String payload = http.getString();
  http.end();
  Serial.println("response code: " + String(code));
  Serial.println("IP rasp:" + payload);
  const char* a=payload.c_str();
  client = new EspMQTTClient(
  ssid,                 // Wifi ssid
  password,                 // Wifi password
  onConnectionEstablished,// MQTT connection established callback
  ("" + http.getString()).c_str()                    // MQTT broker ip
);
}

void onConnectionEstablished()
{
  // Execute delayed instructions
  client->executeDelayed(5 * 1000, []() {
    client->publish("presence", "ca:" + String(WiFi.macAddress()));
  });

  //client.subscribe("command", [](const String & payload) {
  client->subscribe("command-ca:"+ String(WiFi.macAddress()), [](const String & payload){ 
    if( payload == "off" ){
      digitalWrite(led, LOW);
      Serial.println("entro in off");
      }
     else {
      Serial.println("entro in on");
      digitalWrite(led, HIGH);
      } 
    
  });
}

void loop(){
  client->loop();
}
