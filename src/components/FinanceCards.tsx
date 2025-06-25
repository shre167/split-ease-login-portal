
import React from 'react';
import { Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const FinanceCards = () => {
  const groups = [
    {
      id: 1,
      name: "Rishikesh Trip",
      amount: -450.75,
      members: 6,
      image: "🏔️"
    },
    {
      id: 2,
      name: "Office Lunches",
      amount: 120.50,
      members: 4,
      image: "🍽️"
    },
    {
      id: 3,
      name: "Roommate Expenses",
      amount: -230.25,
      members: 3,
      image: "🏠"
    }
  ];

  const totalOwe = groups.reduce((sum, group) => sum + (group.amount < 0 ? Math.abs(group.amount) : 0), 0);
  const totalOwed = groups.reduce((sum, group) => sum + (group.amount > 0 ? group.amount : 0), 0);

  return (
    <div className="space-y-6">
      {/* Balance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* You Owe Card */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-red-700 font-semibold text-lg">You Owe</h3>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-800">${totalOwe.toFixed(2)}</p>
          <p className="text-red-600 text-sm mt-1">Total amount you owe</p>
        </div>

        {/* You Are Owed Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-green-700 font-semibold text-lg">You Are Owed</h3>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-800">${totalOwed.toFixed(2)}</p>
          <p className="text-green-600 text-sm mt-1">Total amount owed to you</p>
        </div>
      </div>

      {/* Groups Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Your Groups</h2>
          <span className="text-sm text-gray-500">{groups.length} groups</span>
        </div>
        
        <div className="space-y-3">
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-xl">
                    {group.image}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{group.name}</h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{group.members} members</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`flex items-center space-x-1 ${
                    group.amount < 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold">
                      {Math.abs(group.amount).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {group.amount < 0 ? 'you owe' : 'you are owed'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinanceCards;