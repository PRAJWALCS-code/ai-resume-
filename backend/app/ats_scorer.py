"""
ATS (Applicant Tracking System) Scoring Engine
Evaluates resume quality across 6 weighted categories.
Total score: 100 points
"""

import re

# ---------------------------------------------------------------------------
# ATS keyword dictionaries
# ---------------------------------------------------------------------------

TECH_KEYWORDS = [
    # Languages
    "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust",
    "kotlin", "swift", "php", "ruby", "scala", "r", "matlab", "sql", "bash",
    # Frameworks & Libraries
    "react", "angular", "vue", "node", "express", "django", "flask", "fastapi",
    "spring", "laravel", "rails", "next.js", "nuxt", "svelte", "tensorflow",
    "pytorch", "keras", "scikit-learn", "pandas", "numpy", "opencv",
    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins",
    "github actions", "ci/cd", "devops", "microservices", "linux",
    # Databases
    "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "sqlite",
    "dynamodb", "firebase", "cassandra",
    # Tools & Other
    "git", "rest api", "graphql", "agile", "scrum", "jira", "figma",
    "machine learning", "deep learning", "nlp", "data science", "ai",
]

SOFT_KEYWORDS = [
    "led", "managed", "developed", "designed", "implemented", "built",
    "created", "improved", "increased", "reduced", "optimized", "deployed",
    "collaborated", "coordinated", "mentored", "delivered", "achieved",
    "launched", "scaled", "automated", "researched", "analyzed",
]

ACTION_VERBS = [
    "engineered", "architected", "spearheaded", "pioneered", "transformed",
    "accelerated", "streamlined", "orchestrated", "revamped", "established",
    "initiated", "executed", "integrated", "migrated", "refactored",
]

EDUCATION_KEYWORDS = [
    "bachelor", "master", "phd", "b.tech", "m.tech", "b.e", "m.e",
    "b.sc", "m.sc", "mba", "diploma", "degree", "university", "college",
    "institute", "gpa", "cgpa", "honours", "honors",
]

CERT_KEYWORDS = [
    "certified", "certification", "certificate", "aws certified", "google",
    "microsoft", "coursera", "udemy", "udacity", "edx", "linkedin learning",
    "pmp", "cpa", "cfa", "cissp", "ccna", "azure", "tensorflow certificate",
]

# ---------------------------------------------------------------------------
# Individual category scorers
# ---------------------------------------------------------------------------

def _count_keywords(text_lower: str, keyword_list: list) -> int:
    """Return count of unique keywords found in text."""
    return sum(1 for kw in keyword_list if kw in text_lower)


def score_skills(skills_text: str) -> dict:
    """
    Max 25 points.
    - Quantity of skills       : up to 15 pts
    - Tech keyword coverage    : up to 10 pts
    """
    if not skills_text or skills_text.strip() == "":
        return {"score": 0, "max": 25, "tips": ["Add a dedicated Skills section with technical and soft skills."]}

    lower = skills_text.lower()
    # Count individual skill tokens
    skill_tokens = [s.strip() for s in re.split(r"[\n,;•*\-|/]", skills_text) if s.strip()]
    unique_skills = len(set(t.lower() for t in skill_tokens if len(t) > 1))

    quantity_score = min(15, unique_skills * 1.5)

    tech_matches = _count_keywords(lower, TECH_KEYWORDS)
    tech_score = min(10, tech_matches * 1.2)

    raw = round(quantity_score + tech_score)
    score = min(25, raw)

    tips = []
    if unique_skills < 8:
        tips.append("List at least 10–15 specific technical skills.")
    if tech_matches < 5:
        tips.append("Include more industry-relevant tech keywords (e.g., cloud tools, frameworks).")
    if not tips:
        tips.append("Skills section looks strong!")

    return {"score": score, "max": 25, "matched_keywords": tech_matches, "skill_count": unique_skills, "tips": tips}


