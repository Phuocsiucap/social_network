import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {friendAPI} from '../services';
// import WebSocketService from '../services/WebSocketService';
import WebSocketService from '../services/webSocket';

// Cache manager để lưu trữ dữ liệu
class FriendCache {
    constructor() {
        this.cache = new Map();
        this.timestamps = new Map();
        this.cacheDuration = 5 * 60 * 1000; // 5 phút
    }

    set(key, data) {
        this.cache.set(key, data);
        this.timestamps.set(key, Date.now());
    }

    get(key) {
        const timestamp = this.timestamps.get(key);
        if (!timestamp || Date.now() - timestamp > this.cacheDuration) {
            this.cache.delete(key);
            this.timestamps.delete(key);
            return null;
        }
        return this.cache.get(key);
    }

    invalidate(key) {
        this.cache.delete(key);
        this.timestamps.delete(key);
    }

    invalidateAll() {
        this.cache.clear();
        this.timestamps.clear();
    }
}

const friendCache = new FriendCache();

// Hook với caching và persistence
export const useFriends = (userId, options = {}) => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [initialized, setInitialized] = useState(false);
    
    const { limit = 50, autoFetch = true, cacheKey } = options;
    const fetchedRef = useRef(false);
    const mountedRef = useRef(true);

    const cacheKeyFinal = useMemo(() => 
        cacheKey || `friends_${userId}_${limit}`, 
        [cacheKey, userId, limit]
    );

    // Load từ cache khi component mount
    useEffect(() => {
        const cachedData = friendCache.get(cacheKeyFinal);
        if (cachedData) {
            setFriends(cachedData.friends || []);
            setPage(cachedData.page || 1);
            setHasMore(cachedData.hasMore ?? true);
            setInitialized(true);
            fetchedRef.current = true;
        }
    }, [cacheKeyFinal]);

    const fetchFriends = useCallback(async (pageNum = 1, reset = false) => {
        if (!userId || !mountedRef.current) return;
        
        // Nếu đã có cache và không phải reset thì không fetch
        if (!reset && pageNum === 1 && fetchedRef.current) {
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            
            const data = await friendAPI.getFriends(userId, {
                page: pageNum,
                limit
            });
            
            if (!mountedRef.current) return;
            
            // API trả về: { data: [...], hasMore: boolean }
            const apiData = data.data || [];
            const apiHasMore = data.hasMore || false;
            
            let newFriends;
            if (reset || pageNum === 1) {
                newFriends = apiData;
                setFriends(newFriends);
            } else {
                newFriends = [...friends, ...apiData];
                setFriends(newFriends);
            }
            
            setHasMore(apiHasMore);
            setPage(pageNum);
            setInitialized(true);
            fetchedRef.current = true;

            // Lưu vào cache
            friendCache.set(cacheKeyFinal, {
                friends: reset || pageNum === 1 ? newFriends : friends.concat(apiData),
                page: pageNum,
                hasMore: apiHasMore
            });
        } catch (err) {
            if (mountedRef.current) {
                setError(err.message);
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    }, [userId, limit, friends, cacheKeyFinal]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore && initialized) {
            fetchFriends(page + 1, false);
        }
    }, [loading, hasMore, page, fetchFriends, initialized]);

    const refresh = useCallback(() => {
        friendCache.invalidate(cacheKeyFinal);
        fetchedRef.current = false;
        fetchFriends(1, true);
    }, [fetchFriends, cacheKeyFinal]);

    useEffect(() => {
        mountedRef.current = true;
        
        if (autoFetch && userId && !initialized && !fetchedRef.current) {
            fetchFriends();
        }

        return () => {
            mountedRef.current = false;
        };
    }, [autoFetch, userId, initialized, fetchFriends]);

    return {
        friends,
        loading,
        error,
        hasMore,
        initialized,
        loadMore,
        refresh,
        refetch: fetchFriends
    };
};

