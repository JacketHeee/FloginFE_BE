import { Component } from 'react';
import './ErrorBoundary.scss';

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Logs errors and displays a fallback UI
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.error('Error caught by ErrorBoundary:', error);
      console.error('Error Info:', errorInfo);
    }

    // Store error details in state
    this.setState({
      error,
      errorInfo
    });

    // TODO: Log error to error reporting service (e.g., Sentry)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // Reload the page to reset the app
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary__container">
            <div className="error-boundary__icon">⚠️</div>
            <h1 className="error-boundary__title">Oops! Đã xảy ra lỗi</h1>
            <p className="error-boundary__message">
              Xin lỗi, có lỗi không mong muốn đã xảy ra. Vui lòng thử lại.
            </p>

            {(typeof window !== 'undefined' && window.location.hostname === 'localhost') && this.state.error && (
              <details className="error-boundary__details">
                <summary>Chi tiết lỗi (Development only)</summary>
                <pre className="error-boundary__stack">
                  <strong>Error:</strong> {this.state.error.toString()}
                  {'\n\n'}
                  <strong>Stack Trace:</strong>
                  {'\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="error-boundary__actions">
              <button 
                onClick={this.handleReset}
                className="error-boundary__button error-boundary__button--primary"
              >
                Tải lại trang
              </button>
              <button 
                onClick={() => window.history.back()}
                className="error-boundary__button error-boundary__button--secondary"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorBoundary;
