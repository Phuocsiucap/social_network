import { useState } from 'react';
import { authAPI } from '../services';
import { authStore } from '../store';

const useAuth = () => {
  const { user, token, setUser, setToken, logout: clearStore } = authStore();
  const [loading, setLoading] = useState(false);

  // LOGIN
  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authAPI.login(credentials);
      console.log('Login successful:', data);
      if(data.success === false) {
        setLoading(false);
        throw new Error(data.message || 'Login failed');
      }
      setToken(data.result.token);
      setUser(data.result.user);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // REGISTER
  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authAPI.register(userData);
      console.log('Registration successful:', data);
      return data;
    } catch (error) {
      // Xử lý lỗi từ API interceptor
      if (error.success === false) {
        // Đây là lỗi business logic (như user đã tồn tại)
        throw {
          success: false,
          message: error.message,
          code: error.code
        };
      }
      // Lỗi khác (network, server, etc.)
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      console.warn('Logout failed on server:', e.message);
    }
    clearStore();
  };

  // GET CURRENT USER
  const fetchCurrentUser = async () => {
    try {
      const data = await authAPI.getCurrentUser();
      setUser(data.result);
    } catch (error) {
      clearStore(); // Token hết hạn hoặc không hợp lệ
    }
  };

  // UPDATE PROFILE
  const updateProfile = async (userData) => {
    setLoading(true);
    try {
      const data = await authAPI.updateProfile(userData);
      setUser(data.result);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // UPDATE AVATAR - Fixed version
  const updateAvatar = async (avatarFormData) => {
    setLoading(true);
    try {
      const data = await authAPI.updateAvatar(avatarFormData);
      
      // Refresh user data sau khi update avatar thành công
      if (data.success) {
        await fetchCurrentUser();
      }
      
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // CHANGE PASSWORD
  const changePassword = async (passwords) => {
    setLoading(true);
    try {
      const data = await authAPI.changePassword(passwords);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // VERIFY EMAIL
  const verifyEmail = async (token) => {
    setLoading(true);
    try {
      const data = await authAPI.verifyEmail(token);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD
  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const data = await authAPI.forgotPassword(email);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // RESET PASSWORD
  const resetPassword = async (token, password) => {
    setLoading(true);
    try {
      const data = await authAPI.resetPassword(token, password);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    token,
    loading,
    login,
    register,
    logout,
    fetchCurrentUser,
    updateProfile,
    updateAvatar,
    changePassword,
    verifyEmail,
    forgotPassword,
    resetPassword,
  };
};

export default useAuth;