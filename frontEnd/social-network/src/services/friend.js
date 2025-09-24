import api from './api';

const friendAPI = {
    // lay danh sach ban be
    getFriends: async(userId, { page = 1, limit = 50 } = {}) => {
        const response = await api.get(`/api/friends?userId=${userId}&page=${page}&limit=${limit}`);
        const data = response.data;
        console.log(data);
        if(data.success) {
            // console.log("data in getFriends:", data);
            return data.result;
        }
        else { 
            throw new Error('Failed to fetch friends');
        }
    },

    getFriendRequests: async({ page = 1, limit = 50 } = {}) => {
        const response = await api.get(`/api/friends/request?page=${page}&limit=${limit}`); 
        const data = response.data;
        console.log(data);
        if(data.success) {
            // console.log("data in getFriends:", data);
            return data.result;
        }
        else { 
            throw new Error('Failed to fetch friends requests');
        }
    },

    getFriendSents: async({ page = 1, limit = 50 } = {}) => {
        const response = await api.get(`/api/friends/sent?page=${page}&limit=${limit}`); 
        // response = response.data;
        const data = response.data;
        if(data.success) {
           
            return data.result;
        }
        else {
            throw new Error('Failed to fetch friends sents');
        }
    },

    searchFriends: async(query, {filter=null, page = 1, limit = 50} = {}) => {
        const response = await api.get(`/api/friends/search?query=${query}&filter=${filter}&limit=${limit}`);
        const data = response.data;
        if(data.success) {
            return data.result;
        }
        else {
            throw new Error('Failed to search friends');
        }
    },

    getDetailFriendShip: async(friendId) => {
        const response = await api.get(`/api/friends/${friendId}`);
        const data = response.data;
        if(data.success) {
            return data.result;
        }
        else {
            throw new Error('Failed to get detail friendship');
        }
    },
}

export default friendAPI;