# 🎯 AI Resume Analyser — Pro Portal

A full-stack, AI-powered resume analysis platform for students and job seekers. Built with **FastAPI + React + Gemini API**.

---

## ✨ Feature Set (Phases 1–8)

| Phase | Feature |
|-------|---------|
| 1–3 | Authentication, Resume Upload, PDF/DOCX Parsing |
| 4 | **ATS Score Generator** — Score out of 100 with category breakdown + Radar/Bar charts |
| 5 | **AI Resume Analyzer** — Keyword gaps, grammar issues, project rewrites via Gemini |
| 6 | **Company Recommendation** — Match % vs Google, Amazon, Netflix, Stripe, OpenAI |
| 7 | **AI Career Chatbot** — Resume-aware Q&A powered by Gemini with offline fallback |
| 8 | **Advanced Tools** — Skill Gap, 30/60/90 Roadmap, Resume Compare, Interview Prep, Admin Analytics |

---

## 🏗️ Tech Stack

**Backend**
- FastAPI (Python 3.11+)
- SQLAlchemy + SQLite
- Google Gemini API (`gemini-2.5-flash`)
- PyMuPDF / python-docx for parsing

**Frontend**
- React 19 + Vite 8
- Tailwind CSS v4
- Recharts (radar/bar charts)
- Lucide React (icons)

---

## 🚀 Running Locally

### 1. Backend

```bash
cd backend
pip install -r requirements.txt

# Set your Gemini API key (optional — local fallback works without it)
set GEMINI_API_KEY=your_key_here      # Windows
export GEMINI_API_KEY=your_key_here   # Linux/macOS

uvicorn app.main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |
| POST | `/api/resumes/upload` | Upload PDF or DOCX resume |
| GET | `/api/resumes` | List all uploaded resumes |
| GET | `/api/resumes/{id}/ats-score` | Get ATS score breakdown |
| GET | `/api/resumes/{id}/ai-analysis` | AI-powered resume critique |
| GET | `/api/resumes/{id}/recommendations` | Company & role match predictions |
| POST | `/api/resumes/{id}/chat` | Career chatbot with resume context |
| GET | `/api/resumes/{id}/interview-questions` | Tailored interview Q&A |
| GET | `/api/admin/analytics` | Platform-wide stats |
| GET | `/api/resumes/{id}/download` | Download original file |

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Optional | Enables Gemini AI features. Falls back to local rules if absent. |
| `SECRET_KEY` | Optional | JWT signing secret (default is set in `config.py`) |

---

## 📁 Project Structure

```
ai resume analyser/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI routes
│   │   ├── models.py            # SQLAlchemy ORM models
│   │   ├── schemas.py           # Pydantic request/response schemas
│   │   ├── parser.py            # PDF/DOCX text extraction
│   │   ├── ats_scorer.py        # ATS scoring engine
│   │   ├── ai_analyzer.py       # Gemini AI analysis + fallback
│   │   ├── recommendation_engine.py  # Company skill matching
│   │   ├── career_chatbot.py    # Resume-aware chatbot
│   │   └── advanced_features.py # Interview Qs + admin analytics
│   └── requirements.txt
└── frontend/
    └── src/
        ├── components/
        │   ├── Dashboard.jsx        # Main portal view
        │   ├── ATSScorePanel.jsx    # Phase 4 visualization
        │   ├── AIAnalyzerPanel.jsx  # Phase 5 visualization
        │   ├── JobRecommendationPanel.jsx  # Phase 6 visualization
        │   ├── AICareerChatbot.jsx  # Phase 7 chatbot interface
        │   ├── AdvancedToolsPanel.jsx      # Phase 8 tools
        │   ├── ToastProvider.jsx    # Global toast notifications
        │   └── ScrollToTop.jsx      # Scroll utility
        └── App.jsx
```

---

## 💡 Tips

- **No Gemini key?** The app works fully offline using the built-in local rules engine. AI responses are replaced with smart template-based outputs.
- **Adding resumes**: Drag and drop or click to select PDF/DOCX. Up to multiple resumes can be stored and compared side-by-side.
- **Admin Analytics**: Available under the Advanced Tools panel, no separate admin account needed.
