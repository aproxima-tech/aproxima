# LüftenMonitor (Mark 1)

<img src="./assets/2024-03-09-v3.png" alt="LüftenMonitor" width="378px" />

The LüftenMonitor is a device that measures the CO2 concentration in the air and indicates when it is time to open a window to let fresh air in.

Lüften is the German word for airing or ventilating a room.

## Specifications

### Hardware

- Pico W by Raspberry Pi Foundation ([Pinout](https://www.raspberrypi.com/documentation/microcontrollers/raspberry-pi-pico.html))
- [SCD-41 CO2 sensor](https://learn.adafruit.com/adafruit-scd-40-and-scd-41) by Adafruit
- [Adafruit ThinkInk 1.54" Tri-Color eInk / ePaper Display with SRAM - 200x200 with SSD1681 and EYESPI](https://learn.adafruit.com/adafruit-1-54-eink-display-breakouts)

### Software & Libraries

- [CircuitPython 8.2.10](https://github.com/adafruit/circuitpython/releases/tag/8.2.10)
- [Adafruit CircuitPython SCD4X driver](https://github.com/adafruit/Adafruit_CircuitPython_SCD4X)
- [Adafruit CircuitPython SSD1681 library for SSD1681 driver](https://github.com/adafruit/Adafruit_CircuitPython_SSD1681)
- [Adafruit CircuitPython Display_Text library](https://github.com/adafruit/Adafruit_CircuitPython_Display_Text)
