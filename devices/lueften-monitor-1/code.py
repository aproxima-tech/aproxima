# General imports
import time
import board
import busio

# Sensor drivers
import adafruit_sgp30
import adafruit_sht4x

# Display drivers & libraries
import displayio
import adafruit_ssd1681
import terminalio
from adafruit_display_text import label
# Compatibility with both CircuitPython 8.x.x and 9.x.x.
# Remove after 8.x.x is no longer a supported release.
try:
    from fourwire import FourWire
except ImportError:
    from displayio import FourWire

# Wifi and requests
import os
import ssl
import wifi
import socketpool
import adafruit_requests
import json

# TODO: Attempt to connect wifi in a loop as it often fails the first time

#  Release any resources currently in use for the displays
displayio.release_displays()

#  Connect to your SSID
print("Connecting to WiFi...")
wifi.radio.connect(os.getenv('CIRCUITPY_WIFI_SSID'), os.getenv('CIRCUITPY_WIFI_PASSWORD'))
print("Connected to WiFi!")

time.sleep(1)

pool = socketpool.SocketPool(wifi.radio)

time.sleep(1)

#  Prints MAC address to REPL
print("My MAC addr:", [hex(i) for i in wifi.radio.mac_address])
#  Prints IP address to REPL
print("My IP address is", wifi.radio.ipv4_address)

time.sleep(1)

requests = adafruit_requests.Session(pool, ssl.create_default_context())

# Set up i2c for SPG30
i2cCO2 = busio.I2C(board.GP1, board.GP0, frequency=100000)
# Create library object on our I2C port
sgp30 = adafruit_sgp30.Adafruit_SGP30(i2cCO2)

# Set up i2c for SHT40
i2cHumiditiy = busio.I2C(board.GP3, board.GP2, frequency=100000)
# Create library object on our I2C port
sht = adafruit_sht4x.SHT4x(i2cHumiditiy)

# Display setup
BLACK = 0x000000
WHITE = 0xFFFFFF
RED = 0xFF0000
FOREGROUND_COLOR = BLACK
BACKGROUND_COLOR = WHITE
DISPLAY_WIDTH = 200
DISPLAY_HEIGHT = 200

# Set up wiring for Adafruit ThinkInk
spi = busio.SPI(clock=board.GP14, MOSI=board.GP15)  # Define SCK (clock) and MOSI pins
epd_cs = board.GP10   # Chip Select
epd_dc = board.GP13   # Data/Command
epd_reset = board.GP12 # Reset
epd_busy = board.GP11  # Busy
# Create the display bus using the FourWire class
display_bus = FourWire(
    spi, command=epd_dc, chip_select=epd_cs, reset=epd_reset, baudrate=1000000
)

time.sleep(1)

display = adafruit_ssd1681.SSD1681(
    display_bus,
    width=DISPLAY_WIDTH,
    height=DISPLAY_HEIGHT,
    busy_pin=epd_busy,
    highlight_color=0xFF0000,
    rotation=180,
    seconds_per_frame=15,
)


print("SGP30 serial #", [hex(i) for i in sgp30.serial])
sgp30.set_iaq_baseline(0x8973, 0x8AAE)
sgp30.set_iaq_relative_humidity(celsius=22.1, relative_humidity=60)

url = "https://api.aproxima.net/device-data"
headers = {'Content-Type': 'application/json', 'X-API-KEY': os.getenv('CLOUDFLARE_CORE_API_API_KEY') }

while True:
    temperature, relative_humidity = sht.measurements
    temp_text = str(int(temperature))
    hum_text = str(int(relative_humidity))
    print("Temperature: %0.1f C" % temperature)
    print("Humidity: %0.1f %%" % relative_humidity)
    print("eCO2 = %d ppm \t TVOC = %d ppb" % (sgp30.eCO2, sgp30.TVOC))
    sgp30.set_iaq_relative_humidity(celsius=temperature, relative_humidity=relative_humidity)
    print(
        "**** Baseline values: eCO2 = 0x%x, TVOC = 0x%x"
        % (sgp30.baseline_eCO2, sgp30.baseline_TVOC)
    )

    data = {
        "eCO2": sgp30.eCO2,
        "TVOC": sgp30.TVOC
    }
    
    g = displayio.Group()
    # Set a background
    background_bitmap = displayio.Bitmap(DISPLAY_WIDTH, DISPLAY_HEIGHT, 1)
    # Map colors in a palette
    palette = displayio.Palette(1)
    palette[0] = BACKGROUND_COLOR

    # Create a TileGrid with the background and put in the displayio group
    t = displayio.TileGrid(background_bitmap, pixel_shader=palette)
    g.append(t)

    # Display temperature in the top left
    text_temp = label.Label(terminalio.FONT, text=f"{temp_text} C", color=FOREGROUND_COLOR, scale=2)
    text_temp.x = 0  # Adjust as needed
    text_temp.y = 20  # Adjust as needed
    g.append(text_temp)

    # Display humidity in the top right
    text_humidity = label.Label(terminalio.FONT, text=f"{hum_text}%", color=FOREGROUND_COLOR, scale=2)
    text_humidity.x = DISPLAY_WIDTH - text_humidity.bounding_box[2] * 2  # Adjust based on text width
    text_humidity.y = 20  # Adjust as needed
    g.append(text_humidity)

    # Display CO2 ppm value in the middle
    text_co2 = label.Label(terminalio.FONT, text=f"{sgp30.eCO2} ppm", color=FOREGROUND_COLOR, scale=6)
    text_co2.x = (DISPLAY_WIDTH // 2) - (text_co2.bounding_box[2] * 2 // 2)  # Center horizontally
    text_co2.y = (DISPLAY_HEIGHT // 2) - (text_co2.bounding_box[3] * 2 // 2)  # Center vertically
    g.append(text_co2)

    # Place the display group on the screen
    display.root_group = g

    # Refresh the display to have everything show on the display
    # NOTE: Do not refresh eInk displays more often than 180 seconds!
    display.refresh()

    json_data = json.dumps(data)
    response = requests.post(url, data=json_data, headers=headers)

    sleep_time = display.time_to_refresh + 60
    time.sleep(sleep_time)
