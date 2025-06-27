import React from 'react';
import AIAssistant from './AiAssisstant';
import BottomNavigation from './BottomNavigation';
import DashboardHeader from './DashboardHeader';
import FinanceCards from './FinanceCards';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      
      {/* Full-width header outside the container */}
      <DashboardHeader userName="Shreya" />

      {/* Main content container with margin to avoid overlap */}
      <div className="max-w-4xl mx-auto px-4 mt-[40px]">
        {/* Finance Overview Cards */}
        <FinanceCards />

        {/* AI Assistant */}
        <div className="my-8">
          <AIAssistant />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Dashboard;

