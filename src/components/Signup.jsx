import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, XCircle, Check, X, Sparkles, ArrowRight, ShieldCheck, Cpu, Award } from 'lucide-react';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const getPasswordCriteria = () => {
    const password = formData.password;
    return {
      length: password.length >= 6,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /[0-9!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const criteria = getPasswordCriteria();

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.username.trim()) {
      tempErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      tempErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else {
      if (!criteria.length || !criteria.hasLetter || !criteria.hasNumber) {
        tempErrors.password = 'Password does not meet requirement criteria';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
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

    const result = await signup(formData.username, formData.email, formData.password);

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

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 lg:p-8 bg-grid-dots overflow-hidden">
      {/* Dynamic ambient glowing mesh */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[130px] animate-pulse-slow"></div>
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[130px] animate-pulse-slow"></div>
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-cyan-600/10 blur-[160px]"></div>

      <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 glass-strong shadow-2xl lg:grid-cols-12 animate-fade-in">
        
        {/* Left Side: Brand Showcase */}
        <div className="relative flex flex-col justify-between p-8 lg:col-span-5 lg:p-12 bg-gradient-to-br from-purple-950/60 via-slate-900/80 to-indigo-950/60 border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>

          <div>
            {/* Brand Emblem */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30 neon-border-indigo">
                <Sparkles className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-heading text-white tracking-wide">
                  ResumeAI<span className="text-purple-400">.pro</span>
                </h1>
                <p className="text-[10px] uppercase font-semibold tracking-widest text-purple-300/70">
                  Career Intelligence Suite
                </p>
              </div>
            </div>

            {/* Pitch */}
            <div className="mt-10 space-y-4">
              <h2 className="text-2xl font-extrabold text-white font-heading leading-tight lg:text-3xl">
                Start Optimizing Your <br />
                <span className="gradient-text-vivid">Career Trajectory</span>
              </h2>
              <p className="text-sm text-slate-300/80 leading-relaxed">
                Join thousands of software engineers, managers, and data professionals beating ATS algorithms and landing top interview calls.
              </p>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xl font-bold text-white font-mono">98%</p>
              <p className="text-[11px] text-slate-400">ATS Parsing Accuracy</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xl font-bold text-emerald-400 font-mono">3.2x</p>
              <p className="text-[11px] text-slate-400">More Interview Invites</p>
            </div>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="flex flex-col justify-center p-8 lg:col-span-7 lg:p-12 bg-slate-950/40">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-6">
              <h3 className="text-2xl font-bold font-heading text-white">Create your account</h3>
              <p className="mt-1 text-xs font-medium text-slate-400">
                Get started with full access to ATS scores & AI career tools
              </p>
            </div>

            {apiError && (
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-medium text-rose-300 animate-slide-up">
                <XCircle className="h-5 w-5 shrink-0 text-rose-400" />
                <span>{apiError}</span>
              </div>
            )}

            {success && (
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-medium text-emerald-300 animate-slide-up">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                <span>Account created! Navigating to dashboard...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Full Name / Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Alex Morgan"
                    className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-sm glass-input placeholder:text-slate-600 ${
                      errors.username ? 'border-rose-500/50' : ''
                    }`}
                  />
                </div>
                {errors.username && <p className="mt-1 text-xs text-rose-400">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
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
                    placeholder="alex@company.com"
                    className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-sm glass-input placeholder:text-slate-600 ${
                      errors.email ? 'border-rose-500/50' : ''
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Password
                </label>
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
                    className={`w-full rounded-xl pl-10 pr-11 py-2.5 text-sm glass-input placeholder:text-slate-600 ${
                      errors.password ? 'border-rose-500/50' : ''
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
                {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-sm glass-input placeholder:text-slate-600 ${
                      errors.confirmPassword ? 'border-rose-500/50' : ''
                    }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-rose-400">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Password complexity indicators */}
              <div className="flex items-center gap-4 rounded-lg bg-white/5 p-2.5 text-[11px] border border-white/5">
                <div className={`flex items-center gap-1 ${criteria.length ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {criteria.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  <span>6+ chars</span>
                </div>
                <div className={`flex items-center gap-1 ${criteria.hasLetter ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {criteria.hasLetter ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  <span>Letters</span>
                </div>
                <div className={`flex items-center gap-1 ${criteria.hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {criteria.hasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  <span>Number/Symbol</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || success}
                className="w-full cursor-pointer rounded-xl glass-button-primary py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 group transition-all"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">Already registered?</span>
              <Link
                to="/login"
                className="font-semibold text-purple-400 hover:text-purple-300 hover:underline flex items-center gap-1"
              >
                Sign In <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;
