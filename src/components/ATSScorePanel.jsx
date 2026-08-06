import React, { useState } from 'react';
import { 
  Award, Briefcase, GraduationCap, Code, FolderGit, 
  FileText, CheckCircle2, AlertTriangle, HelpCircle, ChevronDown, ChevronUp, Sparkles, LayoutGrid, BarChart3, Info, TrendingUp, Check
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';

const categoryIcons = {
  skills: Code,
  experience: Briefcase,
  projects: FolderGit,
  education: GraduationCap,
  certifications: Award,
  formatting: FileText,
};

const categoryColors = {
  skills: { bar: 'from-blue-500 to-indigo-500', text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  experience: { bar: 'from-emerald-500 to-teal-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  projects: { bar: 'from-purple-500 to-pink-500', text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  education: { bar: 'from-amber-500 to-orange-500', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  certifications: { bar: 'from-cyan-500 to-blue-500', text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  formatting: { bar: 'from-violet-500 to-fuchsia-500', text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-white/10 glass-strong p-3 text-xs shadow-2xl space-y-1">
        <p className="font-bold text-white font-heading">{data.subject || data.name}</p>
        <p className="text-indigo-400 font-mono font-semibold">
          Score: {data.percentage || data.Score}%
        </p>
      </div>
    );
  }
  return null;
};

const ATSScorePanel = ({ atsData }) => {
  if (!atsData) return null;

  const { total_score, max_score, grade, grade_label, breakdown, improvement_tips } = atsData;
  const [expandedCategories, setExpandedCategories] = useState({});
  const [activeTab, setActiveTab] = useState('radar'); // 'radar' or 'bar'
  const [completedTips, setCompletedTips] = useState({});

  const toggleCategory = (key) => {
    setExpandedCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleTip = (index) => {
    setCompletedTips(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Grade color scheme
  const getGradeStyles = (g) => {
    switch (g) {
      case 'A': return { color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', fill: '#10b981', label: 'Platinum Compatibility' };
      case 'B': return { color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10', fill: '#6366f1', label: 'Strong Alignment' };
      case 'C': return { color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10', fill: '#f59e0b', label: 'Moderate Match' };
      case 'D': return { color: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/10', fill: '#f97316', label: 'Needs Optimization' };
      default: return { color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10', fill: '#f43f5e', label: 'Requires Attention' };
    }
  };

  const gradeStyle = getGradeStyles(grade);

  // Recharts Radar Chart Data
  const radarData = [
    { subject: 'Skills', percentage: Math.round((breakdown.skills.score / breakdown.skills.max) * 100) },
    { subject: 'Experience', percentage: Math.round((breakdown.experience.score / breakdown.experience.max) * 100) },
    { subject: 'Projects', percentage: Math.round((breakdown.projects.score / breakdown.projects.max) * 100) },
    { subject: 'Education', percentage: Math.round((breakdown.education.score / breakdown.education.max) * 100) },
    { subject: 'Certs', percentage: Math.round((breakdown.certifications.score / breakdown.certifications.max) * 100) },
    { subject: 'Formatting', percentage: Math.round((breakdown.formatting.score / breakdown.formatting.max) * 100) },
  ];

  // Recharts Bar Chart Data
  const barData = Object.keys(breakdown).map(key => ({
    name: breakdown[key].label.split(' ')[0],
    Score: Math.round((breakdown[key].score / breakdown[key].max) * 100),
    Max: 100,
  }));

  // SVG Circle calculations for overall score gauge
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (total_score / max_score) * circumference;

  return (
    <div className="glass-card p-6 lg:p-8 space-y-8 animate-fade-in shadow-2xl relative overflow-hidden">
      
      {/* Glow background accent */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="h-4 w-4 animate-pulse text-indigo-400" />
            <span>ATS Optimization Engine v2.4</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white font-heading mt-1">
            ATS Compatibility Score
          </h2>
        </div>
        <div className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-inner">
          <Info className="h-4 w-4 text-indigo-400 shrink-0" />
          <span>Scores above <strong className="text-emerald-400">75%</strong> significantly boost recruiter response rates.</span>
        </div>
      </div>

      {/* Top Section: Score Meter & Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Score Radial Meter */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 glass-strong rounded-2xl relative border border-white/10 group shadow-xl">
          <div className="relative flex items-center justify-center h-48 w-48">
            {/* Ambient ring glow */}
            <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl group-hover:bg-indigo-500/20 transition-all"></div>
            
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r={radius}
                className="stroke-slate-800/80"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="96"
                cy="96"
                r={radius}
                className="transition-all duration-1000 ease-out"
                stroke={gradeStyle.fill}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-extrabold tracking-tight text-white font-mono">{total_score}</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Match Index</span>
            </div>
          </div>

          <div className="mt-6 text-center space-y-2">
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border ${gradeStyle.border} ${gradeStyle.bg} ${gradeStyle.color} shadow-lg`}>
              <span className="h-2 w-2 rounded-full bg-current animate-ping" />
              Grade {grade} — {gradeStyle.label}
            </span>
          </div>
        </div>

        {/* Recharts Analytics Panel */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 glass-strong rounded-2xl border border-white/10 relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-400" />
              <span>Domain Score Coverage</span>
            </span>
            <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setActiveTab('radar')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                  activeTab === 'radar' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Radar View
              </button>
              <button
                onClick={() => setActiveTab('bar')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                  activeTab === 'bar' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bar Chart
              </button>
            </div>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'radar' ? (
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                  <Radar name="Compatibility" dataKey="percentage" stroke="#818cf8" fill="#6366f1" fillOpacity={0.45} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              ) : (
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Score" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.Score >= 80 ? '#10b981' : entry.Score >= 60 ? '#6366f1' : '#f59e0b'} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Category Detailed Breakdown Cards */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-indigo-400" />
          <span>Category Breakdown & Audit Details</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(breakdown).map((key) => {
            const item = breakdown[key];
            const Icon = categoryIcons[key] || FileText;
            const theme = categoryColors[key] || categoryColors.formatting;
            const isExpanded = expandedCategories[key];
            const pct = Math.round((item.score / item.max) * 100);

            return (
              <div
                key={key}
                className="glass-strong rounded-2xl p-5 border border-white/10 transition-all hover:border-white/20 shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${theme.bg} ${theme.border} ${theme.text}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">{item.label}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {item.score} / {item.max} Points
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg border ${theme.bg} ${theme.border} ${theme.text}`}>
                    {pct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden mb-3 border border-white/5">
                  <div
                    className={`h-full bg-gradient-to-r ${theme.bar} transition-all duration-700 rounded-full`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Quick Status Pill */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                  <span className="text-slate-400 text-[11px]">
                    {pct >= 85 ? '✅ Excellent Coverage' : pct >= 65 ? '⚡ Strong Match' : '⚠️ Improvement Recommended'}
                  </span>
                  {item.details && item.details.length > 0 && (
                    <button
                      onClick={() => toggleCategory(key)}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer flex items-center gap-1 text-[11px]"
                    >
                      {isExpanded ? 'Hide Details' : 'View Audit'}
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                  )}
                </div>

                {/* Accordion Audit Details */}
                {isExpanded && item.details && (
                  <ul className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs text-slate-300 animate-slide-up">
                    {item.details.map((d, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl border border-white/5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{d}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actionable Improvement Recommendations */}
      {improvement_tips && improvement_tips.length > 0 && (
        <div className="glass-strong rounded-2xl p-6 border border-amber-500/20 space-y-4 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0 animate-bounce" />
            <h3 className="font-heading text-base text-white">Recommended High-Impact Optimizations</h3>
          </div>
          <p className="text-xs text-slate-400">
            Check off actions as you refine your resume to systematically increase your score:
          </p>

          <div className="space-y-2.5">
            {improvement_tips.map((tip, index) => {
              const isChecked = completedTips[index];
              return (
                <div
                  key={index}
                  onClick={() => toggleTip(index)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-400 line-through'
                      : 'bg-white/5 border-white/10 hover:border-amber-500/40 text-slate-200'
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-600 bg-slate-900'
                    }`}
                  >
                    {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs leading-relaxed font-medium flex-1">{tip}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default ATSScorePanel;
