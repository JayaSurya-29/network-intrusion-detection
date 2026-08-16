from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from database import Base

class PredictionLog(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    prediction = Column(String(50), nullable=False)
    confidence = Column(Float, nullable=False)
    anomaly = Column(Boolean, default=False)
    anomaly_score = Column(Float, default=0.0)
    risk_level = Column(String(20), nullable=False)
    explanation = Column(Text, nullable=True)
    protocol_type = Column(String(20), default="tcp")
    service = Column(String(50), default="http")
    src_bytes = Column(Integer, default=0)
    dst_bytes = Column(Integer, default=0)

class AlertLog(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    attack_type = Column(String(50), nullable=False)
    severity = Column(String(20), nullable=False)  # CRITICAL, HIGH, MEDIUM, LOW
    message = Column(Text, nullable=False)
    status = Column(String(20), default="Active")  # Active, Resolved
