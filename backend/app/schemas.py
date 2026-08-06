from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

# Common User fields
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Unique username")
    email: EmailStr = Field(..., description="Valid email address")

# Signup request payload
class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")

# Response payload for User details
class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Login request payload
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Token structure returned on successful login
class Token(BaseModel):
    access_token: str
    token_type: str

# Token payload structure
class TokenData(BaseModel):
    email: str | None = None
    user_id: int | None = None

# Response payload for Resume details
class ResumeResponse(BaseModel):
    id: int
    filename: str
    file_size: int
    content_type: str
    uploaded_at: datetime
    user_id: int

    # Extracted fields from resume parsing
    extracted_name: str | None = None
    extracted_email: str | None = None
    extracted_phone: str | None = None
    extracted_skills: str | None = None
    extracted_education: str | None = None
    extracted_projects: str | None = None
    extracted_experience: str | None = None
    extracted_certifications: str | None = None
    ats_score: int | None = None

    class Config:
        from_attributes = True

class CategoryBreakdown(BaseModel):
    label: str
    score: int
    max: int
    tips: list[str]

class ATSBreakdown(BaseModel):
    skills: CategoryBreakdown
    experience: CategoryBreakdown
    projects: CategoryBreakdown
    education: CategoryBreakdown
    certifications: CategoryBreakdown
    formatting: CategoryBreakdown

class ATSScoreResponse(BaseModel):
    total_score: int
    max_score: int
    grade: str
    grade_label: str
    breakdown: ATSBreakdown
    improvement_tips: list[str]

class GrammarIssue(BaseModel):
    issue: str
    suggestion: str
    context: str

class WeakProjectDescription(BaseModel):
    project: str
    issue: str
    suggestion: str

class AIAnalysisResponse(BaseModel):
    missing_keywords: list[str]
    grammar_issues: list[GrammarIssue]
    weak_projects: list[WeakProjectDescription]
    formatting_improvements: list[str]
    ai_suggestions: list[str]
    summary: str

class JobRecommendation(BaseModel):
    company_name: str
    role_name: str
    match_percentage: int
    matched_skills: list[str]
    missing_skills: list[str]
    required_skills: list[str]
    eligibility: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage]

class ChatResponse(BaseModel):
    response: str

class InterviewQuestion(BaseModel):
    category: str
    question: str
    answer: str

class AdminAnalytics(BaseModel):
    total_users: int
    total_resumes: int
    average_score: int
    grade_distribution: dict[str, int]
    top_skills: dict[str, int]





