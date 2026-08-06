import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, CheckCircle2, XCircle, Sparkles, ArrowRight, ShieldCheck, Cpu, Bot } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } else {
      setApiError(result.error);
      setIsSubmitting(false);
    }
  };

  // Helper quick demo fill
  const handleQuickDemo = () => {
    setFormData({ email: 'demo@example.com', password: 'password123' });
    setErrors({});
    setApiError('');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 lg:p-8 bg-grid-dots overflow-hidden">
      {/* Dynamic ambient glowing mesh */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[130px] animate-pulse-slow"></div>
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[130px] animate-pulse-slow"></div>
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-cyan-600/10 blur-[160px]"></div>

      <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 glass-strong shadow-2xl lg:grid-cols-12 animate-fade-in">
        
        {/* Left Side: Brand Showcase & Value Proposition */}
        <div className="relative flex flex-col justify-between p-8 lg:col-span-5 lg:p-12 bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-purple-950/60 border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
          {/* Decorative subtle orb */}
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>

          <div>
            {/* Brand Emblem */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 neon-border-indigo">
                <Sparkles className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-heading text-white tracking-wide">
                  ResumeAI<span className="text-indigo-400">.pro</span>
                </h1>
                <p className="text-[10px] uppercase font-semibold tracking-widest text-indigo-300/70">
                  Next-Gen Career Intelligence
                </p>
              </div>
            </div>

            {/* Hero Pitch */}
            <div className="mt-12 space-y-4">
              <h2 className="text-2xl font-extrabold text-white font-heading leading-tight lg:text-3xl">
                Unlock High-Score <br />
                <span className="gradient-text">ATS Optimization</span>
              </h2>
              <p className="text-sm text-slate-300/80 leading-relaxed">
                Supercharge your job application response rates with instant AI parsing, real-time keyword gap analysis, and tailored career tools.
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-10 space-y-3.5 border-t border-white/10 pt-8">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Cpu className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-slate-200">Deep AI Parser & Smart Scoring</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Bot className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-slate-200">24/7 Interactive AI Career Chatbot</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-slate-200">Enterprise Encrypted Storage</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex flex-col justify-center p-8 lg:col-span-7 lg:p-12 bg-slate-950/40">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
              <h3 className="text-2xl font-bold font-heading text-white">Welcome back</h3>
              <p className="mt-1.5 text-xs font-medium text-slate-400">
                Sign in to your workspace to analyze and refine your resume
              </p>
            </div>

            {apiError && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-medium text-rose-300 animate-slide-up">
                <XCircle className="h-5 w-5 shrink-0 text-rose-400" />
                <span>{apiError}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-medium text-emerald-300 animate-slide-up">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                <span>Authentication successful! Launching dashboard...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex.dev@company.com"
                    className={`w-full rounded-xl pl-10 pr-4 py-3 text-sm glass-input placeholder:text-slate-600 ${
                      errors.email ? 'border-rose-500/50 focus:border-rose-500' : ''
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-rose-400">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className={`w-full rounded-xl pl-10 pr-11 py-3 text-sm glass-input placeholder:text-slate-600 ${
                      errors.password ? 'border-rose-500/50 focus:border-rose-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-rose-400">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || success}
                className="w-full cursor-pointer rounded-xl glass-button-primary py-3.5 px-4 text-sm font-semibold flex items-center justify-center gap-2 group transition-all"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">Don't have an account?</span>
              <Link
                to="/signup"
                className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1"
              >
                Create Account <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
