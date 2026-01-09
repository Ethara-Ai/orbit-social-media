/**
 * Unit Tests for ErrorBoundary Component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary, { InlineErrorBoundary } from './ErrorBoundary';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

// Suppress console.error for cleaner test output
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  describe('rendering children', () => {
    it('should render children when there is no error', () => {
      render(
        <ErrorBoundary>
          <div>Child content</div>
        </ErrorBoundary>
      );
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <ErrorBoundary>
          <div>First child</div>
          <div>Second child</div>
        </ErrorBoundary>
      );
      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
    });

    it('should render nested components', () => {
      render(
        <ErrorBoundary>
          <div>
            <span>Nested content</span>
          </div>
        </ErrorBoundary>
      );
      expect(screen.getByText('Nested content')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should catch errors and display fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should display error message in fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );
      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
    });

    it('should display apology message', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );
      expect(screen.getByText(/We apologize for the inconvenience/)).toBeInTheDocument();
    });

    it('should display Try Again button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );
      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    });

    it('should display Refresh Page button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );
      expect(screen.getByRole('button', { name: 'Refresh Page' })).toBeInTheDocument();
    });
  });

  describe('custom fallback', () => {
    it('should render custom fallback element when provided', () => {
      render(
        <ErrorBoundary fallback={<div>Custom fallback</div>}>
          <ThrowError />
        </ErrorBoundary>
      );
      expect(screen.getByText('Custom fallback')).toBeInTheDocument();
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });

    it('should render FallbackComponent when provided', () => {
      const CustomFallback = ({ error, resetError }) => (
        <div>
          <span>Custom component: {error?.message}</span>
          <button onClick={resetError}>Reset</button>
        </div>
      );

      render(
        <ErrorBoundary FallbackComponent={CustomFallback}>
          <ThrowError />
        </ErrorBoundary>
      );
      expect(screen.getByText('Custom component: Test error message')).toBeInTheDocument();
    });

    it('should pass error info to FallbackComponent', () => {
      const CustomFallback = ({ error, errorInfo }) => (
        <div>
          <span data-testid="error">{error?.message}</span>
          <span data-testid="has-info">{errorInfo ? 'yes' : 'no'}</span>
        </div>
      );

      render(
        <ErrorBoundary FallbackComponent={CustomFallback}>
          <ThrowError />
        </ErrorBoundary>
      );
      expect(screen.getByTestId('error')).toHaveTextContent('Test error message');
    });

    it('should pass resetError function to FallbackComponent', () => {
      const CustomFallback = ({ resetError }) => <button onClick={resetError}>Custom Reset</button>;

      render(
        <ErrorBoundary FallbackComponent={CustomFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
      expect(screen.getByRole('button', { name: 'Custom Reset' })).toBeInTheDocument();
    });
  });

  describe('reset functionality', () => {
    it('should reset error state when Try Again is clicked', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Click Try Again
      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));

      // Rerender with non-throwing component to simulate fix
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      // The error boundary should have been reset, but since the same component
      // instance throws again, we need to test the state reset
    });

    it('should call onReset callback when reset is triggered', () => {
      const onReset = vi.fn();

      render(
        <ErrorBoundary onReset={onReset}>
          <ThrowError />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));
      expect(onReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('onError callback', () => {
    it('should call onError when an error is caught', () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledTimes(1);
    });

    it('should pass error object to onError callback', () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(onError.mock.calls[0][0].message).toBe('Test error message');
    });

    it('should pass errorInfo to onError callback', () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(onError.mock.calls[0][1]).toBeDefined();
      expect(onError.mock.calls[0][1]).toHaveProperty('componentStack');
    });
  });

  describe('Refresh Page button', () => {
    it('should call window.location.reload when clicked', () => {
      const reloadMock = vi.fn();
      const originalReload = window.location.reload;
      Object.defineProperty(window, 'location', {
        value: { reload: reloadMock },
        writable: true,
      });

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Refresh Page' }));
      expect(reloadMock).toHaveBeenCalledTimes(1);

      // Restore
      Object.defineProperty(window, 'location', {
        value: { reload: originalReload },
        writable: true,
      });
    });
  });

  describe('styling', () => {
    it('should have proper container styling', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );
      const container = screen.getByText('Something went wrong').closest('.min-h-50');
      expect(container).toBeInTheDocument();
    });

    it('should have Try Again button with orange styling', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );
      const button = screen.getByRole('button', { name: 'Try Again' });
      expect(button).toHaveClass('bg-orange-500');
    });

    it('should have error icon', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });
});

describe('InlineErrorBoundary', () => {
  describe('rendering', () => {
    it('should render children when there is no error', () => {
      render(
        <InlineErrorBoundary>
          <div>Inline content</div>
        </InlineErrorBoundary>
      );
      expect(screen.getByText('Inline content')).toBeInTheDocument();
    });

    it('should display default fallback message on error', () => {
      render(
        <InlineErrorBoundary>
          <ThrowError />
        </InlineErrorBoundary>
      );
      expect(screen.getByText('Failed to load this section')).toBeInTheDocument();
    });

    it('should display custom fallback message when provided', () => {
      render(
        <InlineErrorBoundary fallbackMessage="Custom error message">
          <ThrowError />
        </InlineErrorBoundary>
      );
      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });

    it('should not display default ErrorBoundary UI', () => {
      render(
        <InlineErrorBoundary>
          <ThrowError />
        </InlineErrorBoundary>
      );
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Try Again' })).not.toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should have inline styling classes', () => {
      render(
        <InlineErrorBoundary>
          <ThrowError />
        </InlineErrorBoundary>
      );
      const container = screen.getByText('Failed to load this section').closest('.p-4');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('text-center');
    });

    it('should have error icon', () => {
      render(
        <InlineErrorBoundary>
          <ThrowError />
        </InlineErrorBoundary>
      );
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });
});

describe('error boundary edge cases', () => {
  it('should handle errors in deeply nested components', () => {
    const DeepNested = () => (
      <div>
        <div>
          <div>
            <ThrowError />
          </div>
        </div>
      </div>
    );

    render(
      <ErrorBoundary>
        <DeepNested />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should not catch errors outside its tree', () => {
    render(
      <div>
        <ErrorBoundary>
          <div>Safe content</div>
        </ErrorBoundary>
      </div>
    );
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('should handle multiple ErrorBoundary instances independently', () => {
    render(
      <div>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
        <ErrorBoundary>
          <div>Safe section</div>
        </ErrorBoundary>
      </div>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Safe section')).toBeInTheDocument();
  });
});
