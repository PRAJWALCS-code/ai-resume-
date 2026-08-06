import os
import json
import urllib.request
import urllib.error

# Load Gemini API Key from environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

def get_fallback_chatbot_response(resume, message: str) -> str:
    """
    Fallback method that generates highly tailored career advice 
    using local parsing rules when GEMINI_API_KEY is missing or API fails.
    """
    msg_lower = message.lower()
    name = resume.extracted_name or "Applicant"
    skills = [s.strip() for s in (resume.extracted_skills or "").split(',') if s.strip()]
    
    # 1. Project-related questions
    if "project" in msg_lower or "portfolio" in msg_lower:
        if resume.extracted_projects:
            return (
                f"Hi {name}, looking at your projects section, you have some great work highlighted. "
                "To make them stand out to placement cells, ensure each description details: \n"
                "1. The specific stack used (e.g. React + Node.js).\n"
                "2. Your individual contribution (e.g. 'Engineered backend databases').\n"
                "3. Quantifiable outcomes (e.g. 'boosted performance by 25%')."
            )
        else:
            return (
                f"Hi {name}, I noticed you don't have a dedicated projects section. "
                "I highly recommend adding at least two real-world projects showing full-stack, cloud, or automation implementation. "
                "This significantly increases callback rates from recruiters."
            )

    # 2. Skill-related questions
    if "skill" in msg_lower or "learn" in msg_lower or "technology" in msg_lower:
        if skills:
            main_skill = skills[0]
            recommendations = ["Docker/Kubernetes", "AWS or cloud basics", "CI/CD automation configurations"]
            return (
                f"Based on your profile, you have solid skills in {', '.join(skills[:3])}. "
                f"To expand your portfolio, I recommend focusing on learning: \n"
                f"- Advanced concepts in {main_skill}.\n"
                f"- Infrastructure tools like {', '.join(recommendations)}.\n"
                "This maps to high-paying backend and DevOps engineering positions."
            )
        else:
            return (
                f"Hi {name}, since no technical skills were extracted, your first step is to add a dedicated skills table. "
                "List core programming languages (Python, JS, Go), frameworks (React, FastAPI), and databases (Postgres, Mongo) "
                "clearly to pass basic ATS screening filters."
            )

    # 3. Interview or placement-related questions
    if "interview" in msg_lower or "placement" in msg_lower or "job" in msg_lower:
        return (
            f"For mock interviews, prepare to discuss your experience points in detail using the STAR method: "
            "Situation, Task, Action, Result. Recruiters at tech firms will likely focus on: \n"
            "- Core data structures and algorithms.\n"
            "- System architecture and database designs.\n"
            "- How you resolved bottlenecks in your project descriptions."
        )

    # Default advisor response
    return (
        f"Hi {name}, I'm your AI career advisor. You can ask me career, placement, interview, resume, and skill-related questions! "
        "For example, ask: 'What skills should I learn next?' or 'How can I prepare for my upcoming frontend interview?'"
    )

def generate_chat_response(resume, message: str, history: list) -> str:
    """
    Calls the Gemini API to get a resume-aware career advice response.
    Falls back to local rule-based response if GEMINI_API_KEY is not configured or fails.
    """
    if not GEMINI_API_KEY:
        print("GEMINI_API_KEY not configured. Chatbot falling back to local advisor engine.")
        return get_fallback_chatbot_response(resume, message)

    # Build system instructions context
    system_context = f"""You are Antigravity, an expert placement officer and career coach chatbot.
    You will help the student prepare for placement, interviews, skills development, and resume building.
    
    Here is the student's resume context:
    Name: {resume.extracted_name or 'N/A'}
    Email: {resume.extracted_email or 'N/A'}
    Skills: {resume.extracted_skills or 'N/A'}
    Education: {resume.extracted_education or 'N/A'}
    Experience: {resume.extracted_experience or 'N/A'}
    Projects: {resume.extracted_projects or 'N/A'}
    Certifications: {resume.extracted_certifications or 'N/A'}

    Keep your advice highly practical, encouraging, and specific to the candidate's skills and experience. Always speak directly to the student.
    """

    # Assemble request contents
    contents = []
    
    # 1. System Prompt as first user message
    contents.append({
        "role": "user",
        "parts": [{"text": system_context}]
    })
    
    # Prepend assistant confirmation to make the conversation flow cleanly
    contents.append({
        "role": "model",
        "parts": [{"text": "Acknowledged. I am ready to advise this student based on their resume context. How can I help?"}]
    })

    # 2. Append history
    for msg in history:
        # Convert role: user -> user, assistant -> model (gemini requirements)
        role = "user" if msg.get("role") == "user" else "model"
        contents.append({
            "role": role,
            "parts": [{"text": msg.get("content", "")}]
        })

    # 3. Append current user message
    contents.append({
        "role": "user",
        "parts": [{"text": message}]
    })

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    
    request_data = {
        "contents": contents
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
            
            # Extract response text
            text_response = data["candidates"][0]["content"]["parts"][0]["text"]
            return text_response
            
    except Exception as e:
        print(f"Error calling Gemini Chat API: {str(e)}. Falling back to local rules chatbot.")
        return get_fallback_chatbot_response(resume, message)
