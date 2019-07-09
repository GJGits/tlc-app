#include <FS.h>

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  bool success = SPIFFS.begin();
  if (success) {
    Serial.println("\nFile system mounted with success");
  } else {
    Serial.println("\nError mounting the file system");
  }
}

void loop() {
  // put your main code here, to run repeatedly:

}
