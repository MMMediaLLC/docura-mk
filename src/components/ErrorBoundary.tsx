import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// ErrorBoundary must be a class component (React requirement for error boundaries)
export class ErrorBoundary extends React.Component<Props, State> {
  // Explicit declarations to satisfy TS with useDefineForClassFields: false
  declare state: State;
  declare props: Readonly<Props> & Readonly<{ children?: ReactNode }>;

  constructor(p: Props) {
    super(p);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-800 mb-3 tracking-tight">
            Something went wrong
          </h1>
          <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto leading-relaxed">
            The application encountered an unexpected error. Trying to recover or refresh the page.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-lg transition-all"
            >
              Refresh Page
            </button>
            <button
              onClick={() => { window.location.href = '/dashboard'; }}
              className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl shadow-sm transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children ?? null;
  }
}
