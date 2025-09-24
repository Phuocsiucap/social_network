import React from 'react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <div className="bg-red-50 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-lg font-semibold text-red-800 mb-2">
          Something went wrong
        </h2>
        <div className="text-sm text-red-600 mb-4">
          <p className="font-medium">Error:</p>
          <pre className="mt-1 whitespace-pre-wrap break-words">
            {error.message}
          </pre>
        </div>
        <button
          onClick={resetErrorBoundary}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;