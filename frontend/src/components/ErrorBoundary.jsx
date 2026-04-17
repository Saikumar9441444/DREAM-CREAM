import React from 'react';

/**
 * Global Safety Shield for the Cream Dream Application
 * This catches unexpected crashes and shows a premium "Oops" message instead of a white screen.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to your analytics service if you have one
    console.error("Critical UI Failure:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-white" style={{ background: 'var(--color-bg)' }}>
          <div className="glass-panel p-12 max-w-md">
            <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)' }}>Melted!</h1>
            <p className="text-lg opacity-70 mb-8">
              Oops! Something went a bit wrong on this page. Our team of ice cream artisans has been notified and is fixing it.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="btn-primary"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
