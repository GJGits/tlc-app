#include<ESP8266WiFi.h>
#include <EspMQTTClient.h>
#include "DHT.h"
#include "SoftwareSerial.h"

#include <DNSServer.h>            //Local DNS Server used for redirecting all requests to the configuration portal
#include <ESP8266WebServer.h>     //Local WebServer used to serve the configuration portal
#include <WiFiManager.h>  

//#define DHTPIN D8     // Digital pin connected to the DHT sensor
#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
uint8_t DHTPIN = D1;
const char *mqtt_server = "192.168.1.5";
DHT dht(DHTPIN, DHTTYPE);
void onConnectionEstablished();

EspMQTTClient client(
   "192.168.1.5",
   1883,
   "dispname" 
);

void onConnectionEstablished(){
  // Execute delayed instructions
  client.executeDelayed(5 * 1000, []() {
    client.publish("presence", "s:" + String(WiFi.macAddress()));
  });
}



void setup() {

  WiFiManager wifiManager;
  wifiManager.autoConnect("admin", "admin"); //192.168.4.1,

  Serial.begin(115200);
  WiFi.setPhyMode(WIFI_PHY_MODE_11N);

  pinMode(DHTPIN, INPUT);

  dht.begin();    

  int t0 = millis();
  int t1 = millis();
  int tim = t1 - t0;
  Serial.println("Wi-Fi Connected: " + String(tim));
 

float h = dht.readHumidity();
  float t = dht.readTemperature();

  // Compute heat index in Celsius (isFahreheit = false)
  float hic = dht.computeHeatIndex(t, h, false);
 

    if (isnan(h) || isnan(t)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  } 

  //client.loop();

  
  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%  Temperature: "));
  Serial.print(t);
  Serial.print(hic);
  Serial.print(F("°C "));
  
   Serial.println();
   Serial.print("MAC: ");
   Serial.println(WiFi.macAddress());
   
   client.publish("presence", "s:" + String(WiFi.macAddress()));
  client.publish("readings","t="+String(t)+", h="+String(h)+", index="+String(hic)+", id=s:" + String(WiFi.macAddress()));

 delay(300);
 Serial.println(String(WiFi.SSID()));
 Serial.println(String(WiFi.psk()));
  delay(300);
 ESP.deepSleep(5e6);

  

}


void loop() {
  }
