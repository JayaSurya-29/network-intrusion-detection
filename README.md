# Cybersecurity Network Threat & Intrusion Profiler

> **UG Level-2 B.Tech CSE AIML Capstone Project**  
> An end-to-end cybersecurity solution combining Supervised Machine Learning classification and Unsupervised Isolation Forest anomaly detection based on the NSL-KDD Network Intrusion Dataset.

---

## Project Description & Objectives
Modern computer networks face both known cyber threats and newly invented attack methods. This system combines supervised classification models (Random Forest) to catch known network attacks and unsupervised anomaly detection algorithms (Isolation Forest) to flag unusual, zero-day network traffic.

---

## System Architecture

```
                                  +------------------------------------+
                                  |       React + Vite Frontend        |
                                  |   (Cybersecurity Dashboard :5173)  |
                                  +-----------------+------------------+
                                                    | REST API (JSON)
                                                    v
                                  +------------------------------------+
                                  |          FastAPI Backend           |
                                  |         (Uvicorn :8000)            |
                                  +--------+------------------+--------+
                                           |                  |
                                           v                  v
                        +----------------------+    +----------------------+
                        |   SQLite Database    |    | Threat Profiler Engine|
                        | (network_ids.db)     |    | (ml/predict.py)      |
                        +----------------------+    +----------+-----------+
                                                               |
                                        +----------------------+----------------------+
                                        |                                             |
                                        v                                             v
                    +------------------------------------+        +------------------------------------+
                    |  Random Forest Supervised Model    |        |  Isolation Forest Anomaly Detector |
                    |      (Signature Classification)    |        |       (Behavioral Anomaly)         |
                    +------------------------------------+        +------------------------------------+
```

---

## Features

1. **Dual Threat Detection & Intrusion Profiler**:
   - **Supervised Classification (Random Forest)**: Identifies known attack categories (`DoS`, `Probe`, `R2L`, `U2R`).
   - **Unsupervised Anomaly Detection (Isolation Forest)**: Flags unusual network traffic deviating from baseline normal behavior.
   - **Automated Threat Response Profiling**: Generates threat vector metrics and recommended firewall actions (`BLOCK_SOURCE_IP`, `QUARANTINE_PORT`, `ALLOW_BASELINE_PASS`).
2. **Explainable Risk Scoring Engine**:
   - Computes prediction confidence, anomaly score, and categorizes overall threat level (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) with human-readable security explanations.
3. **High-Performance FastAPI REST API**:
   - Full Pydantic validation over 38 numerical and 3 categorical network parameters.
   - Built-in exception handling preventing raw traceback leaks.
4. **Persistent SQLite Storage**:
   - Auto-logs traffic inspections (`predictions` table) and security incidents (`alerts` table).
5. **Cybersecurity Executive Dashboard**:
   - Real-time threat analytics, metric cards, attack distribution charts via Recharts, interactive traffic analyzer, and incident resolution workflow.

---

## Machine Learning Performance Evaluation

| Model | Accuracy | Weighted Precision | Weighted Recall | Weighted F1-Score | Macro F1 |
|---|---|---|---|---|---|
| **Logistic Regression (SGD)** | 74.19% | 78.71% | 74.19% | 70.79% | 50.75% |
| **Decision Tree** | 74.80% | 72.68% | 74.80% | 70.40% | 48.04% |
| **Random Forest (Selected)** | **75.20%** | **81.02%** | **75.20%** | **71.82%** | **52.35%** |

### Random Forest Per-Category Metrics

| Attack Category | Precision | Recall | F1-Score | Support |
|---|---|---|---|---|
| **DoS** | **0.96** (96%) | 0.77 | **0.85** | 7,458 |
| **Normal** | 0.65 | **0.97** | 0.78 | 9,711 |
| **Probe** | **0.85** (85%) | 0.63 | 0.72 | 2,421 |
| **R2L** | 0.97 | 0.10 | 0.19 | 2,754 |
| **U2R** | 0.41 | 0.04 | 0.08 | 200 |

---

## API Endpoints

- `GET /` - Root status API
- `GET /health` - System health check (ML, Anomaly, SQLite status)
- `POST /predict` - Real-time traffic analysis & automated alert logging
- `POST /predict/batch` - Batch traffic stream analysis
- `GET /predict/history` - Retrieve historical inspection logs
- `DELETE /predict/history` - Clear inspection logs from SQLite
- `GET /alerts` - Retrieve security alerts (`?status_filter=Active`)
- `PATCH /alerts/{id}/resolve` - Mark alert as resolved
- `GET /statistics` - Real-time system statistics & category counts

---

## Installation & Running Locally

### 1. Prerequisites
- Python 3.10+
- Node.js v18+ & npm

### 2. Environment Setup
```powershell
# Clone / navigate to project root
cd network-intrusion-detection

# Activate Virtual Environment
.\venv\Scripts\Activate.ps1

# Install Dependencies
pip install -r requirements.txt
```

### 3. Running Backend API
```powershell
cd backend
..\venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 4. Running Frontend Dashboard
```powershell
cd frontend
npm install
npm run dev
```

Dashboard will open on `http://localhost:5173`.
