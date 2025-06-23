import React from 'react';
import { Navbar, MobileNav, Sidebar } from './index';


const AppLayout = ({ children, showSidebar = true }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <Navbar />
      
      <div className="flex">
        {/* Sidebar - Desktop */}
        {showSidebar && (
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        )}
        
        {/* Main Content */}
        <main className={`flex-1 ${showSidebar ? 'lg:ml-64' : ''}`}>
          <div className="max-w-4xl mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default AppLayout;