import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const ToastContext = React.createContext(null);

const ICONS = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
  error:   <XCircle className="h-5 w-5 text-rose-400 shrink-0" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />,
  info:    <Info className="h-5 w-5 text-cyan-400 shrink-0" />,
};

const BORDERS = {
  success: 'border-emerald-500/30 shadow-[0_0_20px_-3px_rgba(16,185,129,0.2)]',
  error:   'border-rose-500/30 shadow-[0_0_20px_-3px_rgba(244,63,94,0.2)]',
  warning: 'border-amber-500/30 shadow-[0_0_20px_-3px_rgba(245,158,11,0.2)]',
  info:    'border-cyan-500/30 shadow-[0_0_20px_-3px_rgba(6,182,212,0.2)]',
};

const ACCENT_BARS = {
  success: 'bg-emerald-400',
  error:   'bg-rose-400',
  warning: 'bg-amber-400',
  info:    'bg-cyan-400',
};

let _addToast = null;

export const toast = {
  success: (msg, duration = 4000) => _addToast?.({ type: 'success', msg, duration }),
  error:   (msg, duration = 5000) => _addToast?.({ type: 'error', msg, duration }),
  warning: (msg, duration = 4000) => _addToast?.({ type: 'warning', msg, duration }),
  info:    (msg, duration = 4000) => _addToast?.({ type: 'info', msg, duration }),
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type, msg, duration }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, msg, duration }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  useEffect(() => {
    _addToast = addToast;
    return () => { _addToast = null; };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none max-w-sm w-full px-4">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`relative overflow-hidden flex items-center gap-3.5 px-4 py-3.5 rounded-xl border glass-strong pointer-events-auto animate-slide-up transition-all duration-300 w-full ${BORDERS[t.type]}`}
          >
            {ICONS[t.type]}
            <span className="text-xs font-semibold text-slate-100 flex-1 leading-snug">{t.msg}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-md hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Countdown accent line */}
            <div
              className={`absolute bottom-0 left-0 h-[2px] ${ACCENT_BARS[t.type]}`}
              style={{
                width: '100%',
                animation: `toast-progress ${t.duration || 4000}ms linear forwards`,
              }}
            />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
