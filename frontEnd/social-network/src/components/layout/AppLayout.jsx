import React from 'react';
import { Navbar, MobileNav, Sidebar } from './index';

const AppLayout = ({ children, showSidebar = true, showNavbar = true, showMobileNav = true, hideSearchBar = false }) => {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Navigation Bar */}
      {showNavbar && <Navbar hideSearchBar={hideSearchBar} />}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        {showSidebar && showNavbar && (
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        )}
        
        {/* Main Content - Full Screen */}
        <main className={`flex-1 
            ${showSidebar ? 'lg:ml-64' : ''} 
            overflow-hidden`}>

          {/* Children chiếm toàn bộ không gian */}
          <div className="w-full h-full">
            {children}
          </div>

        </main>
      </div>
      
      {/* Mobile Navigation */}
      {showMobileNav && <MobileNav />}
    </div>
  );
};

export default AppLayout;