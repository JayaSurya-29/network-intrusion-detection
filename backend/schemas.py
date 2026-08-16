from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, Field

class TrafficAnalysisRequest(BaseModel):
    duration: int = Field(default=0, ge=0)
    protocol_type: str = Field(default="tcp")
    service: str = Field(default="http")
    flag: str = Field(default="SF")
    src_bytes: int = Field(default=215, ge=0)
    dst_bytes: int = Field(default=4500, ge=0)
    land: int = Field(default=0, ge=0, le=1)
    wrong_fragment: int = Field(default=0, ge=0)
    urgent: int = Field(default=0, ge=0)
    hot: int = Field(default=0, ge=0)
    num_failed_logins: int = Field(default=0, ge=0)
    logged_in: int = Field(default=1, ge=0, le=1)
    num_compromised: int = Field(default=0, ge=0)
    root_shell: int = Field(default=0, ge=0, le=1)
    su_attempted: int = Field(default=0, ge=0)
    num_root: int = Field(default=0, ge=0)
    num_file_creations: int = Field(default=0, ge=0)
    num_shells: int = Field(default=0, ge=0)
    num_access_files: int = Field(default=0, ge=0)
    is_guest_login: int = Field(default=0, ge=0, le=1)
    count: int = Field(default=1, ge=0)
    srv_count: int = Field(default=1, ge=0)
    serror_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    srv_serror_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    rerror_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    srv_rerror_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    same_srv_rate: float = Field(default=1.0, ge=0.0, le=1.0)
    diff_srv_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    srv_diff_host_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    dst_host_count: int = Field(default=5, ge=0)
    dst_host_srv_count: int = Field(default=255, ge=0)
    dst_host_same_srv_rate: float = Field(default=1.0, ge=0.0, le=1.0)
    dst_host_diff_srv_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    dst_host_same_src_port_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    dst_host_srv_diff_host_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    dst_host_serror_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    dst_host_srv_serror_rate: float = Field(default=0.0, ge=0.0, le=1.0)

class PredictionResponse(BaseModel):
    id: Optional[int] = None
    prediction: str
    confidence: float
    anomaly: bool
    anomaly_score: float
    risk_level: str
    explanation: str
    timestamp: Optional[datetime] = None

    class Config:
        from_attributes = True

class AlertResponse(BaseModel):
    id: int
    timestamp: datetime
    attack_type: str
    severity: str
    message: str
    status: str

    class Config:
        from_attributes = True

class SystemStatsResponse(BaseModel):
    total_traffic: int
    normal_traffic: int
    attacks_detected: int
    anomalies_detected: int
    attack_distribution: Dict[str, int]
    system_status: Dict[str, str]
    recent_alerts: List[AlertResponse]
