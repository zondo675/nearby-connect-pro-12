import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  Phone, 
  Video,
  MoreVertical,
  Image as ImageIcon,
  MapPin
} from "lucide-react";
import { useRealTimeMessages } from "@/hooks/useRealTimeMessages";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

const ChatInterface = () => {
  const navigate = useNavigate();
  const { id: chatId } = useParams();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    otherParticipant, 
    loading, 
    sendMessage, 
    markMessagesAsSeen 
  } = useRealTimeMessages(chatId || null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as seen when chat opens
  useEffect(() => {
    if (chatId && messages.length > 0) {
      const timer = setTimeout(() => {
        markMessagesAsSeen();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [chatId, messages, markMessagesAsSeen]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const success = await sendMessage(message);
    if (success) {
      setMessage("");
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 mx-auto">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-medium mb-2">Sign in required</h3>
          <p className="text-muted-foreground">
            Please sign in to access conversations
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading conversation...</div>
      </div>
    );
  }

  if (!otherParticipant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Chat not found</h3>
          <Button onClick={() => navigate('/chat')}>Go back to chats</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
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
              <div className="relative">
                <img
                  src={otherParticipant.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                  alt={otherParticipant.full_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {otherParticipant.is_online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h2 className="font-semibold">{otherParticipant.full_name}</h2>
                <p className="text-sm text-muted-foreground">
                  {otherParticipant.is_online 
                    ? "Active now" 
                    : `Last seen ${formatDistanceToNow(new Date(otherParticipant.last_seen), { addSuffix: true })}`
                  }
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
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">👋</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Start the conversation</h3>
            <p className="text-muted-foreground">
              Say hello to {otherParticipant.full_name}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${msg.sender_id === user?.id ? 'order-2' : 'order-1'}`}>
                {msg.sender_id !== user?.id && messages.indexOf(msg) === 0 && (
                  <p className="text-xs text-muted-foreground mb-1 px-1">
                    {msg.sender?.full_name || otherParticipant.full_name}
                  </p>
                )}
                
                <div
                  className={`rounded-2xl p-3 max-w-full break-words ${
                    msg.sender_id === user?.id
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted'
                  }`}
                >
                  {msg.type === 'text' ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : msg.type === 'image' ? (
                    <div>
                      {msg.file_url && (
                        <img 
                          src={msg.file_url} 
                          alt="Shared image" 
                          className="rounded-lg max-w-full h-auto mb-2"
                        />
                      )}
                      {msg.content && <p>{msg.content}</p>}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Paperclip className="h-4 w-4" />
                      <span className="text-sm">{msg.content || 'File'}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-1 px-1">
                  <p className="text-xs text-muted-foreground">
                    {formatMessageTime(msg.created_at)}
                  </p>
                  
                  {msg.sender_id === user?.id && (
                    <div className="flex items-center space-x-1">
                      <div className={`w-1 h-1 rounded-full ${
                        msg.status === 'seen' ? 'bg-primary' : 'bg-muted-foreground'
                      }`} />
                      <div className={`w-1 h-1 rounded-full ${
                        msg.status === 'seen' ? 'bg-primary' : 
                        msg.status === 'delivered' ? 'bg-muted-foreground' : 'bg-muted'
                      }`} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4 sticky bottom-0">
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
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
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

export default ChatInterface;