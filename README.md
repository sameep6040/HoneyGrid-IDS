HoneyGrid is a full-stack, real-time Intrusion Detection System (IDS) and Threat Dashboard. It combines a Python-based honeypot sensor with a Node.js backend and a React-based geographical visualization frontend to track and analyze network threats in real-time.

1) Key Features
Signature-Based Detection: Identifies SQL Injection, XSS, Brute Force, and Directory Traversal attacks using raw packet inspection.

Active Defense (IPS): Includes logic for automated IP banning via Linux iptables for high-risk threats.

Live Threat Map: Visualizes attack origins globally using React-Leaflet and GeoIP-lite telemetry.

Forensic Reporting: One-click generation of JSON-formatted incident reports for security auditing.

Stealth Honeypot: Passive socket listener designed to attract and log unauthorized connection attempts on Port 2222.

2) Tech Stack
Frontend: React (Vite), Socket.io-client, Leaflet.js

Backend: Node.js, Express, Socket.io

Sensor: Python 3, Socket API, Requests

OS Environment: Optimized for Kali Linux


3) Setup
1. **Backend:** `node server.js` (Port 8080)
2. **Sensor:** `python3 sensor.py` (Port 2222)
3. **Frontend:** `npm run dev`


Simulation Commands
Run these in a separate terminal to trigger alerts in the dashboard:

SQL Injection
echo "DROP TABLE users; --" | nc -w 1 localhost 2222

XSS Attack
echo "<script>alert('XSS')</script>" | nc -w 1 localhost 2222

Directory Traversal
echo "GET /../../etc/passwd" | nc -w 1 localhost 2222

Brute Force
echo "admin123" | nc -w 1 localhost 2222


