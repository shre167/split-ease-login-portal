import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

const SettlementAnalytics = () => {
  const settlements = [
    { from: "Jordan", to: "Alex", amount: 125, avatar: { from: "J", to: "A" } },
    { from: "Taylor", to: "Alex", amount: 75, avatar: { from: "T", to: "A" } },
    { from: "Casey", to: "Alex", amount: 50, avatar: { from: "C", to: "A" } },
  ];

  const balanceSummary = [
    { name: "Alex", avatar: "A", balance: 250, type: "owed" },
    { name: "Jordan", avatar: "J", balance: -125, type: "owes" },
    { name: "Taylor", avatar: "T", balance: -75, type: "owes" },
    { name: "Casey", avatar: "C", balance: -50, type: "owes" },
  ];

  const recurringExpenses = [
    { name: "Netflix", amount: 15.99, frequency: "Monthly", nextDue: "Jul 15", icon: "📺" },
    { name: "Spotify", amount: 9.99, frequency: "Monthly", nextDue: "Jul 20", icon: "🎵" },
    { name: "Rent", amount: 800, frequency: "Monthly", nextDue: "Aug 1", icon: "🏠" },
  ];

  return (
    <div className="space-y-6 px-6">
      {/* Group Balance Summary */}
      <div className="bg-white/80 backdrop-blur-glass rounded-2xl p-6 shadow-glass border border-white/20">
        <h2 className="text-xl font-bold text-foreground mb-4">💸 Settlement Overview</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-green-600 text-sm font-medium">Total Owed</p>
            <p className="text-2xl font-bold text-green-700">$250.00</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <p className="text-red-600 text-sm font-medium">Pending</p>
            <p className="text-2xl font-bold text-red-700">$250.00</p>
          </div>
        </div>

        {/* Balance Summary */}
        <div className="space-y-3">
          {balanceSummary.map((member, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">{member.avatar}</span>
                </div>
                <span className="font-medium text-foreground">{member.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                {member.type === "owed" ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`font-bold ${
                  member.type === "owed" ? "text-green-600" : "text-red-600"
                }`}>
                  ${Math.abs(member.balance)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Settlement Suggestions */}
      <div className="bg-white/80 backdrop-blur-glass rounded-2xl p-6 shadow-glass border border-white/20">
        <h3 className="text-lg font-bold text-foreground mb-4">🧠 Smart Settlement</h3>
        <p className="text-sm text-muted-foreground mb-4">Optimize payments in minimum steps:</p>
        
        <div className="space-y-4">
          {settlements.map((settlement, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gradient-glow/10 rounded-xl border border-primary/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{settlement.avatar.from}</span>
                </div>
                <ArrowUp className="w-4 h-4 text-primary" />
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{settlement.avatar.to}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">${settlement.amount}</p>
                <p className="text-xs text-muted-foreground">{settlement.from} → {settlement.to}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Button className="w-full mt-4" variant="glow">
          Execute Smart Settlement
        </Button>
      </div>

      {/* Recurring Expenses */}
      <div className="bg-white/80 backdrop-blur-glass rounded-2xl p-6 shadow-glass border border-white/20">
        <h3 className="text-lg font-bold text-foreground mb-4">🔄 Recurring Expenses</h3>
        
        <div className="space-y-3">
          {recurringExpenses.map((expense, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{expense.icon}</span>
                <div>
                  <p className="font-medium text-foreground">{expense.name}</p>
                  <p className="text-sm text-muted-foreground">{expense.frequency}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">${expense.amount}</p>
                <p className="text-xs text-muted-foreground">Due {expense.nextDue}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Frequent Patterns */}
      <div className="bg-white/80 backdrop-blur-glass rounded-2xl p-6 shadow-glass border border-white/20">
        <h3 className="text-lg font-bold text-foreground mb-4">📊 Payment Patterns</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <p className="text-blue-600 text-sm font-medium">Most Frequent Payer</p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
              <span className="font-bold text-blue-700">Alex</span>
            </div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <p className="text-orange-600 text-sm font-medium">Needs Reminders</p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">J</span>
              </div>
              <span className="font-bold text-orange-700">Jordan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettlementAnalytics;