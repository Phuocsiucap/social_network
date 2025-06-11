import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Card } from '../../ui';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo và Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        </div>
        
        <Card className="p-8">
          {children}
        </Card>
        
        {/* Social Proof */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Tham gia cùng hơn 10,000+ người dùng khác
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;