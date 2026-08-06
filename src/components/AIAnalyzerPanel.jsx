import React, { useState } from 'react';
import { 
  Sparkles, BookOpen, AlertCircle, CheckCircle2, PenTool, Lightbulb, 
  AlignLeft, Target, Award, ArrowRight, LayoutList, RefreshCw, Cpu, Copy, Check
} from 'lucide-react';
import { toast } from './ToastProvider';

const AIAnalyzerPanel = ({ aiData }) => {
  if (!aiData) return null;

  const { missing_keywords, grammar_issues, weak_projects, formatting_improvements, ai_suggestions, summary } = aiData;
  const [activeTab, setActiveTab] = useState('summary');
  const [copiedKeyword, setCopiedKeyword] = useState(null);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyword(text);
    toast.success(`Copied "${text}" to clipboard!`);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  return (
    <div className="glass-card p-6 lg:p-8 space-y-8 animate-fade-in shadow-2xl relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl"></div>

      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase tracking-wider">
            <Cpu className="h-4 w-4 animate-pulse text-purple-400" />
            <span>AI Neural Analyzer Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white font-heading mt-1">
            Deep Profile Insights & Audit
          </h2>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap rounded-xl bg-slate-900/80 p-1 border border-white/10 self-stretch sm:self-auto shadow-inner">
          <button 
            onClick={() => setActiveTab('summary')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 ${
              activeTab === 'summary' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="h-3.5 w-3.5" />
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('keywords')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 ${
              activeTab === 'keywords' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            Keywords ({missing_keywords?.length || 0})
          </button>
          <button 
            onClick={() => setActiveTab('grammar')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 ${
              activeTab === 'grammar' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PenTool className="h-3.5 w-3.5" />
            Content Audit
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[220px]">

        {/* 1. Overview Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-6 animate-fade-in">
            {/* AI Summary Banner */}
            <div className="relative rounded-2xl p-6 bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-slate-900/40 border border-purple-500/20 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Sparkles className="h-36 w-36 text-purple-400" />
              </div>
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                Executive Summary Synthesis
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                "{summary}"
              </p>
            </div>

            {/* Suggestions & Formatting grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Profile Recommendations Card */}
              <div className="glass-strong rounded-2xl p-6 border border-white/10 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-purple-400" />
                  <span>Strategic Profile Enhancement</span>
                </h4>
                <ul className="space-y-3">
                  {ai_suggestions?.map((suggestion, idx) => (
                    <li key={idx} className="flex gap-3 text-xs text-slate-300 leading-relaxed items-start bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="h-2 w-2 rounded-full bg-purple-400 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Structural Improvements Card */}
              <div className="glass-strong rounded-2xl p-6 border border-white/10 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <AlignLeft className="h-4 w-4 text-indigo-400" />
                  <span>Formatting & Visual Structure</span>
                </h4>
                <ul className="space-y-3">
                  {formatting_improvements?.map((improvement, idx) => (
                    <li key={idx} className="flex gap-3 text-xs text-slate-300 leading-relaxed items-start bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="h-2 w-2 rounded-full bg-indigo-400 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* 2. Keywords Tab */}
        {activeTab === 'keywords' && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-strong rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                  <Target className="h-4.5 w-4.5 text-purple-400" />
                  <span>Recommended Industry Keywords</span>
                </h3>
                <span className="text-[11px] text-slate-400">Click any keyword to copy</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Integrating these high-frequency skill terms into your experience bullet points directly increases your ATS keyword matching score.
              </p>

              {missing_keywords && missing_keywords.length > 0 ? (
                <div className="flex flex-wrap gap-2.5 pt-2">
                  {missing_keywords.map((kw, i) => (
                    <button
                      key={i}
                      onClick={() => copyToClipboard(kw)}
                      className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:border-purple-400 hover:bg-purple-500/20 transition-all cursor-pointer flex items-center gap-2 group shadow-sm"
                    >
                      <Target className="h-3.5 w-3.5 text-purple-400 group-hover:rotate-45 transition-transform" />
                      <span>{kw}</span>
                      {copiedKeyword === kw ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3 text-slate-500 group-hover:text-purple-300 transition-colors" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Great job! No major technical keyword gaps detected in your resume.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Content Audit Tab */}
        {activeTab === 'grammar' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Content & Action Verbs Card */}
              <div className="glass-strong rounded-2xl p-6 border border-white/10 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <PenTool className="h-4 w-4 text-rose-400" />
                  <span>Grammar & Phrasing Observations</span>
                </h4>
                {grammar_issues && grammar_issues.length > 0 ? (
                  <ul className="space-y-3">
                    {grammar_issues.map((issue, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 leading-relaxed">
                        <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>No grammatical issues found!</span>
                  </div>
                )}
              </div>

              {/* Weak Projects / Bullets Card */}
              <div className="glass-strong rounded-2xl p-6 border border-white/10 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-amber-400" />
                  <span>Impact Metrics & Project Bullets</span>
                </h4>
                {weak_projects && weak_projects.length > 0 ? (
                  <ul className="space-y-3">
                    {weak_projects.map((proj, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
                        <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{proj}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>All project sections demonstrate metric impact!</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default AIAnalyzerPanel;
