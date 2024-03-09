# LüftenMonitor (Mark 1)

<img src="./assets/2024-03-09-v2.png" alt="LüftenMonitor" width="378px" />

The LüftenMonitor is a device that measures the CO2 concentration in the air and indicates when it is time to open a window to let fresh air in.

Lüften is the German word for airing or ventilating a room.

## Specifications

### Hardware

- Pico W by Raspberry Pi Foundation ([Pinout](https://www.raspberrypi.com/documentation/microcontrollers/raspberry-pi-pico.html))
- [SGP30 MOX Gas Sensor](https://learn.adafruit.com/adafruit-sgp30-gas-tvoc-eco2-mox-sensor/overview) by Adafruit
- [SHT40 Humidity and Temperature Sensor](https://learn.adafruit.com/adafruit-sht40-temperature-humidity-sensor/overview) by Adafruit
- [Adafruit ThinkInk 1.54" Tri-Color eInk / ePaper Display with SRAM - 200x200 with SSD1681 and EYESPI](https://learn.adafruit.com/adafruit-1-54-eink-display-breakouts)

### Software & Libraries

- [CircuitPython 8.2.10](https://github.com/adafruit/circuitpython/releases/tag/8.2.10)
- [Adafruit CircuitPython SGP30 driver](https://github.com/adafruit/Adafruit_CircuitPython_SGP30)
- [Adafruit CircuitPython SHT4x driver](https://github.com/adafruit/Adafruit_CircuitPython_SHT4x)
- [Adafruit CircuitPython SSD1681 library for SSD1681 driver](https://github.com/adafruit/Adafruit_CircuitPython_SSD1681)
- [Adafruit CircuitPython Display_Text library](https://github.com/adafruit/Adafruit_CircuitPython_Display_Text)
- [Adafruit CircuitPython Connection Manager library](https://github.com/adafruit/Adafruit_CircuitPython_ConnectionManager)
- [Adafruit CircuitPython Requests library](https://github.com/adafruit/Adafruit_CircuitPython_Requests)
