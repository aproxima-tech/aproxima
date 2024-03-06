import time
import board
import busio
import adafruit_sgp30

import os
import ssl
import ipaddress
import wifi
import socketpool
import adafruit_requests
import json

# TODO: Attempt to connect wifi in a loop as it often fails the first time
# TODO: One 401 from api, stop sending requests (to avoid spamming the api), show error code on screen

#  Connect to your SSID
print("Connecting to WiFi...")
wifi.radio.connect(os.getenv('CIRCUITPY_WIFI_SSID'), os.getenv('CIRCUITPY_WIFI_PASSWORD'))
print("Connected to WiFi!")

pool = socketpool.SocketPool(wifi.radio)

#  Prints MAC address to REPL
print("My MAC addr:", [hex(i) for i in wifi.radio.mac_address])
#  Prints IP address to REPL
print("My IP address is", wifi.radio.ipv4_address)

#  Pings Google (for debugging)
ipv4 = ipaddress.ip_address("8.8.4.4")
print("Ping google.com: %f ms" % (wifi.radio.ping(ipv4)*1000))

requests = adafruit_requests.Session(pool, ssl.create_default_context())

# Set up i2c for SPG30
i2c = busio.I2C(board.GP1, board.GP0, frequency=100000)
# Create library object on our I2C port
sgp30 = adafruit_sgp30.Adafruit_SGP30(i2c)

print("SGP30 serial #", [hex(i) for i in sgp30.serial])
sgp30.set_iaq_baseline(0x8973, 0x8AAE)
sgp30.set_iaq_relative_humidity(celsius=22.1, relative_humidity=60)

url = "https://api.aproxima.net/device-data"
headers = {'Content-Type': 'application/json', 'X-API-KEY': os.getenv('CLOUDFLARE_CORE_API_API_KEY') }

while True:
    time.sleep(2)
    print("eCO2 = %d ppm \t TVOC = %d ppb" % (sgp30.eCO2, sgp30.TVOC))
    print(
        "**** Baseline values: eCO2 = 0x%x, TVOC = 0x%x"
        % (sgp30.baseline_eCO2, sgp30.baseline_TVOC)
    )

    data = {
        "eCO2": sgp30.eCO2,
        "TVOC": sgp30.TVOC
    }
    json_data = json.dumps(data)
    response = requests.post(url, data=json_data, headers=headers)


