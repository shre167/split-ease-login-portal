import React from 'react';

interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  const netBalance = 120.5 - 681.0;

  return (
    <div className="w-screen bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 text-white p-6 pb-8 shadow-lg z-10">
      {/* Top row: Welcome message and user initial circle */}
      <div className="flex items-center justify-between mb-6 px-4 lg:px-16">
        <div>
          <h1 className="text-2xl font-bold mb-1 lg:text-4xl">Hi {userName},</h1>
          <p className="text-purple-100 text-sm lg:text-base">Welcome back to SplitEase</p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center lg:w-16 lg:h-16">
          <span className="text-lg font-semibold lg:text-2xl">{userName.charAt(0)}</span>
        </div>
      </div>

      {/* Net Balance Card */}
      <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm mx-4 lg:mx-16">
        <div className="text-center">
          <p className="text-sm text-purple-100 mb-2 lg:text-base">Your Net Balance</p>
          <p className={`text-4xl font-bold lg:text-6xl ${netBalance >= 0 ? 'text-green-200' : 'text-red-200'}`}>
            {netBalance >= 0 ? '+' : ''}${netBalance.toFixed(2)}
          </p>
          <p className="text-purple-100 text-xs mt-2 lg:text-sm">
            {netBalance >= 0 ? 'You are owed more than you owe' : 'You owe more than you are owed'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;

