'use client';

import { useState } from 'react';
import Navbar from './components/Navbar';
import PromotionalText from './components/PromotionalText';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="min-h-screen ">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 min-h-[calc(100vh-120px)] flex items-center">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-16 w-full">
          <PromotionalText />
          {isLogin ? (
            <LoginForm onToggleAuth={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleAuth={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
