#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <Arduino_JSON.h>
#include <SoftwareSerial.h>

const char* ssid = "Inecrft";
const char* password = "inecrft47";

//IP address with path
const char* serverName = "http://192.168.222.212:3222/api";
const char* postHeight = "http://192.168.222.212:3222/api/postHeight";
const char* serverStatus = "http://192.168.222.212:3222/api/status";

unsigned long lastTime = 0;
// Set timer to 5 seconds (5000)
unsigned long timerDelay = 5000;

// Pins
const int pumpModePin = 0;
const int pumpTogglePin = 16;

EspSoftwareSerial::UART testSerial;
char buf[50];
int idx = 0;
String sensorReadings;
String waterHeight = "-1";

void setup() {
  testSerial.begin(115200, EspSoftwareSerial::SWSERIAL_8N1, D5, D6, false, 95, 11);
  Serial.begin(115200);

  pinMode(pumpModePin, OUTPUT);
  pinMode(pumpTogglePin, OUTPUT);

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
    buf[idx] = testSerial.read();
    // Serial.print(buf[idx]);
    if (buf[idx] == '\n')
    {
      waterHeight = "";
      for (int i = 0; i < idx; i++)
      {
        waterHeight += String(buf[i]);
      }
      idx = 0;
    }
    else
    {
      idx++;
    }
    yield();
  }
  if ((millis() - lastTime) > timerDelay) {
    //Check WiFi connection status
    if(WiFi.status() == WL_CONNECTED){

      sensorReadings = httpGETRequest(serverStatus);
      // Serial.println(sensorReadings);
      JSONVar myObject = JSON.parse(sensorReadings);

      //check the type of the var
      if (JSON.typeof(myObject) == "undefined") {
        Serial.println("Parsing input failed!");
        return;
      }
    
      Serial.print("JSON object = ");
      Serial.println(myObject);
    
      //an array of all the keys in the object
      JSONVar keys = myObject.keys(); // {pumpMode, waterHeight, pumpStatus}
    
      for (int i = 0; i < keys.length(); i++) {
        JSONVar value = myObject[keys[i]];
        Serial.print(keys[i]);
        Serial.print(" = ");
        Serial.println(value);
      }

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
      
      //IP address with path
      http.begin(client, postHeight);

      // Specify content-type header
      http.addHeader("Content-Type", "application/json");
      // Data to send with HTTP POST
      String httpRequestData = "{\"api_key\":\"tPmAT5Ab3j7F9\",\"sensor\":\"BME280\",\"height\":\""+waterHeight+"\"}";
      Serial.println(httpRequestData);
      // Send HTTP POST request
      int httpResponseCode = http.POST(httpRequestData);
     
      Serial.print("HTTP POST Response code: ");
      Serial.println(httpResponseCode);
        
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