import React from 'react';
import { Home, Users, QrCode, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const BottomNavigation = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);       // ✅ Firebase sign-out
      navigate('/');        // ✅ Redirect after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t px-4 py-2 flex justify-around items-center z-50">
      <button onClick={() => navigate('/home')} className="flex flex-col items-center text-sm text-gray-600 hover:text-purple-600">
        <Home className="w-5 h-5 mb-1" />
        Home
      </button>

      <button onClick={() => navigate('/groups')} className="flex flex-col items-center text-sm text-gray-600 hover:text-purple-600">
        <Users className="w-5 h-5 mb-1" />
        Groups
      </button>

      <button onClick={() => navigate('/qr')} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg -mt-8 hover:scale-105 transition-all">
        <QrCode className="w-5 h-5" />
      </button>

      <button onClick={() => navigate('/profile')} className="flex flex-col items-center text-sm text-gray-600 hover:text-purple-600">
        <User className="w-5 h-5 mb-1" />
        Profile
      </button>

      <button onClick={handleLogout} className="flex flex-col items-center text-sm text-gray-600 hover:text-red-500">
        <LogOut className="w-5 h-5 mb-1" />
        Logout
      </button>
    </nav>
  );
};

export default BottomNavigation;
