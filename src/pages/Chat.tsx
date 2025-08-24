import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  Phone, 
  Video,
  MoreVertical,
  Image as ImageIcon,
  MapPin,
  Search
} from "lucide-react";

const ChatScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample chat list data
  const chatList = [
    {
      id: "1",
      name: "Mike Johnson",
      lastMessage: "$45/hour, plus materials if needed. I'll provide an estimate before starting any work.",
      timestamp: "2:36 PM",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      service: "Plumbing",
      unread: 0,
      online: true
    },
    {
      id: "2", 
      name: "Sarah Chen",
      lastMessage: "I can start the electrical work tomorrow morning. What time works best?",
      timestamp: "Yesterday",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b780?w=40&h=40&fit=crop&crop=face",
      service: "Electrical",
      unread: 2,
      online: false
    },
    {
      id: "3",
      name: "David Wilson", 
      lastMessage: "Thanks for the cleaning service! Everything looks great.",
      timestamp: "Monday",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", 
      service: "Cleaning",
      unread: 0,
      online: false
    },
    {
      id: "4",
      name: "Lisa Martinez",
      lastMessage: "I'll bring my laptop repair tools. See you at 3 PM.",
      timestamp: "Sunday",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      service: "Computer Repair", 
      unread: 1,
      online: true
    }
  ];

  // Sample messages for individual chat
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I saw your plumbing request. I can help with that kitchen sink issue.",
      sender: "provider",
      timestamp: "2:30 PM",
      providerName: "Mike Johnson"
    },
    {
      id: 2,
      text: "Great! When would you be available to take a look?",
      sender: "user",
      timestamp: "2:32 PM"
    },
    {
      id: 3,
      text: "I can come by today around 4 PM if that works for you. It should take about 1-2 hours to fix.",
      sender: "provider",
      timestamp: "2:33 PM",
      providerName: "Mike Johnson"
    },
    {
      id: 4,
      text: "Perfect! What's your rate?",
      sender: "user",
      timestamp: "2:35 PM"
    },
    {
      id: 5,
      text: "$45/hour, plus materials if needed. I'll provide an estimate before starting any work.",
      sender: "provider",
      timestamp: "2:36 PM",
      providerName: "Mike Johnson"
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const filteredChats = chatList.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCurrentChat = () => {
    return chatList.find(chat => chat.id === id);
  };

  // Show chat list if no ID is provided
  if (!id) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="bg-white border-b shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">Messages</h1>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => navigate(`/chat/${chat.id}`)}
              className="flex items-center p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="relative">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <div className="flex-1 ml-3 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold truncate">{chat.name}</h3>
                  <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate mr-2">
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{chat.service}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show individual chat conversation
  const currentChat = getCurrentChat();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/chat')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <img
                src={currentChat?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                alt={currentChat?.name || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold">{currentChat?.name || "Mike Johnson"}</h2>
                <p className="text-sm text-muted-foreground">
                  {currentChat?.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
              {msg.sender === 'provider' && (
                <p className="text-xs text-muted-foreground mb-1 px-1">
                  {msg.providerName}
                </p>
              )}
              <div
                className={`rounded-2xl p-3 ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p>{msg.text}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1 px-1">
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Booking suggestion */}
      <div className="p-4">
        <Card className="bg-gradient-card border-primary/20">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <h3 className="font-semibold">Ready to book?</h3>
              <p className="text-sm text-muted-foreground">Schedule {currentChat?.name || "Mike"} for today at 4 PM</p>
            </div>
            <Button size="sm">Book Now</Button>
          </CardContent>
        </Card>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MapPin className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 flex space-x-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;