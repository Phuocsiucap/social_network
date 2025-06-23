// File: src/main.jsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth, useWebSocket } from './hooks';


const queryClient = new QueryClient(); // 👈 tạo trực tiếp ở đây

//// Create QueryClient instance
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 3,
//       staleTime: 5 * 60 * 1000, // 5 minutes
//       cacheTime: 10 * 60 * 1000, // 10 minutes
//     },
//   },
// });



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      
        <App />
      
    </QueryClientProvider>
  </React.StrictMode>
);