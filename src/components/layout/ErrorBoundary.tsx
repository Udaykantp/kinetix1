import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public declare readonly props: Readonly<ErrorBoundaryProps>;

  public state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected error occurred.',
    };
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application ErrorBoundary caught error:', error, info);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#17191C] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#101214] border border-[#25282D] rounded-2xl p-6 text-center space-y-4">
            <h2 className="text-lg font-bold text-[#F2F0EA]">Something went wrong</h2>
            <p className="text-xs text-[#8E959E] break-words">
              We encountered an unexpected error while syncing your account or order data.
            </p>
            <button
              type="button"
              onClick={() => {
                window.location.reload();
              }}
              className="px-5 py-2.5 bg-[#D6B98C] text-[#17191C] text-xs font-semibold rounded-lg hover:bg-[#E3CDA7] transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
