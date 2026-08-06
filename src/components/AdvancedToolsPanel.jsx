import React, { useState } from 'react';
import {
  Target, Map, GitCompare, HelpCircle, BarChart3,
  ChevronDown, CheckCircle, XCircle, Loader2,
  BookOpen, Clock, Zap, TrendingUp, Users, FileText,
  Award, Brain, ChevronRight, AlertCircle, Lightbulb, Copy, Check, Sparkles, Send, DollarSign
} from 'lucide-react';
import { toast } from './ToastProvider';

// ─── Role Roadmaps ────────────────────────────────────────────────────────────
const ROLE_ROADMAPS = {
  "Frontend Developer": {
    required: ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Git"],
    roadmap: {
      "30 Days": ["Master React Hooks & Context API", "Build a portfolio project with React", "Learn TypeScript basics", "Study responsive design (Flexbox/Grid)"],
      "60 Days": ["Learn Next.js & SSR/SSG concepts", "Master state management (Zustand/Redux)", "Integrate REST APIs with Axios/Fetch", "Unit testing with Jest & React Testing Library"],
      "90 Days": ["Build a production-grade full-stack app", "Deploy on Vercel/Netlify with CI/CD", "Learn Web performance optimization", "Contribute to an open source React project"]
    }
  },
  "Backend Developer": {
    required: ["Python", "Node.js", "REST APIs", "SQL", "Docker", "Git"],
    roadmap: {
      "30 Days": ["Build CRUD APIs with FastAPI or Express", "Master SQL joins, indexes & optimization", "Learn JWT authentication patterns", "Implement proper error handling & logging"],
      "60 Days": ["Learn Docker containerization basics", "Implement caching with Redis", "Study async programming patterns", "Add comprehensive API testing with Pytest/Jest"],
      "90 Days": ["Deploy microservices with Docker Compose", "Set up CI/CD pipelines with GitHub Actions", "Implement message queues (Celery/RabbitMQ)", "Design scalable database schemas for production"]
    }
  },
  "Full Stack Developer": {
    required: ["JavaScript", "React", "Node.js", "SQL", "Docker", "AWS"],
    roadmap: {
      "30 Days": ["Complete a full-stack project (React + FastAPI)", "Master environment variables and secrets management", "Learn database migration strategies", "Build and deploy with Docker"],
      "60 Days": ["Study cloud basics (AWS S3, EC2, RDS)", "Implement OAuth 2.0 / social login", "Learn WebSockets for real-time features", "Build a professional portfolio with 3+ projects"],
      "90 Days": ["Deploy on AWS or GCP with auto-scaling", "Implement advanced observability (logging, tracing)", "Learn system design fundamentals", "Prepare LeetCode mediums for technical interviews"]
    }
  },
  "Data Scientist": {
    required: ["Python", "Pandas", "NumPy", "Scikit-learn", "SQL", "Statistics"],
    roadmap: {
      "30 Days": ["Master Pandas for data wrangling & EDA", "Build 3 Kaggle classification/regression projects", "Learn feature engineering techniques", "Study core statistics: distributions, hypothesis testing"],
      "60 Days": ["Implement ML pipelines with Scikit-learn", "Learn deep learning basics with TensorFlow/PyTorch", "Build visualizations with Matplotlib/Seaborn", "Study NLP fundamentals: tokenization, embeddings"],
      "90 Days": ["Deploy an ML model as an API with FastAPI", "Complete an end-to-end Kaggle competition", "Learn MLflow for experiment tracking", "Study model evaluation, bias, and fairness metrics"]
    }
  },
  "DevOps Engineer": {
    required: ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS", "Terraform"],
    roadmap: {
      "30 Days": ["Master Linux CLI and shell scripting", "Containerize an application with Docker & Compose", "Set up a GitHub Actions CI/CD pipeline", "Learn NGINX reverse proxy configuration"],
      "60 Days": ["Deploy a Kubernetes cluster (Minikube/K3s)", "Implement infrastructure as code with Terraform", "Monitor systems with Prometheus & Grafana", "Study Helm charts for K8s app packaging"],
      "90 Days": ["Deploy production workloads on AWS EKS/GCP GKE", "Implement GitOps with ArgoCD", "Study security best practices (RBAC, secrets management)", "Obtain AWS Solutions Architect Associate certification"]
    }
  }
};

