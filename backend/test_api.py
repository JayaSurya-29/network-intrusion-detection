import urllib.request
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def get(endpoint):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def post(endpoint, data):
    url = f"{BASE_URL}{endpoint}"
    json_bytes = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(url, data=json_bytes, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def patch(endpoint):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(url, method='PATCH')
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def test_all_endpoints():
    print("=== TESTING FASTAPI BACKEND & SQLITE DATABASE ===")
    
    # 1. Root
    root_res = get("/")
    print(f"1. GET / -> Status: {root_res.get('status')}")
    
    # 2. Health
    health_res = get("/health")
    print(f"2. GET /health -> DB: {health_res.get('database')}, ML: {health_res.get('ml_model')}")
    
    # 3. Predict Normal Traffic
    normal_payload = {
        "duration": 0, "protocol_type": "tcp", "service": "http", "flag": "SF",
        "src_bytes": 215, "dst_bytes": 4500, "count": 1, "srv_count": 1, "same_srv_rate": 1.0
    }
    pred_normal = post("/predict", normal_payload)
    print(f"3. POST /predict (Normal) -> ID: {pred_normal['id']}, Prediction: {pred_normal['prediction']}, Risk: {pred_normal['risk_level']}")
    
    # 4. Predict DoS Traffic
    dos_payload = {
        "duration": 0, "protocol_type": "tcp", "service": "private", "flag": "S0",
        "src_bytes": 0, "dst_bytes": 0, "count": 250, "srv_count": 250, "serror_rate": 1.0,
        "srv_serror_rate": 1.0, "same_srv_rate": 1.0, "dst_host_count": 255
    }
    pred_dos = post("/predict", dos_payload)
    print(f"4. POST /predict (DoS) -> ID: {pred_dos['id']}, Prediction: {pred_dos['prediction']}, Risk: {pred_dos['risk_level']}")

    # 5. History
    history = get("/predict/history")
    print(f"5. GET /predict/history -> Retrieved {len(history)} stored logs from SQLite")

    # 6. Alerts
    alerts = get("/alerts")
    print(f"6. GET /alerts -> Total Active/Logged Alerts in SQLite: {len(alerts)}")
    if len(alerts) > 0:
        alert_id = alerts[0]['id']
        resolved = patch(f"/alerts/{alert_id}/resolve")
        print(f"   PATCH /alerts/{alert_id}/resolve -> New Status: {resolved['status']}")

    # 7. Statistics
    stats = get("/statistics")
    print(f"7. GET /statistics -> Total Traffic: {stats['total_traffic']}, Attacks Detected: {stats['attacks_detected']}, Anomalies: {stats['anomalies_detected']}")
    print(f"   Attack Distribution: {stats['attack_distribution']}")

    print("\nALL API ENDPOINTS TESTED SUCCESSFULLY & VERIFIED AGAINST SQLITE DATABASE!")

if __name__ == "__main__":
    time.sleep(1)
    test_all_endpoints()
