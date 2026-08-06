from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    filepath = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    content_type = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Extracted fields from resume parsing
    extracted_name = Column(String, nullable=True)
    extracted_email = Column(String, nullable=True)
    extracted_phone = Column(String, nullable=True)
    extracted_skills = Column(String, nullable=True)
    extracted_education = Column(String, nullable=True)
    extracted_projects = Column(String, nullable=True)
    extracted_experience = Column(String, nullable=True)
    extracted_certifications = Column(String, nullable=True)

    user = relationship("User", back_populates="resumes")

    @property
    def ats_score(self) -> int:
        from .ats_scorer import compute_ats_score
        try:
            return compute_ats_score(self)["total_score"]
        except Exception:
            return 0

