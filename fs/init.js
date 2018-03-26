/*
 * Copyright (c) 2014-2017 Cesanta Software Limited
 * All rights reserved
 *
 * This example demonstrates how to use mJS DHT library API
 * to get data from DHTxx temperature and humidity sensors.
 *
 * DON'T FORGET TO SET YOUR I2C PINS IN THE MONGOOSE CONFIG!
 * Example:  `mos config-set i2c.scl_gpio=22 i2c.sda_gpio=23`
 */

// Load Mongoose OS API
load('api_timer.js');
load('api_dht.js');
load('api_arduino_ssd1306.js');

// Initialize Adafruit_SSD1306 library (I2C)
let oled = Adafruit_SSD1306.create_i2c(4 /* RST GPIO */, Adafruit_SSD1306.RES_128_32);
// Initialize the display.
oled.begin(Adafruit_SSD1306.SWITCHCAPVCC, 0x3C, false /* reset */);
oled.display();

let showStr = function(d, tempLabel, tempValue, tempUnit, humLabel, humValue, humUnit) {
  d.clearDisplay();
  d.setTextColor(Adafruit_SSD1306.WHITE);
  //d.setCursor(d.width() / 4, d.height() / 4);
  d.setCursor(0,0);
  d.setTextSize(1);
  d.write(tempLabel + " "+ tempValue + tempUnit + "\n");
  d.setTextSize(1);
  d.write(humLabel + " " + humValue + humUnit);
  d.display();
};


// GPIO pin which has a DHT sensor data wire connected
let pin = 16;

// Initialize DHT library
let dht = DHT.create(pin, DHT.DHT11);

// This function reads data from the DHT sensor every 2 second
Timer.set(2000 /* milliseconds */, Timer.REPEAT, function() {
  let t = dht.getTemp();
  let h = dht.getHumidity();

  if (isNaN(h) || isNaN(t)) {
    print('Failed to read data from sensor');
    return;
  }
  
  
  let degreeSymbol = "\xF7";
  //let foo = chr(0x7F);
  //print(degreeSymbol.charCodeAt(0));
  //let o  = JSON.stringify(t) + degreeSymbol + "C";
  let displayTemperature = "Temperatur:";
  let displayTemperatureValue = JSON.stringify(t);
  let displayTemperatureUnit = degreeSymbol + "C";
  let displayHumidity = "Luftfeuchtigkeit:";
  let displayHumitdiyValue = JSON.stringify(h);
  let displayHumidityUnit = "%";
  showStr(oled, displayTemperature, displayTemperatureValue, displayTemperatureUnit,
    displayHumidity, displayHumitdiyValue, displayHumidityUnit);
  print('Temperature:', t, '*C');
  print('Humidity:', h, '%');
}, null);
