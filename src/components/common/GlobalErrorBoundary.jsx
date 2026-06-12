import { ErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


function FallbackUI({ error, resetErrorBoundary, type = 'global' }) {
  const handleReload = () => {
    window.location.reload();
  };

  const isWidget = type === 'widget';
  const isRoute = type === 'route';

  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center ${
      isWidget ? 'h-full min-h-[200px] bg-slate-50 border border-slate-200 rounded-2xl' : 'min-h-[60vh]'
    }`}>
      <div className={`flex items-center justify-center rounded-full bg-red-50 text-red-500 mb-4 ${
        isWidget ? 'w-12 h-12' : 'w-16 h-16'
      }`}>
        <AlertTriangle size={isWidget ? 24 : 32} />
      </div>
      
      <h2 className={`${isWidget ? 'text-[16px]' : 'text-[20px]'} font-extrabold text-slate-900 mb-2`}>
        {isWidget ? 'Widget unavailable' : 'Something went wrong.'}
      </h2>
      
      <p className="text-[13px] text-slate-500 max-w-md mx-auto mb-6">
        {error?.message || 'An unexpected error occurred while rendering this component.'}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={resetErrorBoundary}
          className="flex items-center gap-2 px-4 py-2 bg-[#6C4CF1] hover:bg-[#5b3fda] text-white text-[13px] font-bold rounded-xl transition-all shadow-sm"
        >
          <RefreshCw size={14} />
          Retry
        </button>
        
        {!isWidget && (
          <button
            onClick={handleReload}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[13px] font-bold rounded-xl transition-all shadow-sm"
          >
            <Home size={14} />
            Reload Page
          </button>
        )}
      </div>
    </div>
  );
}

export function GlobalErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={(props) => <FallbackUI {...props} type="global" />}
      onError={(error, info) => {
        console.error('Global Crash Detected:', error);
        console.error('Component Stack:', info.componentStack);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function RouteErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={(props) => <FallbackUI {...props} type="route" />}
      onError={(error, info) => {
        console.error('Route Crash Detected:', error);
        console.error('Component Stack:', info.componentStack);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function WidgetErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={(props) => <FallbackUI {...props} type="widget" />}
      onError={(error, info) => {
        console.error('Widget Crash Detected:', error);
        console.error('Component Stack:', info.componentStack);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
