import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SearchInput from '../components/features/search/SearchInput';
import friendAPI from '../services/friend';
import SearchResults from '../components/features/search/SearchResults';
import UserModal from '../components/ui/UserModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { AppLayout } from '../components/layout';
import { useFriendManager } from '../hooks/friendManage';
import { useAuth } from '../hooks';

// Hook để xử lý API search
const useApiSearch = (userId, statusFilter) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce search query
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // Delay 500ms

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // API search function using friendAPI
  const performSearch = useCallback(async (query, filter) => {
    if (!query.trim() || !userId) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);

    try {
      const result = await friendAPI.searchFriends(query.trim(), {
        filter: filter,
        limit: 20
      });
      console.log("search result:", result);
      if (result.data) {
        // Lọc bỏ các phần tử null hoặc undefined
        const filteredData = result.data.filter(item => item != null);
        setSearchResults(filteredData);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(error.message || 'Có lỗi xảy ra khi tìm kiếm');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [userId]);

  // Trigger search when debounced query or filter changes
  useEffect(() => {
    performSearch(debouncedQuery, statusFilter);
  }, [debouncedQuery, statusFilter, performSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
    setHasSearched(false);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchError,
    hasSearched,
    clearSearch
  };
};

const FriendPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);

  // Sử dụng hook để quản lý friend data
  const {
    friends,
    requests,
    sents,
    actions,
    refreshAll,
    isInitialized
  } = useFriendManager(user?.id, {
    limit: 50,
    autoFetch: true
  });

  // Sử dụng API search hook
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchError,
    hasSearched,
    clearSearch
  } = useApiSearch(user?.id, statusFilter);

  // Tạo danh sách users để hiển thị khi không có search
  const defaultUsers = useMemo(() => {
    let users = [];
    
    switch (statusFilter) {
      case 'friend':
        users = friends.friends.map(friend => ({
          ...friend,
          friendStatus: 'friend'
        }));
        break;
      case 'sent':
        users = sents.sents.map(sent => ({
          ...sent,
          friendStatus: 'sent'
        }));
        break;
      case 'pending':
        users = requests.requests.map(request => ({
          ...request,
          friendStatus: 'pending'
        }));
        break;
      default:
        users = [];
    }
    
    return users;
  }, [statusFilter, friends.friends, sents.sents, requests.requests]);

  // Tính số lượng cho mỗi category
  const counts = useMemo(() => ({
    null: (friends.friends?.length || 0) + (sents.sents?.length || 0) + (requests.requests?.length || 0),
    friend: friends.friends?.length || 0,
    sent: sents.sents?.length || 0,
    pending: requests.requests?.length || 0,
  }), [friends.friends, sents.sents, requests.requests]);

  // Kiểm tra loading state
  const isLoading = useMemo(() => {
    switch (statusFilter) {
      case 'friend':
        return friends.loading;
      case 'sent':
        return sents.loading;
      case 'pending':
        return requests.loading;
      default:
        return false;
    }
  }, [statusFilter, friends.loading, sents.loading, requests.loading]);

  // Xác định dữ liệu nào sẽ hiển thị
  const displayData = useMemo(() => {
    let data;
    if (statusFilter === null) {
      data = searchResults; // Trong tab "Tất cả" chỉ hiển thị kết quả tìm kiếm
    } else if (searchQuery.trim()) {
      data = searchResults;
    } else {
      data = defaultUsers;
    }
    // Đảm bảo không có phần tử null/undefined trong dữ liệu
    return Array.isArray(data) ? data.filter(item => item != null) : [];
  }, [statusFilter, searchQuery, searchResults, defaultUsers]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleSendFriendRequest = async (userId) => {
    
    const success = await actions.sendFriendRequest(userId);
    if (success) {
      showNotification('Đã gửi lời mời kết bạn', 'success');
      setTimeout(() => {
        sents.refresh();
      }, 500);
    } else {
      showNotification(actions.error || 'Gửi lời mời thất bại', 'error');
    }
  };

  const handleAcceptFriendRequest = async (userId) => {
    const success = await actions.acceptFriendRequest(userId);
    if (success) {
      showNotification('Đã chấp nhận lời mời kết bạn', 'success');
      setTimeout(() => {
        refreshAll();
      }, 500);
    } else {
      showNotification(actions.error || 'Chấp nhận lời mời thất bại', 'error');
    }
  };

  const handleRejectFriendRequest = async (userId) => {
    const success = await actions.rejectFriendRequest(userId);
    if (success) {
      showNotification('Đã từ chối lời mời kết bạn', 'success');
      setTimeout(() => {
        requests.refresh();
      }, 500);
    } else {
      showNotification(actions.error || 'Từ chối lời mời thất bại', 'error');
    }
  };

  const handleCancelFriendRequest = async(userId) => {
    const success = await actions.cancelFriendRequest(userId);
    if (success) {
      showNotification('Đã hủy lời mời kết bạn', 'success');
      setTimeout(() => {
        sents.refresh();
      }, 500);
    } else {
      showNotification(actions.error || 'Hủy lời mời thất bại', 'error');
    }
  }

  // Hàm để xử lý các action dựa trên friendStatus
  const updateUserStatus = (userId, actionType) => {
    switch (actionType) {
      case 'send_request':
        handleSendFriendRequest(userId);
        break;
      case 'accept_request':
        handleAcceptFriendRequest(userId);
        break;
      case 'reject_request':
        handleRejectFriendRequest(userId);
        break;
      case 'cancel_request':
        handleCancelFriendRequest(userId);
      default:
        console.log('Unknown action type:', actionType);
    }
  };

  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-4 z-50 px-6 py-4 rounded-lg text-white font-medium shadow-lg transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const handleLoadMore = () => {
    // Load more chỉ áp dụng cho default data, không áp dụng cho search results
    if (!searchQuery.trim()) {
      switch (statusFilter) {
        case 'friend':
          if (friends.hasMore) friends.loadMore();
          break;
        case 'sent':
          if (sents.hasMore) sents.loadMore();
          break;
        case 'pending':
          if (requests.hasMore) requests.loadMore();
          break;
      }
    }
  };

  const handleRefresh = () => {
    switch (statusFilter) {
      case 'friend':
        friends.refresh();
        break;
      case 'sent':
        sents.refresh();
        break;
      case 'pending':
        requests.refresh();
        break;
      default:
        refreshAll();
    }
  };

  const handleStatusFilterChange = (newFilter) => {
    setStatusFilter(newFilter);
    // Clear search khi đổi filter để tránh confusion
    if (searchQuery.trim()) {
      clearSearch();
    }
  };

  // Show loading nếu chưa initialized
  if (!isInitialized) {
    return (
      <AppLayout hideSearchBar={true}>
        <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout hideSearchBar={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-6 py-6">
          {/* Search Input */}
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Nhập tên, số điện thoại hoặc email để tìm kiếm..."
            disabled={isSearching}
          />

          {/* Filter by friend status */}
          <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-4 mb-6 text-gray-600">
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { key: null, label: "Tất cả" },
                { key: "friend", label: "Bạn bè" },
                { key: "sent", label: "Đã gửi lời mời" },
                { key: "pending", label: "Đang chờ xác nhận" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => handleStatusFilterChange(filter.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                    statusFilter === filter.key
                      ? "bg-blue-600 text-white shadow"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {filter.label}
                  {filter.key !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        statusFilter === filter.key
                          ? "bg-white text-blue-600"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {counts[filter.key]}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            {/* Control buttons */}
            <div className="mt-3 flex justify-between items-center">
              {searchQuery.trim() && (
                <button
                  onClick={clearSearch}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition"
                >
                  Xóa tìm kiếm
                </button>
              )}
              <div className="flex-1"></div>
              <button
                onClick={handleRefresh}
                disabled={isLoading || isSearching}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
              >
                {isLoading ? 'Đang tải...' : 'Làm mới'}
              </button>
            </div>
          </div>

          {/* Search status */}
          {searchQuery.trim() && (
            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-3 mb-4 text-white text-sm">
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang tìm kiếm "{searchQuery}"...
                </span>
              ) : hasSearched ? (
                <span>
                  Kết quả tìm kiếm cho "{searchQuery}"{statusFilter !== null ? ` trong ${
                    statusFilter === 'friend' ? 'bạn bè' :
                    statusFilter === 'sent' ? 'lời mời đã gửi' :
                    'lời mời chờ xác nhận'
                  }` : ''}
                : {searchResults.length} kết quả
                </span>
              ) : null}
            </div>
          )}

          {/* Error handling */}
          {(searchError || friends.error || requests.error || sents.error || actions.error) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-medium">Có lỗi xảy ra:</p>
              <p className="text-sm">
                {searchError || friends.error || requests.error || sents.error || actions.error}
              </p>
              <button 
                onClick={() => {
                  if (searchError) {
                    clearSearch();
                  } else {
                    actions.clearError();
                    handleRefresh();
                  }
                }}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                {searchError ? 'Xóa tìm kiếm' : 'Thử lại'}
              </button>
            </div>
          )}

          {/* Loading for default data */}
          {!searchQuery.trim() && isLoading && <LoadingSpinner />}

          {/* Search Results or Default Data */}
          {(!isLoading || searchQuery.trim()) && (
            <>
              <SearchResults
                results={displayData}
                onUserClick={handleUserClick}
                statusFilter={statusFilter}
              />
              
              {/* Load More Button - only show for default data */}
              {(() => {
                if (searchQuery.trim()) return null; // Không hiển thị load more khi đang search
                
                const currentHasMore = statusFilter === 'friend' ? friends.hasMore :
                                     statusFilter === 'sent' ? sents.hasMore :
                                     statusFilter === 'pending' ? requests.hasMore : false;
                
                return currentHasMore && displayData.length > 0 && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
                    >
                      {isLoading ? 'Đang tải...' : 'Tải thêm'}
                    </button>
                  </div>
                );
              })()}
            </>
          )}

          {/* Empty State */}
          {!isLoading && !isSearching && displayData.length === 0 && isInitialized && (
            <div className="text-center py-12">
              <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-8">
                <p className="text-gray-600 text-lg">
                  {searchQuery.trim() && hasSearched
                    ? `Không tìm thấy kết quả cho "${searchQuery}"`
                    : `Chưa có ${
                        statusFilter === 'friend' ? 'bạn bè' :
                        statusFilter === 'sent' ? 'lời mời đã gửi' :
                        statusFilter === 'pending' ? 'lời mời chờ xác nhận' : 'dữ liệu'
                      }`
                  }
                </p>
                {searchQuery.trim() && (
                  <button
                    onClick={clearSearch}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Xóa tìm kiếm
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Detail Modal */}
        {showModal && selectedUser && (
          <UserModal
            id={selectedUser.id}
            onClose={handleCloseModal}
            onUpdateUserStatus={updateUserStatus}
            onShowNotification={showNotification}
            isActionLoading={actions.isActionLoading}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default FriendPage;