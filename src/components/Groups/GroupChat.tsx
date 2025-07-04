import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Plus } from "lucide-react";

interface Message {
  id: number;
  user: string;
  avatar: string;
  message: string;
  timestamp: string;
  type: "text" | "expense" | "settlement";
  reactions?: string[];
}

const GroupChat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [messages] = useState<Message[]>([
    {
      id: 1,
      user: "Alex",
      avatar: "A",
      message: "Just added dinner expenses from last night! 🍕",
      timestamp: "2:30 PM",
      type: "text",
      reactions: ["👍", "😋"]
    },
    {
      id: 2,
      user: "System",
      avatar: "💰",
      message: "Alex added $85.50 for 'Pizza Night' in Food category",
      timestamp: "2:31 PM",
      type: "expense"
    },
    {
      id: 3,
      user: "Jordan",
      avatar: "J",
      message: "Thanks for covering! I'll settle up this weekend",
      timestamp: "2:45 PM",
      type: "text",
      reactions: ["❤️"]
    },
    {
      id: 4,
      user: "Taylor",
      avatar: "T",
      message: "Should we split the Uber ride back too?",
      timestamp: "3:15 PM",
      type: "text"
    },
    {
      id: 5,
      user: "Casey",
      avatar: "C",
      message: "Yeah, it was $24 total",
      timestamp: "3:16 PM",
      type: "text"
    },
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("");
    }
  };

  const getMessageBubbleStyle = (type: string, isOwnMessage: boolean = false) => {
    if (type === "expense" || type === "settlement") {
      return "bg-gradient-glow/20 border border-primary/20 text-center mx-4 text-sm";
    }
    return isOwnMessage 
      ? "bg-gradient-primary text-white ml-12" 
      : "bg-white/80 backdrop-blur-glass border border-white/20 mr-12";
  };

  return (
    <div className="bg-white/80 backdrop-blur-glass rounded-2xl shadow-glass border border-white/20 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-primary p-4 text-white">
        <h3 className="text-lg font-bold">💬 Group Chat</h3>
        <p className="text-white/80 text-sm">4 members • 3 online</p>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            {message.type === "text" ? (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">{message.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{message.user}</span>
                    <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                  </div>
                  <div className="bg-white/60 backdrop-blur-glass rounded-2xl rounded-tl-md p-3 border border-white/20">
                    <p className="text-sm text-foreground">{message.message}</p>
                    {message.reactions && (
                      <div className="flex space-x-1 mt-2">
                        {message.reactions.map((reaction, index) => (
                          <span key={index} className="text-sm bg-white/50 rounded-full px-2 py-1">
                            {reaction}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="bg-gradient-glow/20 border border-primary/20 rounded-xl p-3 max-w-xs">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{message.avatar}</span>
                    <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                  </div>
                  <p className="text-sm text-foreground text-center">{message.message}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Plus className="w-4 h-4" />
          </Button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-2 bg-white/80 backdrop-blur-glass border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <button className="text-lg">😊</button>
            </div>
          </div>
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Typing Indicator */}
        <div className="mt-2 text-xs text-muted-foreground">
          <span className="animate-pulse">Taylor is typing...</span>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;