from sqlalchemy.orm import Session
from collections import Counter
import re

from . import models
from .ats_scorer import compute_ats_score

def generate_interview_questions(resume) -> list:
    """
    Generates tailored behavioral, technical, and project-based interview 
    questions and recommended answers matching the resume's skills and roles.
    """
    skills = [s.strip().capitalize() for s in (resume.extracted_skills or "").split(',') if s.strip()]
    main_skill = skills[0] if skills else "Software Engineering"
    
    questions = [
        {
            "category": "Technical",
            "question": f"How do you handle memory management or process performance optimizations in {main_skill}?",
            "answer": f"Explain key language features (e.g. decorators, garbage collection, garbage collectors in Python, or virtual DOM reconciliation in React depending on the technology). Mention using profiling tools and testing metrics to identify memory leaks or execution bottlenecks."
        },
        {
            "category": "Behavioral",
            "question": "Can you describe a challenging technical roadblock you faced in one of your projects and how you solved it?",
            "answer": "Answer using the STAR method: Situation (what the project was), Task (the issue faced), Action (your debug process, researching APIs or documentation), and Result (successful resolution, speedups, or features deployed)."
        },
        {
            "category": "Project-Specific",
            "question": "If you had to re-architect your primary project from scratch, what system design improvements would you introduce?",
            "answer": "Focus on scalability: replacing synchronous queries with queues, introducing Redis caching layers, scaling from monolithic structures to containers, or standardizing REST APIs with strict Pydantic schemas."
        }
    ]
    return questions

def get_admin_analytics(db: Session) -> dict:
    """
    Queries database tables to compile system-wide analytical metrics:
    registered users, uploaded files count, averages, and grade distributions.
    """
    total_users = db.query(models.User).count()
    resumes = db.query(models.Resume).all()
    total_resumes = len(resumes)
    
    avg_score = 0
    grade_distribution = {"A": 0, "B": 0, "C": 0, "D": 0, "F": 0}
    all_skills = []
    
    for r in resumes:
        score = r.ats_score
        avg_score += score
        
        # Calculate grade distribution
        if score >= 85:
            grade_distribution["A"] += 1
        elif score >= 70:
            grade_distribution["B"] += 1
        elif score >= 55:
            grade_distribution["C"] += 1
        elif score >= 40:
            grade_distribution["D"] += 1
        else:
            grade_distribution["F"] += 1
            
        # Collect skills for frequency analysis
        if r.extracted_skills:
            # Clean separators
            sk_list = re.split(r"[\n,;•*\-|/]", r.extracted_skills)
            for s in sk_list:
                cleaned = s.strip().lower()
                if cleaned and len(cleaned) > 1 and cleaned != "n/a":
                    all_skills.append(cleaned)
                    
    avg_score = round(avg_score / total_resumes) if total_resumes > 0 else 0
    
    # Top 5 matching skills
    skill_counts = Counter(all_skills)
    top_skills_raw = skill_counts.most_common(5)
    
    # Capitalize acronyms
    acronyms = {"nlp", "gcp", "aws", "ai", "sql", "api", "rest api", "ci/cd", "html", "css", "js", "ts"}
    top_skills = {}
    for skill, count in top_skills_raw:
        display_name = skill.upper() if skill in acronyms else skill.capitalize()
        top_skills[display_name] = count

    return {
        "total_users": total_users,
        "total_resumes": total_resumes,
        "average_score": avg_score,
        "grade_distribution": grade_distribution,
        "top_skills": top_skills
    }
