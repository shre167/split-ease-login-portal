
import React from 'react';
import LoginForm from '@/components/LoginForm';
import LoginHeader from '@/components/LoginHeader';
import LoginFooter from '@/components/LoginFooter';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800 flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Branding and features */}
            <div className="text-center lg:text-left">
              <LoginHeader />
              
              <div className="hidden lg:block">
                <div className="space-y-6 mt-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-2">Split Bills Effortlessly</h3>
                    <p className="text-blue-100">Automatically calculate who owes what and settle up with integrated payments.</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-2">Track Group Expenses</h3>
                    <p className="text-blue-100">Keep track of shared expenses with friends, roommates, and colleagues.</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-2">Smart Notifications</h3>
                    <p className="text-blue-100">Get reminded when it's time to settle up or when expenses are added.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Login form */}
            <div className="flex justify-center">
              <LoginForm />
            </div>
          </div>
          
          {/* Footer */}
          <LoginFooter />
        </div>
      </div>
    </div>
  );
};

export default Index;
