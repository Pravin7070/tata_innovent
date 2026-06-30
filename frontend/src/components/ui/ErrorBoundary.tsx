import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] w-full bg-automotive-black/50 rounded-xl border border-red-500/20 p-8 backdrop-blur-sm text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-widest text-automotive-white mb-2">System Fault Detected</h2>
          <p className="text-sm text-automotive-gray max-w-md mb-8">
            An unexpected error occurred within this component. Diagnostics have been logged.
          </p>
          <div className="p-4 bg-black/40 rounded-lg border border-automotive-gray/20 mb-8 max-w-lg w-full overflow-hidden text-left">
            <p className="text-xs text-red-400 font-mono break-words">
              {this.state.error?.message || 'Unknown Error'}
            </p>
          </div>
          <button 
            onClick={this.handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-automotive-blue/10 hover:bg-automotive-blue/20 border border-automotive-blue/30 text-automotive-blue rounded-lg transition-all duration-300 uppercase tracking-widest text-xs font-bold shadow-[0_0_10px_rgba(0,180,216,0.1)] hover:shadow-[0_0_15px_rgba(0,180,216,0.3)]"
          >
            <RefreshCcw className="w-4 h-4" />
            Reset Subsystem
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
