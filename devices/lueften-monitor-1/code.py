# General imports
import time
import board
import busio

# Sensor drivers
import adafruit_scd4x

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

#  Release any resources currently in use for the displays
displayio.release_displays()

# Display setup
BLACK = 0x000000
WHITE = 0xFFFFFF
RED = 0xFF0000
FOREGROUND_COLOR = BLACK
BACKGROUND_COLOR = WHITE
DISPLAY_WIDTH = 200
DISPLAY_HEIGHT = 200

# Set up i2c for SCD41
i2cCO2 = busio.I2C(board.GP1, board.GP0, frequency=100000)
scd4x = adafruit_scd4x.SCD4X(i2cCO2)
print("Serial number:", [hex(i) for i in scd4x.serial_number])

scd4x.start_periodic_measurement()
print("Waiting for first measurement....")

# Set up Adafruit ThinkInk
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

while True:
    if scd4x.data_ready:
        print("CO2: %d ppm" % scd4x.CO2)
        print("Temperature: %0.1f *C" % scd4x.temperature)
        print("Humidity: %0.1f %%" % scd4x.relative_humidity)
        print()

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
        text_temp = label.Label(terminalio.FONT, text=f"{scd4x.temperature} C", color=FOREGROUND_COLOR, scale=2)
        text_temp.x = 0  # Adjust as needed
        text_temp.y = 20  # Adjust as needed
        g.append(text_temp)

        # Display humidity in the top right
        text_humidity = label.Label(terminalio.FONT, text=f"{scd4x.relative_humidity}%", color=FOREGROUND_COLOR, scale=2)
        text_humidity.x = DISPLAY_WIDTH - text_humidity.bounding_box[2] * 2  # Adjust based on text width
        text_humidity.y = 20  # Adjust as needed
        g.append(text_humidity)

        # Display CO2 ppm value in the middle
        text_co2 = label.Label(terminalio.FONT, text=f"{scd4x.CO2} ppm", color=FOREGROUND_COLOR, scale=6)
        text_co2.x = (DISPLAY_WIDTH // 2) - (text_co2.bounding_box[2] * 2 // 2)  # Center horizontally
        text_co2.y = (DISPLAY_HEIGHT // 2) - (text_co2.bounding_box[3] * 2 // 2)  # Center vertically
        g.append(text_co2)

        # Place the display group on the screen
        display.root_group = g

        # Refresh the display to have everything show on the display
        # NOTE: Do not refresh eInk displays more often than 180 seconds!
        display.refresh()

        # Display refresh is super annoying (flickers a lot)
        wait_minutes = 5
        sleep_time = display.time_to_refresh + (60 * wait_minutes)
        time.sleep(sleep_time)

    time.sleep(1)
