import React, { useState } from 'react';
import { 
  Building2, Briefcase, GraduationCap, CheckCircle2, AlertTriangle, 
  HelpCircle, ChevronDown, ChevronUp, Sparkles, Target, Info, ArrowUpRight, DollarSign, Bookmark
} from 'lucide-react';
import { toast } from './ToastProvider';

const JobRecommendationPanel = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) return null;

  const [expandedIndex, setExpandedIndex] = useState(0);
  const [bookmarked, setBookmarked] = useState({});

  const toggleBookmark = (idx, role) => {
    setBookmarked(prev => {
      const nextState = !prev[idx];
      if (nextState) toast.success(`Saved "${role}" to bookmarked jobs!`);
      return { ...prev, [idx]: nextState };
    });
  };

  const getMatchStyles = (pct) => {
    if (pct >= 80) {
      return {
        color: 'text-emerald-400',
        border: 'border-emerald-500/30',
        bg: 'bg-emerald-500/10',
        fill: '#10b981',
        label: 'Top Match'
      };
    } else if (pct >= 60) {
      return {
        color: 'text-indigo-400',
        border: 'border-indigo-500/30',
        bg: 'bg-indigo-500/10',
        fill: '#6366f1',
        label: 'Strong Fit'
      };
    } else {
      return {
        color: 'text-amber-400',
        border: 'border-amber-500/30',
        bg: 'bg-amber-500/10',
        fill: '#f59e0b',
        label: 'Moderate Alignment'
      };
    }
  };

  return (
    <div className="glass-card p-6 lg:p-8 space-y-8 animate-fade-in shadow-2xl relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-600/10 blur-3xl"></div>

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <Target className="h-4 w-4 animate-pulse text-emerald-400" />
            <span>AI Predictive Career Matcher</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white font-heading mt-1">
            Target Job Opportunities
          </h2>
        </div>
        <div className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl flex items-center gap-2">
          <Info className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Role predictions derived from extracted technical skill vectors.</span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Job Roles List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Recommended Opportunities ({recommendations.length})
          </span>
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {recommendations.map((rec, index) => {
              const matchStyle = getMatchStyles(rec.match_percentage);
              const isSelected = expandedIndex === index;

              return (
                <div
                  key={index}
                  onClick={() => setExpandedIndex(index)}
                  className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 border ${
                    isSelected 
                      ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5' 
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                  } flex items-center justify-between gap-4 glass-strong`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-emerald-400 shrink-0">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate font-heading">{rec.role_name}</h4>
                      <span className="text-xs text-slate-400 font-semibold">{rec.company_name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="block text-sm font-extrabold text-white font-mono">{rec.match_percentage}%</span>
                      <span className={`text-[9px] uppercase tracking-wider font-bold ${matchStyle.color}`}>
                        {matchStyle.label}
                      </span>
                    </div>
                    <ArrowUpRight className={`h-4 w-4 transition duration-300 ${isSelected ? 'text-emerald-400 translate-x-0.5 -translate-y-0.5' : 'text-slate-500'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detailed Skills Matching & Action Card */}
        <div className="lg:col-span-7">
          {(() => {
            const selected = recommendations[expandedIndex];
            const matchStyle = getMatchStyles(selected.match_percentage);
            const radius = 40;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (selected.match_percentage / 100) * circumference;

            return (
              <div className="glass-strong border border-white/10 rounded-2xl p-6 space-y-6 min-h-[420px] flex flex-col justify-between animate-fade-in shadow-xl">
                
                {/* Header detail */}
                <div className="flex justify-between items-start gap-4 pb-4 border-b border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      Job Opportunity Profile
                    </span>
                    <h3 className="text-xl font-extrabold text-white font-heading pt-2">{selected.role_name}</h3>
                    <div className="text-xs text-slate-300 font-semibold flex items-center gap-2 pt-0.5">
                      <Building2 className="h-4 w-4 text-emerald-400" />
                      <span>{selected.company_name}</span>
                    </div>
                  </div>

                  {/* Circular Score Badge */}
                  <div className="relative flex items-center justify-center h-20 w-20 shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        className="stroke-slate-800"
                        strokeWidth="7"
                        fill="transparent"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        className="transition-all duration-700 ease-out"
                        stroke={matchStyle.fill}
                        strokeWidth="7"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-base font-extrabold text-white font-mono">{selected.match_percentage}%</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Match</span>
                    </div>
                  </div>
                </div>

                {/* Skills breakdown */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Matching Skill Competencies</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.matching_skills?.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selected.missing_skills && selected.missing_skills.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Recommended Additional Skills</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selected.missing_skills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-xl text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => toggleBookmark(expandedIndex, selected.role_name)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all border ${
                      bookmarked[expandedIndex]
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${bookmarked[expandedIndex] ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>{bookmarked[expandedIndex] ? 'Bookmarked' : 'Save Role'}</span>
                  </button>

                  <a
                    href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(selected.role_name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-button-primary px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
                  >
                    <span>View Jobs on LinkedIn</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>

              </div>
            );
          })()}
        </div>

      </div>

    </div>
  );
};

export default JobRecommendationPanel;
