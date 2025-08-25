import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, MessageSquarePlus } from "lucide-react";
import { useRealTimeChats } from "@/hooks/useRealTimeChats";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

const ChatList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { chats, messageRequests, loading } = useRealTimeChats();

  const filteredChats = chats.filter(chat => {
    const participant = chat.participants[0];
    return participant?.full_name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getLastMessagePreview = (chat: any) => {
    if (!chat.last_message) return "No messages yet";
    
    const message = chat.last_message;
    if (message.type === 'text') return message.content;
    if (message.type === 'image') return "📷 Photo";
    if (message.type === 'video') return "🎥 Video";
    if (message.type === 'audio') return "🎤 Voice message";
    return "📎 File";
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "";
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading chats...</div>
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
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Messages</h1>
              {messageRequests.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {messageRequests.length} message request{messageRequests.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/message-requests')}
          >
            <MessageSquarePlus className="h-5 w-5" />
            {messageRequests.length > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                {messageRequests.length}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      {/* Message Requests Banner */}
      {messageRequests.length > 0 && (
        <div className="p-4 bg-muted/30">
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow bg-primary/5 border-primary/20"
            onClick={() => navigate('/message-requests')}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <MessageSquarePlus className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-medium">Message Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    {messageRequests.length} pending request{messageRequests.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <Badge variant="secondary">{messageRequests.length}</Badge>
            </CardContent>
          </Card>
        </div>
      )}

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
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquarePlus className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
            <p className="text-muted-foreground mb-6">
              Start a conversation by sending a message request
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredChats.map((chat) => {
              const participant = chat.participants[0];
              if (!participant) return null;

              return (
                <Card
                  key={chat.id}
                  className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => navigate(`/chat/${chat.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={participant.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                          alt={participant.full_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {participant.is_online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold truncate">
                            {participant.full_name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {chat.last_message && (
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(chat.last_message.created_at)}
                              </span>
                            )}
                            {chat.unread_count > 0 && (
                              <Badge variant="destructive" className="h-5 min-w-[20px] text-xs">
                                {chat.unread_count}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground truncate">
                          {getLastMessagePreview(chat)}
                        </p>
                        
                        {!participant.is_online && participant.last_seen && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Last seen {formatTimestamp(participant.last_seen)}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;