import { useState } from "react";
import GroupHeader from "./GroupHeader";
import ExpenseAnalytics from "./ExpenseAnalytics";
import SettlementAnalytics from "./SettlementAnalytics";
import GroupChat from "./GroupChat";
import RequestToBorrow from "./RequestToBorrow";
import FloatingActionButton from "./FloatingActionButton";
import { Button } from "@/components/Groups/button3";

const GroupDetails = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  const tabs = [
    { id: "analytics", label: "📊 Analytics", component: ExpenseAnalytics },
    { id: "settlement", label: "💸 Settlement", component: SettlementAnalytics },
    { id: "chat", label: "💬 Chat", component: GroupChat },
    { id: "borrow", label: "🪙 Borrow", component: RequestToBorrow },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ExpenseAnalytics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
      {/* Group Header */}
      <GroupHeader />
      
      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-glass border-b border-border/50 px-4 py-3">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap text-xs transition-all duration-300 ${
                activeTab === tab.id 
                  ? "shadow-glow transform scale-105" 
                  : "hover:scale-105"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="pb-24 pt-6">
        <ActiveComponent />
      </div>

      {/* Recent Activity Timeline (Mini) */}
     

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};

export default GroupDetails;