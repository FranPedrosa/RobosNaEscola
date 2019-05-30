Blockly.Arduino.serial_print = function() {
  var content = Blockly.Arduino.valueToCode(this, 'CONTENT', Blockly.Arduino.ORDER_ATOMIC) || '0'
  //content = content.replace('(','').replace(')','');

  Blockly.Arduino.setups_['setup_serial_' + profile.default.serial] = 'Serial.begin(' + profile.default.serial + ');\n';

  var code = 'Serial.print(' + content + ');\n';
  return code;
};

Blockly.Arduino.ESP32_OTA_Server = function() {
  //var content = Blockly.Arduino.valueToCode(this, 'CONTENT', Blockly.Arduino.ORDER_ATOMIC) || '0'
  //content = content.replace('(','').replace(')','');

  Blockly.Arduino.definitions_['define_pins_WIFIServer_OTA'] = '#include <ArduinoOTA.h>\n#include <WiFi.h>\n#include <WebServer.h>\n#define LED_BUILTIN 2\n#define D1 23\n#define D2 22\n#define D3 21\n#define D4 19\nconst char *ssid = "ESP32 Access Point";\nconst char *password = "your-password";\nWebServer server(80);\nvoid handleRoot() {\n  server.send(200, "text/plain", "Hello from ESP32 !");\n}\nvoid handleNotFound() {\n  String message = "File Not Found\\n\\n";\n  message += "URI: ";\n  message += server.uri();\n  message += "\\nMethod: ";\n  message += (server.method() == HTTP_GET) ? "GET" : "POST";\n  message += "\\nArguments: ";\n  message += server.args();\n  message += "\\n";\n  for (uint8_t i = 0; i < server.args(); i++) {\n    message += " " + server.argName(i) + ": " + server.arg(i) + "\\n";\n  }\n  server.send(404, "text/plain", message);\n}';
  
  Blockly.Arduino.setups_['setup_serial_' + profile.default.serial] = '	pinMode(LED_BUILTIN, OUTPUT);\n  Serial.begin(115200);\n  Serial.println("Booting");\n  WiFi.softAP(ssid, password);\n  Serial.print("Access Point ");\n  Serial.print(ssid);\n  Serial.println(" started");\n  Serial.print("IP address:   ");\n  Serial.println(WiFi.softAPIP());\n  server.on("/", handleRoot);\n  server.onNotFound(handleNotFound);\n  server.on("/ligaled", []() {\n    server.send(200, "text/plain", "ligou");\n    digitalWrite(LED_BUILTIN, HIGH);\n  });\n  server.on("/desligaled", []() {\n    server.send(200, "text/plain", "apagou");\n    digitalWrite(LED_BUILTIN, LOW);\n  });\n  server.begin();\n  Serial.println("HTTP server started");\n  ArduinoOTA.onStart([]() {\n    String type;\n    if (ArduinoOTA.getCommand() == U_FLASH) {\n      type = "sketch";\n    } else {\n      type = "filesystem";\n    }\n    Serial.println("Start updating " + type);\n  });\n  ArduinoOTA.onEnd([]() {\n    Serial.println("\\nEnd");\n  });\n  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {\n    Serial.printf("Progress: %u%%\\r", (progress / (total / 100)));\n  });\n  ArduinoOTA.onError([](ota_error_t error) {\n    Serial.printf("Error[%u]: ", error);\n    if (error == OTA_AUTH_ERROR) {\n      Serial.println("Auth Failed");\n    } else if (error == OTA_BEGIN_ERROR) {\n      Serial.println("Begin Failed");\n    } else if (error == OTA_CONNECT_ERROR) {\n      Serial.println("Connect Failed");\n    } else if (error == OTA_RECEIVE_ERROR) {\n      Serial.println("Receive Failed");\n    } else if (error == OTA_END_ERROR) {\n      Serial.println("End Failed");\n    }\n  });\n  ArduinoOTA.begin();\n  Serial.println("Ready");\n';

  var code = 'ArduinoOTA.handle();\nserver.handleClient();\n';
  return code;
};
