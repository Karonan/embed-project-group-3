#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <Arduino_JSON.h>
#include <SoftwareSerial.h>

const char* ssid = "Inecrft";
const char* password = "inecrft47";

//IP address with path
const char* serverName = "http://35.187.230.199:3222/api";
const char* postHeight = "http://35.187.230.199:3222/api/postHeight";
const char* serverStatus = "http://35.187.230.199:3222/api/status";
const char* toggle = "http://35.187.230.199:3222/api/toggle";

unsigned long lastTime = 0;
// Set timer to 1 seconds (1000)
unsigned long timerDelay = 500;

// Pins
const int pumpModePin = 0;
const int pumpTogglePin = 16;
const int pumpStatus = 13;

EspSoftwareSerial::UART testSerial;
String sensorReadings;
String waterHeight = "-1";

void setup() {
  testSerial.begin(115200, EspSoftwareSerial::SWSERIAL_8N1, D5, D6, false, 95, 11);
  Serial.begin(115200);

  pinMode(pumpModePin, OUTPUT);
  pinMode(pumpTogglePin, OUTPUT);
  pinMode(pumpStatus, INPUT);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
 
  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");
}

void loop() {
  //Send an HTTP POST request
  while (testSerial.available() > 0)
  {
    char buf = testSerial.read();
    int test = (int)(buf[idx]);
    waterHeight = String(test);
    yield();
  }
  if ((millis() - lastTime) > timerDelay) {
    //Check WiFi connection status
    if(WiFi.status() == WL_CONNECTED){

      sensorReadings = httpGETRequest(serverStatus);
      JSONVar myObject = JSON.parse(sensorReadings);

      //check the type of the var
      if (JSON.typeof(myObject) == "undefined") {
        Serial.println("Parsing input failed!");
        return;
      }
    
      Serial.print("JSON GET object = ");
      Serial.println(myObject);
    
      //an array of all the keys in the object
      JSONVar keys = myObject.keys(); // {pumpMode, waterHeight, pumpStatus, waterTreshold}

      testSerial.write(char(myObject[keys[3]])); // send waterTreshold to STM

      if (int(myObject[keys[0]]) == -1) // Pump Mode AUTO
      {
        digitalWrite(pumpModePin, LOW);
        digitalWrite(pumpTogglePin, LOW);
      }
      else if (int(myObject[keys[2]]) == -1)  // Pump Manual OFF
      {
        digitalWrite(pumpModePin, HIGH);
        digitalWrite(pumpTogglePin, LOW);
      }
      else  // Pump Manual ON
      {
        digitalWrite(pumpModePin, HIGH);
        digitalWrite(pumpTogglePin, HIGH);
      }
      
      WiFiClient client;
      HTTPClient http;

      if (int(myObject[keys[0]]) == -1 && ((digitalRead(pumpStatus) == LOW && int(myObject[keys[2]]) == -1) || (digitalRead(pumpStatus) == HIGH && int(myObject[keys[2]]) != -1)))
      {
        http.begin(client, toggle);
        http.addHeader("Content-Type", "application/json");
        int httpResponseCode = http.POST("");        
        http.end();
      }

      //IP address with path
      http.begin(client, postHeight);

      // Specify content-type header
      http.addHeader("Content-Type", "application/json");
      // Data to send with HTTP POST
      String httpRequestData = "{\"api_key\":\"tPmAT5Ab3j7F9\",\"sensor\":\"HC-SR04\",\"height\":\""+waterHeight+"\"}";
      Serial.print("POST object");
      Serial.println(httpRequestData);
      // Send HTTP POST request
      int httpResponseCode = http.POST(httpRequestData);
     
      Serial.print("HTTP POST Response code: ");
      Serial.println(httpResponseCode);
      Serial.println("");
        
      // Free resources
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}

String httpGETRequest(const char* serverName) {
  WiFiClient client;
  HTTPClient http;
    
  // Your IP address with path
  http.begin(client, serverName);
  
  // Send HTTP GET request
  int httpResponseCode = http.GET();
  
  String payload = "{}"; 
  
  if (httpResponseCode>0) {
    Serial.print("HTTP GET Response code: ");
    Serial.println(httpResponseCode);
    payload = http.getString();
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  // Free resources
  http.end();

  return payload;
}