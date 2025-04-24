# tcp_server_mock.py
import socket
import json
import time

HOST = 'localhost'
PORT = 12345

# Sample device data
data = {
    "device_id": "abc123",
    "battery_level": 87,
    "first_sensor_temperature": 36.7,
    "route_from": "Warehouse A",
    "route_to": "Warehouse B"
}

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind((HOST, PORT))
server_socket.listen(1)
print(f"TCP Server running on {HOST}:{PORT}...")

conn, addr = server_socket.accept()
print(f"🔌 Connected by {addr}")

try:
    while True:
        json_msg = json.dumps(data) + "\n"
        conn.sendall(json_msg.encode('utf-8'))
        time.sleep(2)
except KeyboardInterrupt:
    print("Server shutting down.")
finally:
    conn.close()
    server_socket.close()