// Hook với caching cho friend requests
export const useFriendRequests = (options = {}) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [initialized, setInitialized] = useState(false);
    
    const { limit = 50, autoFetch = true, cacheKey = 'friend_requests' } = options;
    const fetchedRef = useRef(false);
    const mountedRef = useRef(true);

    const cacheKeyFinal = `${cacheKey}_${limit}`;

    useEffect(() => {
        const cachedData = friendCache.get(cacheKeyFinal);
        if (cachedData) {
            setRequests(cachedData.requests || []);
            setPage(cachedData.page || 1);
            setHasMore(cachedData.hasMore ?? true);
            setInitialized(true);
            fetchedRef.current = true;
        }
    }, [cacheKeyFinal]);

    const fetchRequests = useCallback(async (pageNum = 1, reset = false) => {
        if (!mountedRef.current) return;
        
        if (!reset && pageNum === 1 && fetchedRef.current) {
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            
            const data = await friendAPI.getFriendRequests({
                page: pageNum,
                limit
            });
            
            if (!mountedRef.current) return;
            
            // API trả về: { data: [...], hasMore: boolean }
            const apiData = data.data || [];
            const apiHasMore = data.hasMore || false;
            
            let newRequests;
            if (reset || pageNum === 1) {
                newRequests = apiData;
                setRequests(newRequests);
            } else {
                newRequests = [...requests, ...apiData];
                setRequests(newRequests);
            }
            
            setHasMore(apiHasMore);
            setPage(pageNum);
            setInitialized(true);
            fetchedRef.current = true;

            friendCache.set(cacheKeyFinal, {
                requests: reset || pageNum === 1 ? newRequests : requests.concat(apiData),
                page: pageNum,
                hasMore: apiHasMore
            });
        } catch (err) {
            if (mountedRef.current) {
                setError(err.message);
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    }, [limit, requests, cacheKeyFinal]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore && initialized) {
            fetchRequests(page + 1, false);
        }
    }, [loading, hasMore, page, fetchRequests, initialized]);

    const refresh = useCallback(() => {
        friendCache.invalidate(cacheKeyFinal);
        fetchedRef.current = false;
        fetchRequests(1, true);
    }, [fetchRequests, cacheKeyFinal]);

    useEffect(() => {
        mountedRef.current = true;
        
        if (autoFetch && !initialized && !fetchedRef.current) {
            fetchRequests();
        }

        return () => {
            mountedRef.current = false;
        };
    }, [autoFetch, initialized, fetchRequests]);

    return {
        requests,
        loading,
        error,
        hasMore,
        initialized,
        loadMore,
        refresh,
        refetch: fetchRequests
    };
};

