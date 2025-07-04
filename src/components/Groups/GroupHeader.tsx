import { Button } from "@/components/ui/button";
import { Plus, DollarSign, Send, ArrowLeft, Users } from "lucide-react";
// import groupAvatar from "@/assets/group-avatar.png";

const GroupHeader = () => {
  const groupMembers = [
    { id: 1, name: "Alex", avatar: "A", balance: 250 },
    { id: 2, name: "Jordan", avatar: "J", balance: -125 },
    { id: 3, name: "Taylor", avatar: "T", balance: -75 },
    { id: 4, name: "Casey", avatar: "C", balance: -50 },
  ];

  const totalBalance = groupMembers.reduce((sum, member) => sum + member.balance, 0);

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-primary opacity-95"></div>
      <div className="absolute inset-0 bg-gradient-glass backdrop-blur-sm"></div>
      
      <div className="relative px-6 py-8 text-white">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Users className="h-5 w-5" />
          </Button>
        </div>

        {/* Group Info */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl shadow-glass flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-400 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-xs font-bold text-white">{groupMembers.length}</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">Weekend Trip Squad</h1>
            <p className="text-white/80 text-sm">Created 2 weeks ago</p>
          </div>
        </div>

        {/* Total Balance */}
        <div className="bg-white/10 backdrop-blur-glass rounded-2xl p-4 mb-6 border border-white/20">
          <div className="text-center">
            <p className="text-white/80 text-sm mb-1">Total Group Balance</p>
            <p className="text-3xl font-bold">${Math.abs(totalBalance).toFixed(2)}</p>
            <p className="text-white/80 text-xs">
              {totalBalance >= 0 ? "All settled up! 🎉" : "Some payments pending"}
            </p>
          </div>
        </div>

        {/* Member Avatars */}
        <div className="flex justify-center space-x-3 mb-6">
          {groupMembers.map((member) => (
            <div key={member.id} className="text-center group">
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-glass rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-semibold">{member.avatar}</span>
                </div>
                {member.balance !== 0 && (
                  <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    member.balance > 0 ? 'bg-green-400' : 'bg-red-400'
                  }`}>
                    {member.balance > 0 ? '+' : '-'}
                  </div>
                )}
              </div>
              <p className="text-xs text-white/80 mt-1">{member.name}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button variant="glass" className="h-12">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
          <Button variant="glass" className="h-12">
            <DollarSign className="w-4 h-4 mr-2" />
            Settle Up
          </Button>
          <Button variant="glass" className="h-12">
            <Send className="w-4 h-4 mr-2" />
            Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GroupHeader;