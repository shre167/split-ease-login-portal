import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, Send } from "lucide-react";

const RequestToBorrow = () => {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [selectedContributors, setSelectedContributors] = useState<string[]>([]);

  const groupMembers = [
    { id: "alex", name: "Alex", avatar: "A", suggestedAmount: 150 },
    { id: "jordan", name: "Jordan", avatar: "J", suggestedAmount: 100 },
    { id: "taylor", name: "Taylor", avatar: "T", suggestedAmount: 75 },
    { id: "casey", name: "Casey", avatar: "C", suggestedAmount: 50 },
  ];

  const activeRequests = [
    {
      id: 1,
      requester: "Taylor",
      amount: 200,
      reason: "Emergency car repair",
      progress: 150,
      contributors: [
        { name: "Alex", amount: 100, avatar: "A" },
        { name: "Jordan", amount: 50, avatar: "J" },
      ],
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      requester: "Casey",
      amount: 80,
      reason: "Medical consultation",
      progress: 80,
      contributors: [
        { name: "Alex", amount: 50, avatar: "A" },
        { name: "Jordan", amount: 30, avatar: "J" },
      ],
      timestamp: "1 day ago"
    }
  ];

  const toggleContributor = (memberId: string) => {
    setSelectedContributors(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSendRequest = () => {
    if (amount && selectedContributors.length > 0) {
      // Send request logic here
      console.log("Sending request:", { amount, reason, contributors: selectedContributors });
    }
  };

  return (
    <div className="space-y-6 px-6">
      {/* New Request Form */}
      <div className="bg-white/80 backdrop-blur-glass rounded-2xl p-6 shadow-glass border border-white/20">
        <h2 className="text-xl font-bold text-foreground mb-4">🪙 Request to Borrow</h2>
        
        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">Amount Needed</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-glass border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-lg font-semibold"
            />
          </div>
        </div>

        {/* Reason Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">Reason (Optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="What do you need this for?"
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-glass border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={3}
          />
        </div>

        {/* Contributors Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">Select Contributors</label>
          <div className="grid grid-cols-2 gap-3">
            {groupMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => toggleContributor(member.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  selectedContributors.includes(member.id)
                    ? "border-primary bg-gradient-glow/20"
                    : "border-border bg-white/40"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{member.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">Suggested: ${member.suggestedAmount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Send Request Button */}
        <Button 
          onClick={handleSendRequest}
          disabled={!amount || selectedContributors.length === 0}
          className="w-full h-12"
          variant="glow"
        >
          <Send className="w-4 h-4 mr-2" />
          Send Request
        </Button>
      </div>

      {/* Active Requests */}
      <div className="bg-white/80 backdrop-blur-glass rounded-2xl p-6 shadow-glass border border-white/20">
        <h3 className="text-lg font-bold text-foreground mb-4">📋 Active Requests</h3>
        
        <div className="space-y-4">
          {activeRequests.map((request) => (
            <div key={request.id} className="p-4 bg-muted/30 rounded-xl">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-foreground">{request.requester} needs ${request.amount}</p>
                  <p className="text-sm text-muted-foreground">{request.reason}</p>
                </div>
                <span className="text-xs text-muted-foreground">{request.timestamp}</span>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">${request.progress}/${request.amount}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(request.progress / request.amount) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Contributors */}
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div className="flex space-x-2">
                  {request.contributors.map((contributor, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">{contributor.avatar}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">${contributor.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {request.progress < request.amount && (
                <div className="flex space-x-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    Contribute
                  </Button>
                  <Button variant="ghost" size="sm">
                    Remind
                  </Button>
                </div>
              )}

              {request.progress >= request.amount && (
                <div className="mt-3 p-2 bg-green-50 rounded-lg">
                  <p className="text-green-700 text-sm font-medium text-center">✅ Fully Funded!</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequestToBorrow;