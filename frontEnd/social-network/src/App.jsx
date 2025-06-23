import React from 'react';
import { useWebSocket } from './hooks';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, LoginPage, RegisterPage, SettingsPage, MessagesPage, NotFoundPage } from './pages';

function App() {
  useWebSocket();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        {/* Add other routes here as needed */}
        
        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;