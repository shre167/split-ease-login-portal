import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PaymentCard from "@/components/Payments/PaymentCard";
import FilterChips from "@/components/Payments/FilterChips";
import BottomNavigation from "@/components/BottomNavigation";
import FloatingActionButton from "@/components//Payments/FloatingButton";
import { cn } from "@/lib/utils";
import Payments from '@/components/Payments/PaymentHistory';

const PaymentHistory = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeChips, setActiveChips] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for payments
  const payments = [
    {
      id: '1',
      category: 'Food',
      categoryIcon: '🍕',
      description: 'Lunch at Pizza Hut',
      amount: 24.50,
      date: 'Today, 2:30 PM',
      status: 'settled' as const,
      type: 'spent' as const,
    },
    {
      id: '2',
      category: 'Transport',
      categoryIcon: '🚗',
      description: 'Uber ride to downtown',
      amount: 15.75,
      date: 'Today, 10:15 AM',
      status: 'pending' as const,
      type: 'spent' as const,
    },
    {
      id: '3',
      category: 'Split Payment',
      categoryIcon: '💸',
      description: 'Sarah paid you back',
      amount: 42.00,
      date: 'Yesterday, 6:45 PM',
      status: 'settled' as const,
      type: 'received' as const,
    },
    {
      id: '4',
      category: 'Entertainment',
      categoryIcon: '🎬',
      description: 'Movie tickets for group',
      amount: 85.00,
      date: 'Yesterday, 7:30 PM',
      status: 'auto-detected' as const,
      type: 'spent' as const,
    },
    {
      id: '5',
      category: 'Rent',
      categoryIcon: '🏠',
      description: 'Monthly rent payment',
      amount: 1200.00,
      date: 'Oct 1, 2024',
      status: 'settled' as const,
      type: 'spent' as const,
    },
    {
      id: '6',
      category: 'Utilities',
      categoryIcon: '⚡',
      description: 'Electricity bill split',
      amount: 67.33,
      date: 'Sep 28, 2024',
      status: 'pending' as const,
      type: 'spent' as const,
    },
  ];

  const filterOptions = [
    { id: 'all', label: 'All', active: activeFilter === 'all' },
    { id: 'group', label: 'Group', active: activeFilter === 'group' },
    { id: 'personal', label: 'Personal', active: activeFilter === 'personal' },
  ];

  const categoryChips = [
    { id: 'food', label: 'Food', icon: '🍕', active: activeChips.includes('food') },
    { id: 'rent', label: 'Rent', icon: '🏠', active: activeChips.includes('rent') },
    { id: 'transport', label: 'Transport', icon: '🚗', active: activeChips.includes('transport') },
    { id: 'entertainment', label: 'Fun', icon: '🎬', active: activeChips.includes('entertainment') },
    { id: 'utilities', label: 'Bills', icon: '⚡', active: activeChips.includes('utilities') },
    { id: 'split', label: 'Split', icon: '💸', active: activeChips.includes('split') },
  ];

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠', active: false },
    { id: 'groups', label: 'Groups', icon: '👥', active: false },
    { id: 'history', label: 'History', icon: '📊', active: true },
    { id: 'profile', label: 'Profile', icon: '👤', active: false },
  ];

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
  };

  const handleChipClick = (chipId: string) => {
    setActiveChips(prev => 
      prev.includes(chipId) 
        ? prev.filter(id => id !== chipId)
        : [...prev, chipId]
    );
  };

  const handleNavClick = (navId: string) => {
    console.log('Navigate to:', navId);
  };

  const handleAddPayment = () => {
    console.log('Add new payment');
  };

  const filteredPayments = payments.filter(payment => {
    // Search filter
    if (searchQuery && !payment.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category chip filter
    if (activeChips.length > 0) {
      const paymentCategory = payment.category.toLowerCase().replace(' payment', '');
      return activeChips.some(chip => paymentCategory.includes(chip));
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Gradient Header */}
      <div className="gradient-header px-4 py-8 pb-4">
        <div className="max-w-md mx-auto">
          
          <h1 className="text-white text-greeting mb-6">Payment History</h1>
          
          {/* Search */}
        <Input
  placeholder="Search payments..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="mt-[-10px] mb-12 rounded-2xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/70 focus:bg-white/20"
/>

        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-md mx-auto px-4 -mt-10 mb-4">
        <div className="card-highlight rounded-2xl p-4 mb-4">
          {/* Filter Tabs */}
          <div className="flex space-x-2 mb-4">
            {filterOptions.map((filter) => (
              <Button
                key={filter.id}
                variant="tab"
                size="sm"
                onClick={() => handleFilterClick(filter.id)}
                className={cn(
                  "px-4 py-2 rounded-full transition-all duration-300 relative",
                  filter.active 
                    ? "bg-secondary text-secondary-foreground shadow-md tab-active" 
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {filter.label}
              </Button>
            ))}
          </div>
          
          {/* Category Filter Chips */}
          <FilterChips 
            chips={categoryChips} 
            onChipClick={handleChipClick} 
          />
        </div>
      </div>

      {/* Payment List */}
      <div className="max-w-md mx-auto px-4 py-4 space-y-3">
        {filteredPayments.length > 0 ? (
          filteredPayments.map((payment) => (
            <PaymentCard key={payment.id} {...payment} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💸</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No payments found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleAddPayment} />

      {/* Bottom Navigation */}
      <BottomNavigation navItems={navItems} onNavClick={handleNavClick} />
    </div>
  );
};

export default PaymentHistory;