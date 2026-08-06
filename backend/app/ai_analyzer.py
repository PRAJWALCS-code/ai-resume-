import os
import json
import urllib.request
import urllib.error

# Load Gemini API Key from environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

def get_fallback_analysis(resume) -> dict:
    """
    Fallback method that generates a rich, highly tailored analysis 
    using local parsing rules. Used when GEMINI_API_KEY is not set or API fails.
    """
    skills = (resume.extracted_skills or "").lower()
    experience = (resume.extracted_experience or "").lower()
    projects = (resume.extracted_projects or "").lower()
    education = (resume.extracted_education or "").lower()
    certs = (resume.extracted_certifications or "").lower()

    missing_keywords = []
    grammar_issues = []
    weak_projects = []
    formatting_improvements = []
    ai_suggestions = []

    # 1. Missing Keyword Analysis
    common_tech = ["docker", "kubernetes", "aws", "ci/cd", "typescript", "redis", "postgresql", "graphql", "agile"]
    for tech in common_tech:
        if tech not in skills and tech not in experience and tech not in projects:
            missing_keywords.append(tech.capitalize())
    
    if len(missing_keywords) > 5:
        missing_keywords = missing_keywords[:5]

    # 2. Grammar & Style Issues Check
    if "i " in experience or "i " in projects:
        grammar_issues.append({
            "issue": "First-person pronoun usage ('I')",
            "suggestion": "Convert to action-oriented bullet points (e.g. 'I managed the team' -> 'Managed the team').",
            "context": "Found personal pronouns ('I', 'me', 'my') in experience/projects."
        })
    
    # Check for passive verbs
    if "was responsible for" in experience:
        grammar_issues.append({
            "issue": "Passive phrasing ('was responsible for')",
            "suggestion": "Replace with strong, direct action verbs (e.g. 'Led development' instead of 'Was responsible for development').",
            "context": "Found 'was responsible for' in work experience."
        })
    
    if not grammar_issues:
        grammar_issues.append({
            "issue": "Weak action verb choice",
            "suggestion": "Upgrade common verbs like 'helped' or 'worked on' to higher-impact words like 'engineered', 'streamlined', or 'spearheaded'.",
            "context": "Generic verbs identified in role descriptions."
        })

    # 3. Weak Project Descriptions
    project_lines = [l.strip() for l in (resume.extracted_projects or "").split('\n') if l.strip()]
    if project_lines:
        first_proj = project_lines[0]
        weak_projects.append({
            "project": first_proj[:30] + "..." if len(first_proj) > 30 else first_proj,
            "issue": "Lacks quantified results and metric metrics.",
            "suggestion": "Add concrete impact figures (e.g., 'achieved 30% speedup', 'supported 100+ active daily users')."
        })
    else:
        weak_projects.append({
            "project": "General Project Profile",
            "issue": "No dedicated projects segment identified.",
            "suggestion": "Add at least 2 technical projects showcasing actual usage of your primary languages/frameworks."
        })

    # 4. Formatting Improvements
    if not resume.extracted_phone or resume.extracted_phone == "N/A":
        formatting_improvements.append("Add a valid phone number in the header section.")
    if not resume.extracted_email or resume.extracted_email == "N/A":
        formatting_improvements.append("Include a professional email address for callbacks.")
    
    formatting_improvements.extend([
        "Utilize clear font hierarchies and section dividers.",
        "Verify margins are aligned consistently (0.5 to 1.0 inch is standard).",
        "Keep total length constrained to 1-2 pages maximum."
    ])

    # 5. General AI Suggestions
    if len(skills.split(',')) < 5:
        ai_suggestions.append("Group your technical skills into categorized lists (e.g. Languages, Frameworks, Databases, Tools).")
    
    ai_suggestions.extend([
        "Order your experiences in reverse chronological order with clearly defined dates.",
        "Ensure every bullet point follows the STAR method (Situation, Task, Action, Result).",
        "Align skill keywords precisely with target job descriptions."
    ])

    summary = f"Resume for {resume.extracted_name or 'Applicant'} contains solid core segments but needs adjustments. Specifically, enhancing keyword coverage in Skills and adding metrics in Experience will optimize search-engine match score."

    return {
        "missing_keywords": missing_keywords,
        "grammar_issues": grammar_issues,
        "weak_projects": weak_projects,
        "formatting_improvements": formatting_improvements[:4],
        "ai_suggestions": ai_suggestions[:3],
        "summary": summary
    }

def analyze_resume_content(resume) -> dict:
    """
    Performs AI analysis on the parsed resume.
    Tries calling Gemini API. Falls back to get_fallback_analysis if key is missing or calls fail.
    """
    if not GEMINI_API_KEY:
        print("GEMINI_API_KEY not configured. Falling back to local rules engine.")
        return get_fallback_analysis(resume)

    prompt = f"""
    You are an expert ATS (Applicant Tracking System) reviewer and hiring manager.
    Analyze this candidate's resume content and return a JSON object with specific recommendations.
    
    Resume details:
    Name: {resume.extracted_name or 'N/A'}
    Email: {resume.extracted_email or 'N/A'}
    Phone: {resume.extracted_phone or 'N/A'}
    Skills: {resume.extracted_skills or ''}
    Education: {resume.extracted_education or ''}
    Experience: {resume.extracted_experience or ''}
    Projects: {resume.extracted_projects or ''}
    Certifications: {resume.extracted_certifications or ''}

    Output EXACTLY a JSON object with these keys (do not include markdown wrapper, return raw JSON string):
    {{
        "missing_keywords": ["list of 3-5 technical keywords or tools relevant to this candidate's profile that are missing or recommended to add"],
        "grammar_issues": [
            {{
                "issue": "description of grammar/style issue (e.g. passive voice, pronoun usage, tense mismatch)",
                "suggestion": "how to correct it with example rewrite",
                "context": "where this issue is found (e.g. under Experience at company X)"
            }}
        ],
        "weak_projects": [
            {{
                "project": "name of the project",
                "issue": "why it's weak (e.g. lacks metrics, generic description)",
                "suggestion": "specific technical improvement / example rewrite adding details"
            }}
        ],
        "formatting_improvements": ["2-3 specific formatting layout guidelines based on the extracted fields"],
        "ai_suggestions": ["3 general resume optimization recommendations"],
        "summary": "a brief 2-sentence expert summary of the resume's strengths and core area for improvement"
    }}
    """

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    
    request_data = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }
    
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(request_data).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        
        with urllib.request.urlopen(req, timeout=15) as response:
            res_body = response.read().decode("utf-8")
            data = json.loads(res_body)
            
            # Extract raw response text
            text_response = data["candidates"][0]["content"]["parts"][0]["text"]
            
            # Parse the JSON response from Gemini
            parsed_analysis = json.loads(text_response)
            return parsed_analysis
            
    except Exception as e:
        print(f"Error calling Gemini API: {str(e)}. Falling back to local rules engine.")
        return get_fallback_analysis(resume)
