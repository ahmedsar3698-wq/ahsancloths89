import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AL HAFIZ CLOTHS ErrorBoundary caught:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0c0d10] text-white flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#14151c] border border-[#2b2d3c] rounded-2xl p-8 space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-950/80 border border-amber-600/50 text-[#d4af37] mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                AL HAFIZ CLOTHS
              </span>
              <h2 className="text-xl font-bold font-display text-white mt-1">
                Website Refresh Needed
              </h2>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                We updated our fabric catalog and color palette. Click below to load the fresh collection.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full py-3 bg-[#d4af37] hover:bg-[#e4c04e] text-black font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset & Reload Fresh Collection</span>
              </button>

              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="w-full py-2.5 bg-[#1b1c24] hover:bg-[#252733] text-neutral-300 text-xs rounded-lg transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
