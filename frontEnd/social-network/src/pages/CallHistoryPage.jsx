// Main CallHistoryPage Component
import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { callsData } from '../data/callsData';
import SearchInput from '../components/features/call/SearchInput';
import FilterTabs from '../components/features/call/FilterTabs';
import TimeFilter from '../components/features/call/TimeFilter';
import CallList from '../components/features/call/CallList';
import CallDetailModal from '../components/features/call/CallDetailModal';
import { AppLayout } from '../components/layout';
const CallHistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCalls, setFilteredCalls] = useState(callsData);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTimeFilter, setActiveTimeFilter] = useState('all');
  const [selectedCall, setSelectedCall] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [calls] = useState(callsData);

  // Calculate counts
  const counts = {
    all: calls.length,
    incoming: calls.filter(c => c.type === 'incoming').length,
    outgoing: calls.filter(c => c.type === 'outgoing').length,
    missed: calls.filter(c => c.type === 'missed').length
  };

  // Filter effect
  useEffect(() => {
    let filtered = calls;

    // Search filter
    if (searchQuery.length >= 2) {
      filtered = filtered.filter(call =>
        call.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        call.phone.includes(searchQuery)
      );
    }

    // Type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(call => call.type === activeFilter);
    }

    // Time filter
    if (activeTimeFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(call => {
        const diff = now - call.timestamp;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        switch(activeTimeFilter) {
          case 'today':
            return days === 0;
          case 'week':
            return days <= 7;
          case 'month':
            return days <= 30;
          default:
            return true;
        }
      });
    }

    setFilteredCalls(filtered);
  }, [searchQuery, activeFilter, activeTimeFilter, calls]);

  const handleCallClick = (call) => {
    // Show notification
    showNotification(`Đang gọi ${call.name}...`, 'info');
  };

  const handleInfoClick = (call) => {
    setSelectedCall(call);
    setShowModal(true);
  };

  const handleMessageClick = (call) => {
    showNotification(`Chuyển đến chat với ${call.name}`, 'success');
  };

  const showNotification = (message, type = 'info') => {
    // Create notification element (same as FriendPage)
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-4 z-50 px-6 py-4 rounded-lg text-white font-medium shadow-lg transform transition-all duration-300 translate-x-full ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  return (
    <AppLayout hideSearchBar = {true}>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Phone className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold">Lịch Sử Cuộc Gọi</h1>
          </div>
          <p className="text-blue-100">Quản lý và theo dõi tất cả cuộc gọi của bạn</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
        />

        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />

        <TimeFilter
          activeTimeFilter={activeTimeFilter}
          onTimeFilterChange={setActiveTimeFilter}
        />

        <CallList
          calls={filteredCalls}
          onCallClick={handleCallClick}
          onInfoClick={handleInfoClick}
          searchQuery={searchQuery}
        />
      </div>

      {/* Modal */}
      <CallDetailModal
        call={selectedCall}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCall={handleCallClick}
        onMessage={handleMessageClick}
      />
    </div>
    </AppLayout>
  );
};

export default CallHistoryPage;