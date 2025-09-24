// 📁 src/components/features/settings/ProfileSettings.jsx
// ==========================================

import React, { useState, useRef } from 'react';
import { User, Upload, Camera } from 'lucide-react';
import { Button, Input } from '../../ui';
import { useAuth } from '../../../hooks';
import { DEFAULT_AVATAR, DEFAULT_USER_VALUES, MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '../../../utils/constants';
import toast from 'react-hot-toast';

const ProfileSettings = () => {
  const { user, updateProfile, updateAvatar } = useAuth();
  const fileInputRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || DEFAULT_USER_VALUES.username,
    email: user?.email || DEFAULT_USER_VALUES.email,
    avatar: user?.avatar || DEFAULT_USER_VALUES.avatar,
    birthday: user?.birthday || DEFAULT_USER_VALUES.birthday,
    gender: user?.gender || DEFAULT_USER_VALUES.gender,
    biography: user?.biography || DEFAULT_USER_VALUES.biography,
    phone: user?.phone || DEFAULT_USER_VALUES.phone,
    location: user?.location || DEFAULT_USER_VALUES.location,
    website: user?.website || DEFAULT_USER_VALUES.website,
    occupation: user?.occupation || DEFAULT_USER_VALUES.occupation,
  });
  
  // State để quản lý preview avatar và file đã chọn
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || DEFAULT_AVATAR);
  const [selectedFile, setSelectedFile] = useState(null);
  const [hasAvatarChanged, setHasAvatarChanged] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const validateFile = (file) => {
    if (!file) return { valid: false, error: 'Vui lòng chọn file' };
    
    if (file.size > MAX_FILE_SIZE) {
      return { 
        valid: false, 
        error: `File quá lớn. Kích thước tối đa: ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB` 
      };
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Định dạng file không được hỗ trợ. Chỉ chấp nhận: JPG, PNG, GIF, WebP' 
      };
    }

    return { valid: true };
  };

  const handleFileChange = (e) => {
    // console.log('File input changed:', e.target.files);
    const file = e.target.files?.[0];
    // console.log('Selected file:', file);
    // console.log('File type:', file?.type); // Thêm dòng này để xem MIME type
    if (!file) {
      // console.warn('No file selected');
      return;
    }

    const validation = validateFile(file);
    if (!validation.valid) {
      // console.error('File validation failed:', validation.error);
      toast.error(validation.error);
      return;
    }

    // Tạo preview ngay lập tức - KHÔNG gọi API
    const reader = new FileReader();
    reader.onloadend = () => {
      // console.log('File preview loaded:', reader.result);
      setPreviewAvatar(reader.result); // Hiển thị preview
      setSelectedFile(file); // Lưu file để upload sau
      setHasAvatarChanged(true); // Đánh dấu avatar đã thay đổi
    };
    // console.log('Calling reader.readAsDataURL...');
    reader.readAsDataURL(file);
  };

  // Hàm upload avatar - chỉ gọi khi submit
  const uploadAvatar = async (file) => {
    if (!file) return null;

    try {
      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append('avatar', file);

      // Gọi updateAvatar từ useAuth hook
      const response = await updateAvatar(formData);

      // Kiểm tra response theo format API của bạn
      if (response.success === true) {
        return response.result.avatar_url; // Trả về URL từ Cloudinary
      } else {
        throw new Error(response.message || 'Không thể tải ảnh lên');
      }
    } catch (error) {
      console.error('Avatar upload failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      toast.error('Vui lòng nhập tên hiển thị');
      return;
    }
    
    try {
      setSubmitting(true);
      let updateData = { ...formData };

      // Chỉ upload avatar nếu có file được chọn
      if (selectedFile && hasAvatarChanged) {
        toast.loading('Đang tải ảnh lên...', { id: 'upload' });
        const avatarUrl = await uploadAvatar(selectedFile);
        updateData.avatar = avatarUrl;
        toast.success('Tải ảnh thành công', { id: 'upload' });
      }

      // Update profile với data mới
      await updateProfile(updateData);
      
      // Reset states sau khi thành công
      setSelectedFile(null);
      setHasAvatarChanged(false);
      
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error.message || 'Không thể cập nhật thông tin');
    } finally {
      setSubmitting(false);
    }
  };

  const removeAvatar = () => {
    setPreviewAvatar(DEFAULT_AVATAR);
    setSelectedFile(null);
    setHasAvatarChanged(true); // Đánh dấu đã thay đổi avatar
    setFormData(prev => ({
      ...prev,
      avatar: DEFAULT_AVATAR
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Reset về avatar gốc
  const resetAvatar = () => {
    setPreviewAvatar(user?.avatar || DEFAULT_AVATAR);
    setSelectedFile(null);
    setHasAvatarChanged(false);
    setFormData(prev => ({
      ...prev,
      avatar: user?.avatar || DEFAULT_AVATAR
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5" />
            Thông tin cá nhân
          </h2>
          <p className="text-gray-600 mt-1">Cập nhật thông tin hồ sơ của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar Upload Section */}
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img
                src={previewAvatar}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover bg-gray-100 border-4 border-white shadow-lg"
              />
              <div className="absolute bottom-0 right-0 flex gap-1">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  className="p-2 rounded-full shadow-lg"
                  onClick={handleAvatarClick}
                  disabled={submitting}
                >
                  <Camera className="w-4 h-4" />
                </Button>
                {(previewAvatar !== DEFAULT_AVATAR) && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg"
                    onClick={removeAvatar}
                    disabled={submitting}
                  >
                    ×
                  </Button>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={ALLOWED_FILE_TYPES.join(',')}
                onChange={handleFileChange}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {formData.username || 'Chưa có tên'}
              </h3>
              <p className="text-gray-500">{formData.email}</p>
              <p className="text-sm text-gray-400 mt-2">
                Chọn ảnh đại diện của bạn. Kích thước tối đa: {Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB
              </p>
              {selectedFile && (
                <p className="text-sm text-blue-600 mt-1">
                  📎 {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB) - Chưa tải lên
                </p>
              )}
              {hasAvatarChanged && (
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={resetAvatar}
                    disabled={submitting}
                    className="text-xs"
                  >
                    Hoàn tác
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tên hiển thị *"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Nhập tên hiển thị"
              />

              <Input
                label="Email *"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Ngày sinh"
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiểu sử
              </label>
              <textarea
                name="biography"
                rows={4}
                value={formData.biography}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Viết gì đó về bản thân..."
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.biography.length}/500 ký tự
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Số điện thoại"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0123-456-789"
              />
              
              <Input
                label="Địa chỉ"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Thành phố, Quốc gia"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Website"
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />
              
              <Input
                label="Nghề nghiệp"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Công việc hiện tại"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button 
              type="submit" 
              variant="primary" 
              size="lg"
              disabled={submitting}
              className="min-w-[160px]"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang lưu...
                </div>
              ) : (
                'Lưu thay đổi'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;