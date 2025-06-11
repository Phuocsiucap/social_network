import React from 'react';
import { AuthLayout, LoginForm } from '../components/features/auth';

const LoginPage = () => {
  return (
    <AuthLayout 
      title="Chào mừng trở lại"
      subtitle="Đăng nhập để kết nối với bạn bè"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;