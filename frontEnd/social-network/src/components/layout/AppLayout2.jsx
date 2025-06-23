// src/components/layout/AppLayout.jsx
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { authStore } from '../../store';
import { useWebSocket } from '../../hooks';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const AppLayout = () => {
  const { user } = authStore();
  const { isConnected, getConnectionState } = useWebSocket();

  // Log connection status changes
  useEffect(() => {
    const status = getConnectionState();
    console.log('WebSocket connection status:', status);
  }, [isConnected, getConnectionState]);

  // Show connection status in development
  const showConnectionStatus = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Connection Status Indicator (Development only) */}
      {showConnectionStatus && (
        <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-sm ${
          isConnected 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          WebSocket: {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-40 w-64">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64">
          {/* Navbar */}
          <div className="sticky top-0 z-30">
            <Navbar />
          </div>

          {/* Page Content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Navbar */}
        <div className="sticky top-0 z-30">
          <Navbar />
        </div>

        {/* Page Content */}
        <main className="flex-1 pb-16">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-30">
          <MobileNav />
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </div>
  );
};

export default AppLayout;