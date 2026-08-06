import os
import re
import pdfplumber
import docx

def extract_pdf_text(filepath: str) -> str:
    text = ""
    try:
        with pdfplumber.open(filepath) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"Error reading PDF {filepath}: {e}")
    return text

def extract_docx_text(filepath: str) -> str:
    text = ""
    try:
        doc = docx.Document(filepath)
        for p in doc.paragraphs:
            if p.text:
                text += p.text + "\n"
    except Exception as e:
        print(f"Error reading DOCX {filepath}: {e}")
    return text

def extract_name(text: str) -> str:
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    email_regex = r'[\w\.-]+@[\w\.-]+\.\w+'
    phone_regex = r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,3}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}'
    
    for line in lines[:8]:  # usually the name is in the first 8 lines
        lower_line = line.lower()
        # Skip if it contains email, phone, or website elements
        if re.search(email_regex, line) or re.search(phone_regex, line):
            continue
        if any(kw in lower_line for kw in ["http", "www", "github", "linkedin", "portfolio", "resume", "cv", "address", "location"]):
            continue
        # Skip if it contains digits (like zip codes or dates)
        if any(char.isdigit() for char in line):
            continue
        words = line.split()
        # Skip if line is too long or short
        if len(words) < 2 or len(words) > 4:
            continue
        # If the words start with uppercase letters, it's highly likely a name
        if all(w[0].isupper() or w[0].lower() in ["de", "von", "di", "la", "le"] for w in words if w):
            return line
            
    # Fallback to the first non-empty line
    if lines:
        return lines[0]
    return "N/A"

def parse_sections(text: str) -> dict:
    lines = [l.rstrip() for l in text.split('\n')]
    
    sections = {
        "skills": [],
        "education": [],
        "projects": [],
        "experience": [],
        "certifications": []
    }
    
    header_mapping = {
        "skills": ["skills", "key skills", "technical skills", "technologies", "core competencies", "expertise", "technical expertise", "programming languages"],
        "education": ["education", "academic background", "qualifications", "degrees", "academic profile", "academic credentials", "academic details"],
        "projects": ["projects", "academic projects", "personal projects", "key projects", "selected projects", "relevant projects", "technical projects"],
        "experience": ["experience", "work experience", "professional experience", "employment history", "work history", "professional background", "professional history", "work record"],
        "certifications": ["certifications", "licenses & certifications", "courses", "certificates", "credentials", "licenses", "awards & certifications"]
    }
    
    current_section = None
    
    for line in lines:
        cleaned_line = line.strip()
        if not cleaned_line:
            # Preserve blank lines if we're in a section and the last line wasn't blank
            if current_section and sections[current_section] and sections[current_section][-1] != "":
                sections[current_section].append("")
            continue
            
        # Check if this line is a section header
        is_header = False
        matched_sec = None
        
        words = cleaned_line.split()
        if len(words) <= 4:
            lower_line = cleaned_line.lower().rstrip(':').rstrip('.')
            for sec, headers in header_mapping.items():
                if lower_line in headers:
                    is_header = True
                    matched_sec = sec
                    break
                    
        if is_header:
            current_section = matched_sec
        elif current_section:
            sections[current_section].append(line)
            
    # Clean trailing empty lines from sections and join
    parsed = {}
    for sec, content in sections.items():
        while content and content[-1] == "":
            content.pop()
        parsed[sec] = "\n".join(content).strip()
        
    return parsed

def parse_resume(filepath: str) -> dict:
    _, ext = os.path.splitext(filepath.lower())
    text = ""
    if ext == ".pdf":
        text = extract_pdf_text(filepath)
    elif ext == ".docx":
        text = extract_docx_text(filepath)
        
    if not text:
        return {
            "name": "N/A",
            "email": "N/A",
            "phone": "N/A",
            "skills": "",
            "education": "",
            "projects": "",
            "experience": "",
            "certifications": ""
        }
        
    # Extract Email
    email_regex = r'[\w\.-]+@[\w\.-]+\.\w+'
    emails = re.findall(email_regex, text)
    email = emails[0] if emails else "N/A"
    
    # Extract Phone
    phone_regex = r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,3}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}'
    phones = re.findall(phone_regex, text)
    phone = phones[0] if phones else "N/A"
    
    name = extract_name(text)
    sections = parse_sections(text)
    
    return {
        "name": name,
        "email": email,
        "phone": phone,
        **sections
    }
