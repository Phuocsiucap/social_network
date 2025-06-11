import React from 'react';
import { AuthLayout, RegisterForm } from '../components/features/auth';

const RegisterPage = () => {
  return (
    <AuthLayout 
      title="Tạo tài khoản mới"
      subtitle="Tham gia cộng đồng của chúng tôi"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;