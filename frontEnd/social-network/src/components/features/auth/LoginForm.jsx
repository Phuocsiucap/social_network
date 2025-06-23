import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button, Input } from '../../ui';
import { useAuth } from '../../../hooks';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
   const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: location.state?.password || ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    
    return newErrors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
   
    try {
      const result = await login(formData);
      if (result.success) {
        navigate('/'); // Chỉ chuyển hướng khi đăng nhập thành công
      }
    } catch (error) {
      setErrors({
        email: error.message || 'Đăng nhập không thành công'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const SwitchToRegister = () => {
    navigate('/register'); // Redirect to register page
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
        </label>
        
        <button type="button" className="text-sm text-blue-600 hover:text-blue-500">
          Quên mật khẩu?
        </button>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <button
            type="button"
            onClick={SwitchToRegister}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;