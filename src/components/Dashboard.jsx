import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from './ToastProvider';
import { 
  LogOut, User, FileText, CheckCircle2, TrendingUp, Cpu, Calendar, ShieldCheck, 
  Mail, ArrowUpRight, Loader2, Download, Briefcase, GraduationCap, Code, Award, 
  FolderGit, Phone, Sparkles, Plus, Trash2, Layers, Target, Brain, Bot, LayoutGrid, Check
} from 'lucide-react';
import ATSScorePanel from './ATSScorePanel';
import AIAnalyzerPanel from './AIAnalyzerPanel';
import JobRecommendationPanel from './JobRecommendationPanel';
import AICareerChatbot from './AICareerChatbot';
import AdvancedToolsPanel from './AdvancedToolsPanel';

const Dashboard = () => {
  const { user, logout, api } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState({ uploading: false, error: '', success: '' });
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  
  const [atsData, setAtsData] = useState(null);
  const [loadingAts, setLoadingAts] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  const [activeTab, setActiveTab] = useState('ats'); // 'ats', 'ai', 'tools', 'jobs', 'chatbot', 'parsed'

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format file size helper
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Helper score color
  const getScoreColorClass = (s) => {
    if (s >= 85) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (s >= 70) return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
    if (s >= 55) return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
  };

  // Fetch upload history
  const fetchResumes = async (selectFirst = false) => {
    try {
      setLoadingResumes(true);
      const response = await api.get('/api/resumes');
      setResumes(response.data);
      if (response.data.length > 0) {
        if (selectFirst || !selectedResumeId || !response.data.some(r => r.id === selectedResumeId)) {
          setSelectedResumeId(response.data[0].id);
        }
      } else {
        setSelectedResumeId(null);
      }
    } catch (err) {
      console.error("Failed to load upload history", err);
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    fetchResumes(true);
  }, []);

  useEffect(() => {
    if (!selectedResumeId) {
      setAtsData(null);
      setAiData(null);
      setRecommendations([]);
      return;
    }

    const fetchAtsScore = async () => {
      try {
        setLoadingAts(true);
        const response = await api.get(`/api/resumes/${selectedResumeId}/ats-score`);
        setAtsData(response.data);
      } catch (err) {
        console.error("Failed to fetch ATS score", err);
        setAtsData(null);
      } finally {
        setLoadingAts(false);
      }
    };

    const fetchAiAnalysis = async () => {
      try {
        setLoadingAi(true);
        const response = await api.get(`/api/resumes/${selectedResumeId}/ai-analysis`);
        setAiData(response.data);
      } catch (err) {
        console.error("Failed to fetch AI analysis", err);
        setAiData(null);
      } finally {
        setLoadingAi(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        setLoadingRecs(true);
        const response = await api.get(`/api/resumes/${selectedResumeId}/recommendations`);
        setRecommendations(response.data);
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
        setRecommendations([]);
      } finally {
        setLoadingRecs(false);
      }
    };

    fetchAtsScore();
    fetchAiAnalysis();
    fetchRecommendations();
  }, [selectedResumeId]);

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  // Upload handler
  const handleUpload = async (file) => {
    if (!file) return;

    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (ext !== '.pdf' && ext !== '.docx') {
      toast.error('Invalid file format. Only PDF and DOCX files are allowed.');
      setUploadState({ uploading: false, error: 'Invalid format. Only PDF & DOCX allowed.', success: '' });
      return;
    }

    setUploadState({ uploading: true, error: '', success: '' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadState({ uploading: false, error: '', success: `Successfully parsed ${file.name}!` });
      toast.success(`✅ Resume uploaded! AI analysis ready.`);
      
      if (response.data && response.data.id) {
        setSelectedResumeId(response.data.id);
      }
      
      fetchResumes(false);
      setTimeout(() => setUploadState(prev => ({ ...prev, success: '' })), 4000);

    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to upload resume. Please try again.';
      setUploadState({ uploading: false, error: errorMsg, success: '' });
      toast.error(errorMsg);
    }
  };

  // Download handler
  const handleDownload = async (resumeId, filename) => {
    try {
      const response = await api.get(`/api/resumes/${resumeId}/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success(`Downloaded ${filename}`);
    } catch (err) {
      console.error("Download failed", err);
      toast.error("Failed to download resume file.");
    }
  };

  const avgScore = resumes.length > 0
    ? Math.round(resumes.reduce((acc, r) => acc + (r.ats_score || 0), 0) / resumes.length)
    : 0;

  const selectedResume = resumes.find(r => r.id === selectedResumeId);

  const getSkillsList = (skillsStr) => {
    if (!skillsStr) return [];
    return skillsStr
      .split(/[\n,;•*]|-/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && s.length < 30);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#07080c] text-white bg-grid-dots">
      
      {/* Dynamic ambient background glowing lights */}
      <div className="pointer-events-none fixed top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[140px]"></div>
      <div className="pointer-events-none fixed bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[140px]"></div>

      {/* Futuristic Glass Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 glass-strong py-3.5 px-6 md:px-12 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 text-white font-black text-lg shadow-lg shadow-indigo-500/30 neon-border-indigo">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-heading text-white tracking-wide">
              ResumeAI<span className="text-indigo-400">.pro</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Neural Engine Live
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-200 font-heading">{user?.username}</span>
            <span className="text-[11px] text-slate-400 font-mono">{user?.email}</span>
          </div>
          <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-rose-400 transition-all duration-200 cursor-pointer shadow-sm"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full space-y-8 animate-fade-in relative z-10">
        
        {/* Hero Banner / Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 lg:p-8 rounded-3xl glass-strong border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl"></div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Executive Career Workspace</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight font-heading text-white">
              Welcome back, <span className="gradient-text">{user?.username}</span>!
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Analyze ATS keyword alignment, generate tailored cover letters, and track recruiter performance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-xs text-emerald-300 font-bold shadow-inner">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>JWT Encrypted Session</span>
            </div>
          </div>
        </div>

        {/* Top Analytics Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-strong glass-card-hover rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Resumes Vault</span>
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-extrabold tracking-tight font-mono text-white">{resumes.length}</span>
              <span className="block text-[11px] font-semibold text-slate-400 mt-1">SQLite Encrypted Storage</span>
            </div>
          </div>

          <div className="glass-strong glass-card-hover rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg ATS Compatibility</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-extrabold tracking-tight font-mono text-emerald-400">
                {resumes.length > 0 ? `${avgScore}%` : '--'}
              </span>
              <span className="block text-[11px] font-semibold text-slate-400 mt-1">Recruiter Benchmark</span>
            </div>
          </div>

          <div className="glass-strong glass-card-hover rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Keyword Tokens</span>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Cpu className="h-5 w-5" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-extrabold tracking-tight font-mono text-white">
                {resumes.length > 0 ? (resumes.length * 28) : '--'}
              </span>
              <span className="block text-[11px] font-semibold text-purple-400 mt-1">Skills Vectorized</span>
            </div>
          </div>

          <div className="glass-strong glass-card-hover rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Assistant</span>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Bot className="h-5 w-5" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-extrabold tracking-tight font-mono text-cyan-300">Online</span>
              <span className="block text-[11px] font-semibold text-slate-400 mt-1">Gemini 2.5 Neural Advisor</span>
            </div>
          </div>
        </div>

        {/* Upload & Resume Selector Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Drag & Drop Hero Upload Zone */}
          <div className="lg:col-span-5 glass-strong rounded-3xl p-6 lg:p-8 border border-white/10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="space-y-3 mb-4">
              <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-400" />
                <span>Upload New Resume</span>
              </h3>
              <p className="text-xs text-slate-400">
                Drop your latest resume in PDF or DOCX format for instant ATS scoring and deep AI analysis.
              </p>
            </div>

            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`rounded-2xl p-8 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 relative ${
                dragActive 
                  ? 'border-indigo-500 bg-indigo-500/15 scale-[1.02]' 
                  : 'border-white/15 bg-white/5 hover:border-indigo-500/40 hover:bg-white/10'
              }`}
            >
              <input 
                type="file" 
                id="file-upload" 
                accept=".pdf,.docx" 
                onChange={(e) => handleUpload(e.target.files[0])}
                className="hidden"
              />
              
              <div className="flex flex-col items-center text-center space-y-3 pointer-events-none">
                <div className={`p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 transition-all shadow-lg ${
                  uploadState.uploading ? 'animate-bounce' : ''
                }`}>
                  <FileText className="h-8 w-8" />
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">
                    {uploadState.uploading ? 'Parsing resume vectors...' : 'Drag & Drop your resume file here'}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">Supports PDF & DOCX formats up to 10MB</p>
                </div>

                {!uploadState.uploading && (
                  <label 
                    htmlFor="file-upload" 
                    className="pointer-events-auto cursor-pointer mt-2 inline-flex px-5 py-2.5 text-xs font-bold text-white glass-button-primary rounded-xl shadow-lg transition-all active:scale-95"
                  >
                    Select File
                  </label>
                )}
              </div>

              {uploadState.error && (
                <div className="mt-4 w-full p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-center text-xs font-semibold text-rose-300 animate-fade-in">
                  {uploadState.error}
                </div>
              )}

              {uploadState.success && (
                <div className="mt-4 w-full p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-center text-xs font-semibold text-emerald-300 animate-fade-in">
                  {uploadState.success}
                </div>
              )}
            </div>
          </div>

          {/* Upload History / Active Resume Selector */}
          <div className="lg:col-span-7 glass-strong rounded-3xl p-6 lg:p-8 border border-white/10 flex flex-col justify-between shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                  <Layers className="h-5 w-5 text-purple-400" />
                  <span>Resume Vault & Selector</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Select an uploaded resume to view detailed analysis</p>
              </div>
              <span className="text-xs font-bold font-mono px-3 py-1 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {resumes.length} Files
              </span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {loadingResumes ? (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-slate-400">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                  <span className="text-xs">Fetching vault history...</span>
                </div>
              ) : resumes.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center text-center p-4">
                  <FileText className="h-10 w-10 text-slate-600 mb-2" />
                  <p className="text-xs font-bold text-slate-300">No resumes uploaded yet</p>
                  <p className="text-[11px] text-slate-500 mt-1">Upload a PDF or DOCX file to run ATS & AI evaluation.</p>
                </div>
              ) : (
                resumes.map((r) => {
                  const isSelected = selectedResumeId === r.id;
                  const score = r.ats_score || 0;

                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedResumeId(r.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-indigo-500/10 border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`p-2.5 rounded-xl border shrink-0 ${
                          isSelected ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-900 text-slate-400 border-white/10'
                        }`}>
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate font-heading">{r.filename}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {formatFileSize(r.file_size)} • {formatDate(r.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-bold font-mono ${getScoreColorClass(score)}`}>
                          {score}%
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(r.id, r.filename);
                          }}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition cursor-pointer"
                          title="Download File"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Tab Navigation for Active Resume Analysis */}
        {selectedResume && (
          <div className="space-y-6 pt-4">
            
            {/* Sliding Pill Tab Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-950/80 p-1.5 border border-white/10 shadow-inner">
                <button
                  onClick={() => setActiveTab('ats')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                    activeTab === 'ats' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>ATS Score Audit</span>
                </button>

                <button
                  onClick={() => setActiveTab('ai')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                    activeTab === 'ai' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Cpu className="h-4 w-4" />
                  <span>AI Deep Analysis</span>
                </button>

                <button
                  onClick={() => setActiveTab('tools')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                    activeTab === 'tools' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Brain className="h-4 w-4" />
                  <span>Career Power Tools</span>
                </button>

                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                    activeTab === 'jobs' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Target className="h-4 w-4" />
                  <span>Job Predictions</span>
                </button>

                <button
                  onClick={() => setActiveTab('chatbot')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                    activeTab === 'chatbot' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Bot className="h-4 w-4" />
                  <span>AI Assistant Chat</span>
                </button>

                <button
                  onClick={() => setActiveTab('parsed')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                    activeTab === 'parsed' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span>Extracted Text</span>
                </button>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Active Resume: <strong className="text-indigo-300">{selectedResume.filename}</strong>
              </div>
            </div>

            {/* Active Tab Views */}
            {activeTab === 'ats' && (
              loadingAts ? (
                <div className="glass-strong rounded-3xl p-12 border border-white/10 flex flex-col items-center justify-center min-h-[260px]">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-3" />
                  <p className="text-xs text-slate-400 font-semibold">Calculating multi-vector ATS scoring metrics...</p>
                </div>
              ) : (
                atsData && <ATSScorePanel atsData={atsData} />
              )
            )}

            {activeTab === 'ai' && (
              loadingAi ? (
                <div className="glass-strong rounded-3xl p-12 border border-white/10 flex flex-col items-center justify-center min-h-[260px]">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-500 mb-3" />
                  <p className="text-xs text-slate-400 font-semibold">Analyzing keyword coverage & profile strengths...</p>
                </div>
              ) : (
                aiData && <AIAnalyzerPanel aiData={aiData} />
              )
            )}

            {activeTab === 'tools' && (
              <AdvancedToolsPanel api={api} selectedResumeId={selectedResumeId} />
            )}

            {activeTab === 'jobs' && (
              loadingRecs ? (
                <div className="glass-strong rounded-3xl p-12 border border-white/10 flex flex-col items-center justify-center min-h-[260px]">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-3" />
                  <p className="text-xs text-slate-400 font-semibold">Matching profile against tech job roles...</p>
                </div>
              ) : (
                recommendations.length > 0 && <JobRecommendationPanel recommendations={recommendations} />
              )
            )}

            {activeTab === 'chatbot' && (
              <AICareerChatbot resumeId={selectedResumeId} api={api} />
            )}

            {activeTab === 'parsed' && (
              <div className="glass-card p-6 lg:p-8 space-y-6 animate-fade-in">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-xl font-bold font-heading text-white">Extracted Resume Profile Data</h3>
                    <p className="text-xs text-slate-400">Structured data parsed directly from {selectedResume.filename}</p>
                  </div>
                  <button
                    onClick={() => handleDownload(selectedResume.id, selectedResume.filename)}
                    className="glass-button-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download File</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass-strong p-5 rounded-2xl border border-white/10 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Personal Info</h4>
                    <p className="text-sm text-white font-bold">{selectedResume.extracted_name || 'N/A'}</p>
                    <p className="text-xs text-slate-300">{selectedResume.extracted_email || 'N/A'} • {selectedResume.extracted_phone || 'N/A'}</p>
                  </div>

                  <div className="glass-strong p-5 rounded-2xl border border-white/10 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">Extracted Skills</h4>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {getSkillsList(selectedResume.extracted_skills).map((skill, idx) => (
                        <span key={idx} className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="glass-strong p-5 rounded-2xl border border-white/10 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">Experience Section</h4>
                    <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                      {selectedResume.extracted_experience || 'No experience block detected'}
                    </pre>
                  </div>

                  <div className="glass-strong p-5 rounded-2xl border border-white/10 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Education & Projects</h4>
                    <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                      {selectedResume.extracted_education || 'No education block detected'}
                    </pre>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
