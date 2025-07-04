import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const FinanceCards = () => {
  // You can pass actual balances later via props
  const totalOwe = 0;
  const totalOwed = 0;

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
    </div>
  );
};

export default FinanceCards;