def score_experience(experience_text: str) -> dict:
    """
    Max 20 points.
    - Has experience section   : 5 pts
    - Action verb usage        : up to 8 pts
    - Quantified achievements  : up to 7 pts
    """
    if not experience_text or experience_text.strip() == "":
        return {"score": 0, "max": 20, "tips": ["Add a Work Experience section with roles, companies, and dates."]}

    lower = experience_text.lower()
    score = 5  # base: section exists

    # Action verbs
    av_hits = _count_keywords(lower, SOFT_KEYWORDS + ACTION_VERBS)
    verb_score = min(8, av_hits * 0.8)
    score += verb_score

    # Quantified achievements (numbers in text)
    numbers = re.findall(r'\b\d[\d,%.+x]*\b', experience_text)
    quant_score = min(7, len(numbers) * 0.7)
    score += quant_score

    raw = round(score)
    final = min(20, raw)

    tips = []
    if av_hits < 5:
        tips.append("Start bullet points with strong action verbs (Led, Developed, Optimized).")
    if len(numbers) < 3:
        tips.append("Quantify achievements with metrics (e.g., increased performance by 40%).")
    if not tips:
        tips.append("Experience section is well-written!")

    return {"score": final, "max": 20, "action_verbs_found": av_hits, "quantified_achievements": len(numbers), "tips": tips}


def score_projects(projects_text: str) -> dict:
    """
    Max 20 points.
    - Has projects section     : 5 pts
    - Tech keywords in projects: up to 10 pts
    - Project descriptions     : up to 5 pts
    """
    if not projects_text or projects_text.strip() == "":
        return {"score": 0, "max": 20, "tips": ["Add a Projects section showcasing real-world applications of your skills."]}

    lower = projects_text.lower()
    score = 5  # base

    tech_hits = _count_keywords(lower, TECH_KEYWORDS)
    tech_score = min(10, tech_hits * 1.0)
    score += tech_score

    lines = [l.strip() for l in projects_text.split("\n") if l.strip()]
    desc_score = min(5, len(lines) * 0.4)
    score += desc_score

    raw = round(score)
    final = min(20, raw)

    tips = []
    if tech_hits < 3:
        tips.append("Mention technologies used in each project (e.g., Built using React + Node.js).")
    if len(lines) < 5:
        tips.append("Expand project descriptions with problem statements, tech stack, and outcomes.")
    if not tips:
        tips.append("Projects section is comprehensive!")

    return {"score": final, "max": 20, "tech_keywords": tech_hits, "tips": tips}


def score_education(education_text: str) -> dict:
    """
    Max 15 points.
    - Has education section    : 5 pts
    - Contains degree keyword  : 5 pts
    - Contains GPA/CGPA        : 5 pts
    """
    if not education_text or education_text.strip() == "":
        return {"score": 0, "max": 15, "tips": ["Add an Education section with degree, institution, and graduation year."]}

    lower = education_text.lower()
    score = 5  # base

    degree_hits = _count_keywords(lower, EDUCATION_KEYWORDS)
    if degree_hits >= 2:
        score += 5
    elif degree_hits == 1:
        score += 3

    has_gpa = bool(re.search(r'(gpa|cgpa|grade|score)[\s:]*[\d.]+', lower))
    if has_gpa:
        score += 5
    else:
        score += 2  # partial for having education at all

    raw = round(score)
    final = min(15, raw)

    tips = []
    if degree_hits < 2:
        tips.append("Include degree type, university name, and graduation year clearly.")
    if not has_gpa:
        tips.append("Add your GPA/CGPA if it is above 7.0 or 3.0.")
    if not tips:
        tips.append("Education section is complete!")

    return {"score": final, "max": 15, "degree_keywords": degree_hits, "has_gpa": has_gpa, "tips": tips}


def score_certifications(certifications_text: str) -> dict:
    """
    Max 10 points.
    - Has certifications       : 3 pts
    - Recognized cert keywords : up to 7 pts
    """
    if not certifications_text or certifications_text.strip() == "":
        return {"score": 0, "max": 10, "tips": ["Add certifications (AWS, Google, Coursera, etc.) to stand out."]}

    lower = certifications_text.lower()
    score = 3  # base

    cert_hits = _count_keywords(lower, CERT_KEYWORDS)
    cert_score = min(7, cert_hits * 1.5)
    score += cert_score

    raw = round(score)
    final = min(10, raw)

    tips = []
    if cert_hits < 2:
        tips.append("Add industry-recognized certifications (AWS, Google, Microsoft, etc.).")
    if not tips:
        tips.append("Certifications section is strong!")

    return {"score": final, "max": 10, "cert_keywords": cert_hits, "tips": tips}


