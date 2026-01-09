import { Component } from 'react';
import { BORDER_RADIUS } from '../../utils/constants';

/**
 * ErrorBoundary Component
 * Catches JavaScript errors in child component tree and displays fallback UI.
 *
 * @example
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * @example With custom fallback
 * <ErrorBoundary fallback={<CustomError />}>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * @example With onError callback
 * <ErrorBoundary onError={(error, info) => logError(error, info)}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Store error info for display
    this.setState({ errorInfo });

    // Call optional error callback (for logging services like Sentry)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Component stack:', errorInfo?.componentStack);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call optional reset callback
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, FallbackComponent } = this.props;

    if (hasError) {
      // Custom fallback component with error props
      if (FallbackComponent) {
        return (
          <FallbackComponent error={error} errorInfo={errorInfo} resetError={this.handleReset} />
        );
      }

      // Custom fallback element
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <DefaultErrorFallback error={error} errorInfo={errorInfo} resetError={this.handleReset} />
      );
    }

    return children;
  }
}

/**
 * Default error fallback UI component
 * Styled to match the app's design system
 */
function DefaultErrorFallback({ error, errorInfo, resetError }) {
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-50 flex items-center justify-center p-6">
      <div
        className={`max-w-md w-full bg-white dark:bg-neutral-800 ${BORDER_RADIUS.card} shadow-lg border border-red-200 dark:border-red-900/50 overflow-hidden transition-colors duration-300`}
      >
        {/* Header */}
        <div className="bg-red-50 dark:bg-red-900/20 px-6 py-4 border-b border-red-100 dark:border-red-900/30">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 ${BORDER_RADIUS.badge} bg-red-100 dark:bg-red-900/40 flex items-center justify-center`}
            >
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
                Something went wrong
              </h2>
              <p className="text-sm text-red-600 dark:text-red-400">An unexpected error occurred</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-slate-600 dark:text-neutral-300 text-sm mb-4">
            We apologize for the inconvenience. Please try again or refresh the page.
          </p>

          {/* Error details in development */}
          {isDev && error && (
            <details className="mb-4">
              <summary className="text-xs text-slate-500 dark:text-neutral-400 cursor-pointer hover:text-slate-700 dark:hover:text-neutral-200 transition-colors">
                Show error details (dev only)
              </summary>
              <div
                className={`mt-2 p-3 bg-slate-100 dark:bg-neutral-900 ${BORDER_RADIUS.cardSmall} overflow-auto max-h-40`}
              >
                <pre className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap wrap-break-word">
                  {error.toString()}
                </pre>
                {errorInfo?.componentStack && (
                  <pre className="text-xs text-slate-500 dark:text-neutral-400 mt-2 whitespace-pre-wrap wrap-break-word">
                    {errorInfo.componentStack}
                  </pre>
                )}
              </div>
            </details>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={resetError}
              className={`flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium ${BORDER_RADIUS.cardSmall} transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800`}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className={`flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-slate-700 dark:text-neutral-200 text-sm font-medium ${BORDER_RADIUS.cardSmall} transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800`}
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Lightweight error boundary for smaller sections
 * Shows a minimal inline error message
 */
export function InlineErrorBoundary({ children, fallbackMessage = 'Failed to load this section' }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 text-center text-slate-500 dark:text-neutral-400 text-sm">
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {fallbackMessage}
          </span>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
