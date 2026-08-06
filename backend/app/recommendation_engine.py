# Recommendation Engine for suitable companies and job roles

COMPANY_PROFILES = [
    {
        "company_name": "Google",
        "role_name": "Backend Software Engineer",
        "required_skills": ["python", "go", "c++", "kubernetes", "docker", "gcp", "sql", "rest api"],
        "eligibility": "Bachelor's degree in Computer Science, 2+ years of backend development experience."
    },
    {
        "company_name": "Netflix",
        "role_name": "Senior Frontend Developer",
        "required_skills": ["javascript", "typescript", "react", "next.js", "graphql", "tailwind", "figma", "node"],
        "eligibility": "Bachelor's degree or equivalent experience, 4+ years of building web applications."
    },
    {
        "company_name": "Amazon",
        "role_name": "Cloud DevOps Engineer",
        "required_skills": ["aws", "docker", "kubernetes", "terraform", "jenkins", "bash", "linux", "ci/cd"],
        "eligibility": "1+ year cloud infrastructure deployment and infrastructure automation experience."
    },
    {
        "company_name": "Stripe",
        "role_name": "Full Stack Engineer",
        "required_skills": ["ruby", "javascript", "react", "postgresql", "rest api", "typescript", "node", "git"],
        "eligibility": "Strong system design skills, familiarity with API payment integrations."
    },
    {
        "company_name": "OpenAI",
        "role_name": "AI/ML Engineer",
        "required_skills": ["python", "pytorch", "tensorflow", "keras", "pandas", "numpy", "machine learning", "deep learning", "nlp", "ai"],
        "eligibility": "Master's or PhD in Computer Science or equivalent ML research and system scale experience."
    }
]

def format_skill_name(s: str) -> str:
    """Format short/acronym skill names to uppercase, others capitalized."""
    upper_case_acronyms = {"nlp", "gcp", "aws", "ai", "sql", "api", "rest api", "ci/cd"}
    if s.lower() in upper_case_acronyms:
        return s.upper()
    return s.capitalize()

def get_company_recommendations(resume) -> list:
    """
    Computes match metrics and eligibility criteria for suitable target companies 
    based on the resume's skills and experience.
    """
    skills = (resume.extracted_skills or "").lower()
    experience = (resume.extracted_experience or "").lower()
    combined_text = f"{skills} {experience}".lower()
    
    recommendations = []
    
    for profile in COMPANY_PROFILES:
        req_skills = profile["required_skills"]
        
        matched = []
        missing = []
        
        for skill in req_skills:
            if skill in combined_text:
                matched.append(format_skill_name(skill))
            else:
                missing.append(format_skill_name(skill))
                
        total_req = len(req_skills)
        if matched:
            base_score = 40
            skill_score = (len(matched) / total_req) * 60
            match_pct = round(base_score + skill_score)
        else:
            match_pct = 15
            
        match_pct = min(100, max(0, match_pct))
        
        recommendations.append({
            "company_name": profile["company_name"],
            "role_name": profile["role_name"],
            "match_percentage": match_pct,
            "matched_skills": matched,
            "missing_skills": missing,
            "required_skills": [format_skill_name(s) for s in req_skills],
            "eligibility": profile["eligibility"]
        })
        
    recommendations.sort(key=lambda x: x["match_percentage"], reverse=True)
    return recommendations