def score_formatting_keywords(name: str, email: str, phone: str, skills: str, experience: str) -> dict:
    """
    Max 10 points — evaluates contact info completeness and overall keyword density.
    - Contact info completeness: 5 pts
    - Keyword density          : 5 pts
    """
    score = 0

    has_name = bool(name and name.strip() and name != "N/A")
    has_email = bool(email and email.strip() and email != "N/A")
    has_phone = bool(phone and phone.strip() and phone != "N/A")

    contact_score = (int(has_name) + int(has_email) + int(has_phone))
    score += min(5, round(contact_score * 1.67))

    combined = f"{skills} {experience}".lower()
    kw_hits = _count_keywords(combined, TECH_KEYWORDS[:30])
    kw_score = min(5, kw_hits * 0.5)
    score += kw_score

    raw = round(score)
    final = min(10, raw)

    tips = []
    if not has_name:
        tips.append("Ensure your full name is prominently displayed at the top.")
    if not has_email:
        tips.append("Add a professional email address.")
    if not has_phone:
        tips.append("Include a contact phone number.")
    if kw_hits < 5:
        tips.append("Increase use of industry-relevant keywords throughout the resume.")
    if not tips:
        tips.append("Contact info and keyword density look great!")

    return {
        "score": final,
        "max": 10,
        "has_name": has_name,
        "has_email": has_email,
        "has_phone": has_phone,
        "tips": tips,
    }


# ---------------------------------------------------------------------------
# Main ATS scoring function
# ---------------------------------------------------------------------------

def compute_ats_score(resume) -> dict:
    """
    Takes a Resume ORM object and returns a full ATS score dict.
    """
    skills_result       = score_skills(resume.extracted_skills or "")
    experience_result   = score_experience(resume.extracted_experience or "")
    projects_result     = score_projects(resume.extracted_projects or "")
    education_result    = score_education(resume.extracted_education or "")
    certs_result        = score_certifications(resume.extracted_certifications or "")
    formatting_result   = score_formatting_keywords(
        resume.extracted_name or "",
        resume.extracted_email or "",
        resume.extracted_phone or "",
        resume.extracted_skills or "",
        resume.extracted_experience or "",
    )

    total = (
        skills_result["score"]
        + experience_result["score"]
        + projects_result["score"]
        + education_result["score"]
        + certs_result["score"]
        + formatting_result["score"]
    )

    # Determine overall grade
    if total >= 85:
        grade, grade_label = "A", "Excellent"
    elif total >= 70:
        grade, grade_label = "B", "Good"
    elif total >= 55:
        grade, grade_label = "C", "Average"
    elif total >= 40:
        grade, grade_label = "D", "Needs Work"
    else:
        grade, grade_label = "F", "Poor"

    # Collect all tips
    all_tips = []
    for r in [skills_result, experience_result, projects_result, education_result, certs_result, formatting_result]:
        all_tips.extend(r.get("tips", []))

    # Only keep improvement tips (exclude "looks great" messages if score is low)
    improvement_tips = [t for t in all_tips if not any(w in t.lower() for w in ["strong", "great", "complete", "comprehensive", "well-written", "look"])]
    if not improvement_tips:
        improvement_tips = ["Your resume is well-optimized for ATS systems!"]

    return {
        "total_score": total,
        "max_score": 100,
        "grade": grade,
        "grade_label": grade_label,
        "breakdown": {
            "skills":        {"label": "Skills & Technologies", "score": skills_result["score"],      "max": 25, "tips": skills_result["tips"]},
            "experience":    {"label": "Work Experience",       "score": experience_result["score"],  "max": 20, "tips": experience_result["tips"]},
            "projects":      {"label": "Projects",              "score": projects_result["score"],    "max": 20, "tips": projects_result["tips"]},
            "education":     {"label": "Education",             "score": education_result["score"],   "max": 15, "tips": education_result["tips"]},
            "certifications":{"label": "Certifications",        "score": certs_result["score"],       "max": 10, "tips": certs_result["tips"]},
            "formatting":    {"label": "Formatting & Keywords", "score": formatting_result["score"],  "max": 10, "tips": formatting_result["tips"]},
        },
        "improvement_tips": improvement_tips[:6],  # top 6 tips
    }
