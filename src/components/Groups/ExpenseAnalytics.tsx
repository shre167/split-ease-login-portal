import { useState } from "react";
import { Button } from "@/components/ui/button";

const ExpenseAnalytics = () => {
  const [timeFilter, setTimeFilter] = useState("7d");

  const analytics = {
    totalExpenses: 2840.50,
    thisMonth: 1256.75,
    categories: [
      { name: "Food", amount: 890, percentage: 31, emoji: "🍔", color: "bg-orange-400" },
      { name: "Travel", amount: 650, percentage: 23, emoji: "✈️", color: "bg-blue-400" },
      { name: "Rent", amount: 800, percentage: 28, emoji: "🏠", color: "bg-green-400" },
      { name: "Entertainment", amount: 350, percentage: 12, emoji: "🎬", color: "bg-purple-400" },
      { name: "Other", amount: 150, percentage: 6, emoji: "📦", color: "bg-gray-400" },
    ],
    topSpenders: [
      { name: "Alex", amount: 1200, avatar: "A", rank: 1 },
      { name: "Jordan", amount: 850, avatar: "J", rank: 2 },
      { name: "Taylor", amount: 620, avatar: "T", rank: 3 },
      { name: "Casey", amount: 370, avatar: "C", rank: 4 },
    ],
    monthlyTrend: [
      { month: "Jan", amount: 1200 },
      { month: "Feb", amount: 980 },
      { month: "Mar", amount: 1450 },
      { month: "Apr", amount: 1890 },
      { month: "May", amount: 2100 },
      { month: "Jun", amount: 2840 },
    ]
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return "🏅";
    }
  };

  return (
    <div className="space-y-6 px-6">
      {/* Total Expenses Card */}
      <div className="bg-white/80 backdrop-blur-glass rounded-2xl p-6 shadow-glass border border-white/20">
        <h2 className="text-xl font-bold text-foreground mb-4">💰 Expense Overview</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Total Expenses</p>
            <p className="text-2xl font-bold text-foreground">${analytics.totalExpenses.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-sm">This Month</p>
            <p className="text-2xl font-bold text-primary">${analytics.thisMonth.toFixed(2)}</p>
          </div>
        </div>

        {/* Donut Chart Placeholder */}
        <div className="flex justify-center mb-4">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20"></div>
            <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-sm font-bold text-foreground">${analytics.totalExpenses.toFixed(0)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white/80 backdrop-blur-glass rounded-2xl p-6 shadow-glass border border-white/20">
        <h3 className="text-lg font-bold text-foreground mb-4">📊 Category Breakdown</h3>
        
        <div className="space-y-3">
          {analytics.categories.map((category, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className="text-xl">{category.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-foreground">{category.name}</span>
                  <span className="text-sm text-muted-foreground">${category.amount}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${category.color}`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground w-10 text-right">{category.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Spenders */}
      <div className="bg-white/80 backdrop-blur-glass rounded-2xl p-6 shadow-glass border border-white/20">
        <h3 className="text-lg font-bold text-foreground mb-4">🏆 Top Contributors</h3>
        
        <div className="space-y-3">
          {analytics.topSpenders.map((spender, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-muted/50 rounded-xl">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getRankEmoji(spender.rank)}</span>
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">{spender.avatar}</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{spender.name}</p>
                <p className="text-sm text-muted-foreground">Rank #{spender.rank}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">${spender.amount}</p>
                <p className="text-xs text-muted-foreground">contributed</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expense Trends */}
      <div className="bg-white/80 backdrop-blur-glass rounded-2xl p-6 shadow-glass border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-foreground">📈 Expense Trends</h3>
          <div className="flex space-x-1">
            {["7d", "30d", "6mo"].map((period) => (
              <Button
                key={period}
                variant={timeFilter === period ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeFilter(period)}
                className="text-xs"
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Simple trend visualization */}
        <div className="flex items-end space-x-2 h-32">
          {analytics.monthlyTrend.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gradient-primary rounded-t opacity-70"
                style={{ height: `${(data.amount / 3000) * 100}%` }}
              ></div>
              <span className="text-xs text-muted-foreground mt-2">{data.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalytics;