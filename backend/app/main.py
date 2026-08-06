from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
import uuid

from .database import engine, Base, get_db
from . import schemas, crud, models
from .auth import verify_password, create_access_token, get_current_user
from .parser import parse_resume
from .ats_scorer import compute_ats_score
from .ai_analyzer import analyze_resume_content
from .recommendation_engine import get_company_recommendations
from .career_chatbot import generate_chat_response
from .advanced_features import generate_interview_questions, get_admin_analytics





# Initialize database tables
Base.metadata.create_all(bind=engine)

# Setup local storage directory for uploads
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(
    title="Resume Analyser API",
    description="React + FastAPI Resume Upload and Authentication Service",
    version="1.1.0"
)

# Enable CORS for React frontend (Vite defaults to port 5173)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Resume Analyser API is running smoothly!"}

# --- AUTH ROUTES ---

@app.post("/api/auth/signup", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if email is already registered
    db_user_email = crud.get_user_by_email(db, email=user.email)
    if db_user_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username is already taken
    db_user_username = crud.get_user_by_username(db, username=user.username)
    if db_user_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
        
    return crud.create_user(db=db, user=user)

@app.post("/api/auth/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    # Verify username or email
    user = crud.get_user_by_email(db, email=credentials.email)
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Create Access Token
    access_token = create_access_token(data={"sub": user.email, "id": user.id})
    return schemas.Token(access_token=access_token, token_type="bearer")

@app.get("/api/auth/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# --- RESUME ROUTES ---

@app.post("/api/resumes/upload", response_model=schemas.ResumeResponse, status_code=status.HTTP_201_CREATED)
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Validate file extension
    _, ext = os.path.splitext(file.filename.lower())
    if ext not in {".pdf", ".docx"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF and DOCX files are allowed."
        )

    # Validate mime-type (additional security layer)
    allowed_types = {
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/octet-stream" # Fallback for some clients
    }
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF and DOCX files are allowed."
        )

    # Generate unique filepath to avoid collision
    unique_filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        # Save file to disk
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        file_size = os.path.getsize(filepath)
        
        # Parse resume data
        parsed_data = parse_resume(filepath)
        
        # Save metadata and extracted data to DB
        db_resume = models.Resume(
            filename=file.filename,
            filepath=filepath,
            file_size=file_size,
            content_type=file.content_type,
            user_id=current_user.id,
            extracted_name=parsed_data.get("name"),
            extracted_email=parsed_data.get("email"),
            extracted_phone=parsed_data.get("phone"),
            extracted_skills=parsed_data.get("skills"),
            extracted_education=parsed_data.get("education"),
            extracted_projects=parsed_data.get("projects"),
            extracted_experience=parsed_data.get("experience"),
            extracted_certifications=parsed_data.get("certifications")
        )
        db.add(db_resume)
        db.commit()
        db.refresh(db_resume)
        
        return db_resume
        
    except Exception as e:
        # Cleanup file if saved but DB transaction failed
        if os.path.exists(filepath):
            os.remove(filepath)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while uploading file: {str(e)}"
        )

@app.get("/api/resumes", response_model=List[schemas.ResumeResponse])
def list_resumes(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Fetch upload history, descending order
    resumes = db.query(models.Resume).filter(
        models.Resume.user_id == current_user.id
    ).order_by(models.Resume.uploaded_at.desc()).all()
    
    return resumes

@app.get("/api/resumes/{resume_id}/ats-score", response_model=schemas.ATSScoreResponse)
def get_resume_ats_score(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied"
        )
        
    return compute_ats_score(resume)

@app.get("/api/resumes/{resume_id}/ai-analysis", response_model=schemas.AIAnalysisResponse)
def get_resume_ai_analysis(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied"
        )
        
    return analyze_resume_content(resume)

@app.get("/api/resumes/{resume_id}/recommendations", response_model=List[schemas.JobRecommendation])
def get_resume_recommendations(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied"
        )
        
    return get_company_recommendations(resume)

@app.post("/api/resumes/{resume_id}/chat", response_model=schemas.ChatResponse)
def resume_career_chat(
    resume_id: int,
    payload: schemas.ChatRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied"
        )
        
    # Convert Pydantic history objects to standard dictionaries for chatbot processing
    history_list = [{"role": msg.role, "content": msg.content} for msg in payload.history]
    
    reply = generate_chat_response(resume, payload.message, history_list)
    return schemas.ChatResponse(response=reply)

@app.get("/api/resumes/{resume_id}/interview-questions", response_model=list[schemas.InterviewQuestion])
def get_interview_questions(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found or access denied")
    return generate_interview_questions(resume)

@app.get("/api/admin/analytics", response_model=schemas.AdminAnalytics)
def admin_analytics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return get_admin_analytics(db)

@app.get("/api/resumes/{resume_id}/download")
def download_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied"
        )
        
    if not os.path.exists(resume.filepath):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found on server disk"
        )
        
    return FileResponse(
        path=resume.filepath,
        media_type=resume.content_type,
        filename=resume.filename
    )