const STAGE_COLORS = {
  "30 Days": { bg: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/30", text: "text-blue-300", dot: "bg-blue-500" },
  "60 Days": { bg: "from-purple-500/20 to-indigo-500/20", border: "border-purple-500/30", text: "text-purple-300", dot: "bg-purple-500" },
  "90 Days": { bg: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30", text: "text-emerald-300", dot: "bg-emerald-500" },
};

// ─── Skill Gap Tab Component ──────────────────────────────────────────────────
const SkillGapTab = ({ selectedResumeId }) => {
  const [selectedRole, setSelectedRole] = useState("Frontend Developer");
  const roleData = ROLE_ROADMAPS[selectedRole];
  const matchedSkills = ["HTML", "CSS", "JavaScript", "React"];
  const missingSkills = roleData.required.filter(s => !matchedSkills.includes(s));
  const matchPct = Math.round((matchedSkills.length / roleData.required.length) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Role Selection */}
      <div className="flex flex-wrap gap-2">
        {Object.keys(ROLE_ROADMAPS).map(role => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
              selectedRole === role
                ? 'bg-purple-600 border-purple-500 text-white shadow-lg'
                : 'bg-white/5 border-white/10 text-slate-400 hover:border-purple-500/30 hover:text-purple-300'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Skill Gap Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-strong rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center text-center">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Target Role Match</h4>
          <div className="relative flex items-center justify-center h-32 w-32">
            <svg className="w-full h-full -rotate-90">
              <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              <circle
                cx="64" cy="64" r="54" fill="none"
                stroke={matchPct >= 70 ? "#10b981" : "#818cf8"}
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${3.39 * matchPct} ${339 - 3.39 * matchPct}`}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white font-mono">{matchPct}%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Alignment</span>
            </div>
          </div>
          <span className="mt-4 text-xs font-bold text-purple-300">{selectedRole}</span>
        </div>

        <div className="glass-strong rounded-2xl p-6 border border-white/10 md:col-span-2 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Matched Core Skills</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {matchedSkills.map(s => (
                <span key={s} className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              <span>Skills to Acquire for Top Competitiveness</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map(s => (
                <span key={s} className="px-3 py-1 rounded-xl text-xs font-bold bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 30/60/90 Day Roadmap */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Map className="h-4 w-4 text-purple-400" />
          <span>Tailored 30 / 60 / 90 Day Upskilling Roadmap</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(roleData.roadmap).map(([stage, tasks]) => {
            const colors = STAGE_COLORS[stage];
            return (
              <div key={stage} className={`rounded-2xl p-5 bg-gradient-to-br ${colors.bg} border ${colors.border} space-y-3 glass-strong`}>
                <div className={`flex items-center gap-2 ${colors.text} text-xs font-bold uppercase tracking-wider`}>
                  <Clock className="h-4 w-4" />
                  <span>{stage} Milestone</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className={`h-1.5 w-1.5 rounded-full ${colors.dot} mt-1.5 shrink-0`} />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Cover Letter Generator Component ─────────────────────────────────────────
const CoverLetterTab = ({ api, selectedResumeId }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!jobTitle || !companyName) {
      toast.warning('Please specify target Job Title and Company Name');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post(`/api/resumes/${selectedResumeId}/generate-cover-letter`, {
        target_role: jobTitle,
        company_name: companyName,
      });
      setResult(response.data.cover_letter);
      toast.success('Cover Letter generated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate cover letter');
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    toast.success('Cover letter copied to clipboard!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <form onSubmit={handleGenerate} className="glass-strong rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
          <FileText className="h-4.5 w-4.5 text-indigo-400" />
          <span>Tailored AI Cover Letter Generator</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full rounded-xl px-4 py-2.5 text-sm glass-input placeholder:text-slate-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Stripe, Google, Acme Corp"
              className="w-full rounded-xl px-4 py-2.5 text-sm glass-input placeholder:text-slate-600"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="glass-button-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          <span>{loading ? 'Generating Cover Letter...' : 'Generate Personalized Cover Letter'}</span>
        </button>
      </form>

      {result && (
        <div className="glass-strong rounded-2xl p-6 border border-indigo-500/30 space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>Generated Cover Letter</span>
            </h4>
            <button
              onClick={copyResult}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy to Clipboard</span>
            </button>
          </div>
          <div className="bg-slate-950/80 p-5 rounded-xl border border-white/10 text-xs leading-relaxed text-slate-200 font-mono whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Advanced Tools Panel ────────────────────────────────────────────────
const AdvancedToolsPanel = ({ api, selectedResumeId }) => {
  const [activeTab, setActiveTab] = useState('roadmap');

  return (
    <div className="glass-card p-6 lg:p-8 space-y-8 animate-fade-in shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl"></div>

      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <Brain className="h-4 w-4 animate-pulse text-indigo-400" />
            <span>AI Career Acceleration Suite</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white font-heading mt-1">
            Advanced Career Tools
          </h2>
        </div>

        {/* Tab Strip */}
        <div className="flex flex-wrap rounded-xl bg-slate-900/80 p-1 border border-white/10 shadow-inner">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'roadmap' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Map className="h-3.5 w-3.5" />
            Skill Gap & Roadmap
          </button>
          <button
            onClick={() => setActiveTab('coverletter')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'coverletter' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Cover Letter AI
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div>
        {activeTab === 'roadmap' && <SkillGapTab selectedResumeId={selectedResumeId} />}
        {activeTab === 'coverletter' && <CoverLetterTab api={api} selectedResumeId={selectedResumeId} />}
      </div>
    </div>
  );
};

export default AdvancedToolsPanel;
