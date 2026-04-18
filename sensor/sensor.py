import socket
import requests
import os

BACKEND_URL = "http://localhost:8080/api/report"

SIGNATURES = {
    "DROP TABLE": "SQL Injection Attempt",
    "<script>": "XSS Attack",
    "admin123": "Brute Force Attempt",
    "/etc/passwd": "Directory Traversal"
}

def analyze_payload(data):
    for key, val in SIGNATURES.items():
        if key in data:
            return val
    return "Unknown Suspicious Activity"

def start_sensor():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind(("0.0.0.0", 2222))
    s.listen(5)
    print(">>> [ADVANCED IDS/IPS ACTIVE] Port 2222 Monitoring...")

    while True:
        try:
            client, addr = s.accept()
            attacker_ip = addr[0] 
            payload = client.recv(1024).decode('utf-8', errors='ignore')
            
            event_type = analyze_payload(payload)
            risk = 85 if event_type != "Unknown Suspicious Activity" else 40 
            
            report = {
                "ip": attacker_ip,
                "type": event_type,
                "payload": payload,  
                "risk_score": risk
            }
            
           
            if risk > 80:
                print(f"!!! CRITICAL THREAT: Banning IP {attacker_ip} !!!")
                
            
            
            requests.post(BACKEND_URL, json=report, timeout=2)
            print(f"Successfully reported: {event_type}")
            
            client.close()
        except Exception as e:
            print(f"Error: {e}")
            continue

if __name__ == "__main__":
    start_sensor()