// Hook với caching cho friend sents
export const useFriendSents = (options = {}) => {
    const [sents, setSents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [initialized, setInitialized] = useState(false);
    
    const { limit = 50, autoFetch = true, cacheKey = 'friend_sents' } = options;
    const fetchedRef = useRef(false);
    const mountedRef = useRef(true);

    const cacheKeyFinal = `${cacheKey}_${limit}`;

    useEffect(() => {
        const cachedData = friendCache.get(cacheKeyFinal);
        if (cachedData) {
            setSents(cachedData.sents || []);
            setPage(cachedData.page || 1);
            setHasMore(cachedData.hasMore ?? true);
            setInitialized(true);
            fetchedRef.current = true;
        }
    }, [cacheKeyFinal]);

    const fetchSents = useCallback(async (pageNum = 1, reset = false) => {
        if (!mountedRef.current) return;
        
        if (!reset && pageNum === 1 && fetchedRef.current) {
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            
            const data = await friendAPI.getFriendSents({
                page: pageNum,
                limit
            });
            
            if (!mountedRef.current) return;
            
            // API trả về: { data: [...], hasMore: boolean }
            const apiData = data.data || [];
            const apiHasMore = data.hasMore || false;
            
            let newSents;
            if (reset || pageNum === 1) {
                newSents = apiData;
                setSents(newSents);
            } else {
                newSents = [...sents, ...apiData];
                setSents(newSents);
            }
            
            setHasMore(apiHasMore);
            setPage(pageNum);
            setInitialized(true);
            fetchedRef.current = true;

            friendCache.set(cacheKeyFinal, {
                sents: reset || pageNum === 1 ? newSents : sents.concat(apiData),
                page: pageNum,
                hasMore: apiHasMore
            });
        } catch (err) {
            if (mountedRef.current) {
                setError(err.message);
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    }, [limit, sents, cacheKeyFinal]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore && initialized) {
            fetchSents(page + 1, false);
        }
    }, [loading, hasMore, page, fetchSents, initialized]);

    const refresh = useCallback(() => {
        friendCache.invalidate(cacheKeyFinal);
        fetchedRef.current = false;
        fetchSents(1, true);
    }, [fetchSents, cacheKeyFinal]);

    useEffect(() => {
        mountedRef.current = true;
        
        if (autoFetch && !initialized && !fetchedRef.current) {
            fetchSents();
        }

        return () => {
            mountedRef.current = false;
        };
    }, [autoFetch, initialized, fetchSents]);

    return {
        sents,
        loading,
        error,
        hasMore,
        initialized,
        loadMore,
        refresh,
        refetch: fetchSents
    };
};

// Hook để quản lý các hành động kết bạn qua WebSocket (không cần cache)
export const useFriendActions = () => {
    const [loading, setLoading] = useState({});
    const [error, setError] = useState(null);

    const setActionLoading = (action, targetUserId, isLoading) => {
        setLoading(prev => ({
            ...prev,
            [`${action}_${targetUserId}`]: isLoading
        }));
    };

    const sendFriendRequest = useCallback(async (targetUserId) => {
        if (!WebSocketService.isConnected) {
            setError('WebSocket không được kết nối');
            return false;
        }

        try {
            setActionLoading('send', targetUserId, true);
            setError(null);
            
            await WebSocketService.sendFriendRequest(targetUserId);
            
            // Invalidate cache sau khi gửi request
            friendCache.invalidate('friend_sents_50');
            
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setActionLoading('send', targetUserId, false);
        }
    }, []);

    const acceptFriendRequest = useCallback(async (targetUserId) => {
        if (!WebSocketService.isConnected) {
            setError('WebSocket không được kết nối');
            return false;
        }

        try {
            setActionLoading('accept', targetUserId, true);
            setError(null);
            
            await WebSocketService.acceptFriendRequest(targetUserId);
            
            // Invalidate tất cả cache liên quan
            friendCache.invalidateAll();
            
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setActionLoading('accept', targetUserId, false);
        }
    }, []);

    const rejectFriendRequest = useCallback(async (targetUserId) => {
        if (!WebSocketService.isConnected) {
            setError('WebSocket không được kết nối');
            return false;
        }

        try {
            setActionLoading('reject', targetUserId, true);
            setError(null);
            
            await WebSocketService.rejectFriendRequest(targetUserId);
            
            // Invalidate cache requests
            friendCache.invalidate('friend_requests_50');
            
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setActionLoading('reject', targetUserId, false);
        }
    }, []);

    const cancelFriendRequest = useCallback(async (targetUserId) => {
        if (!WebSocketService.isConnected) {
            setError('WebSocket không được kết nối');
            return false;
        }
        try {
            setActionLoading('cancel', targetUserId, true);
            setError(null);

            await WebSocketService.cancelFriendRequest(targetUserId);
            // Invalidate cache sents
            friendCache.invalidate('friend_sents_50');
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }   finally {
            setActionLoading('cancel', targetUserId, false);
        }
    }, []);

    const isActionLoading = useCallback((action, targetUserId) => {
        return loading[`${action}_${targetUserId}`] || false;
    }, [loading]);



    return {
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        cancelFriendRequest,
        isActionLoading,
        error,
        clearError: () => setError(null)
    };
};

// Hook tổng hợp với optimized caching
export const useFriendManager = (userId, options = {}) => {
    const friends = useFriends(userId, { ...options, cacheKey: `friends_${userId}` });
    const requests = useFriendRequests(options);
    const sents = useFriendSents(options);
    const actions = useFriendActions();

    // Lắng nghe WebSocket events với optimized updates
    useEffect(() => {
        const handleFriendRequest = (data) => {
            // Chỉ invalidate cache thay vì refresh ngay
            friendCache.invalidate('friend_requests_50');
            if (requests.initialized) {
                requests.refresh();
            }
        };

        const handleFriendAccepted = (data) => {
            // Invalidate tất cả cache
            friendCache.invalidateAll();
            if (friends.initialized) friends.refresh();
            if (requests.initialized) requests.refresh();
            if (sents.initialized) sents.refresh();
        };

        const handleFriendRejected = (data) => {
            friendCache.invalidate('friend_requests_50');
            friendCache.invalidate('friend_sents_50');
            if (requests.initialized) requests.refresh();
            if (sents.initialized) sents.refresh();
        };

        if (WebSocketService.isConnected) {
            WebSocketService.on('friend_request_received', handleFriendRequest);
            WebSocketService.on('friend_request_accepted', handleFriendAccepted);
            WebSocketService.on('friend_request_rejected', handleFriendRejected);
        }

        return () => {
            if (WebSocketService.isConnected) {
                WebSocketService.off('friend_request_received', handleFriendRequest);
                WebSocketService.off('friend_request_accepted', handleFriendAccepted);
                WebSocketService.off('friend_request_rejected', handleFriendRejected);
            }
        };
    }, [friends, requests, sents]);

    const refreshAll = useCallback(() => {
        friendCache.invalidateAll();
        friends.refresh();
        requests.refresh();
        sents.refresh();
    }, [friends, requests, sents]);

    const clearAllCache = useCallback(() => {
        friendCache.invalidateAll();
    }, []);

    return {
        friends,
        requests,
        sents,
        actions,
        refreshAll,
        clearAllCache,
        isInitialized: friends.initialized && requests.initialized && sents.initialized
    };
};

// Hook để search/filter friends với caching
export const useFriendSearch = (friendsList) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFriends, setFilteredFriends] = useState([]);

    const filteredResult = useMemo(() => {
        if (!searchTerm.trim()) {
            return friendsList;
        }

        return friendsList.filter(friend => 
            
            friend.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            friend.username?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [friendsList, searchTerm]);

    useEffect(() => {
        setFilteredFriends(filteredResult);
    }, [filteredResult]);

    return {
        searchTerm,
        setSearchTerm,
        filteredFriends
    };
};

// Export cache manager để có thể clear cache từ bên ngoài nếu cần
export { friendCache };