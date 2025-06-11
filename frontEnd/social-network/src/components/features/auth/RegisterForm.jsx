import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button, Input } from '../../ui';
import { useAuth } from '../../../hooks';

const RegisterForm = () => {
  const navigator = useNavigate();
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    } 
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Họ tên là bắt buộc';
    } else if (formData.username.length < 2) {
      newErrors.username = 'Họ tên phải có ít nhất 2 ký tự';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      const response = await register(formData);
      console.log('Register response:', response);
      
      if (response.success) {
        // Đăng ký thành công
        navigator('/login', {
          state: { 
            email: formData.email,
            password: formData.password
          }
        });
      } else {
        // Trường hợp response có success: false
        setErrors({
          email: response.message || 'Đã xảy ra lỗi khi đăng ký'
        });
      }
    } catch (error) {
      console.log('Register error caught:', error);
      
      // Xử lý các loại lỗi khác nhau
      if (error.success === false) {
        // Lỗi business logic từ server
        if (error.code === 1001) {
          setErrors({
            email: 'Email này đã được sử dụng. Vui lòng chọn email khác.'
          });
        } else {
          setErrors({
            email: error.message || 'Đã xảy ra lỗi khi đăng ký'
          });
        }
      } else {
        // Lỗi khác (network, server error, etc.)
        setErrors({
          email: 'Đăng ký không thành công. Vui lòng thử lại sau.'
        });
      }
    }
  };

  const SwitchToLogin = () => {
    // Navigate to login page
    navigator('/login'); // Adjust this based on your routing setup
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Họ và tên"
        type="text"
        name="username"
        placeholder="Nhập họ và tên"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        icon={User}
      />

      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="Nhập email của bạn"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        icon={Mail}
      />
      
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={handleChange}
            className={`
              w-full rounded-lg border border-gray-300 px-3 py-2 text-sm pl-10 pr-10
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}
              transition-colors duration-200
            `}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`
              w-full rounded-lg border border-gray-300 px-3 py-2 text-sm pl-10 pr-10
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}
              transition-colors duration-200
            `}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}
      </div>

      <div className="flex items-center">
        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
        <span className="ml-2 text-sm text-gray-600">
          Tôi đồng ý với{' '}
          <a href="#" className="text-blue-600 hover:text-blue-500">Điều khoản sử dụng</a>
          {' '}và{' '}
          <a href="#" className="text-blue-600 hover:text-blue-500">Chính sách bảo mật</a>
        </span>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <button
            type="button"
            onClick={SwitchToLogin}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Đăng nhập
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;