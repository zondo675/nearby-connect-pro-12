import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check, X, MessageCircle } from "lucide-react";
import { useRealTimeChats } from "@/hooks/useRealTimeChats";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const MessageRequests = () => {
  const navigate = useNavigate();
  const { messageRequests, loading, respondToMessageRequest } = useRealTimeChats();
  const { toast } = useToast();

  const handleAccept = async (requestId: string) => {
    const success = await respondToMessageRequest(requestId, true);
    if (success) {
      toast({
        title: "Request accepted",
        description: "You can now chat with this person",
      });
      // Refresh the page or remove from list
      window.location.reload();
    } else {
      toast({
        title: "Error",
        description: "Failed to accept request",
        variant: "destructive",
      });
    }
  };

  const handleDecline = async (requestId: string) => {
    const success = await respondToMessageRequest(requestId, false);
    if (success) {
      toast({
        title: "Request declined",
        description: "The message request has been declined",
      });
      // Refresh the page or remove from list
      window.location.reload();
    } else {
      toast({
        title: "Error",
        description: "Failed to decline request",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading requests...</div>
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
            <h1 className="text-xl font-semibold">Message Requests</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4">
        {messageRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No message requests</h3>
            <p className="text-muted-foreground">
              When someone sends you a message request, it will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {messageRequests.length} pending request{messageRequests.length > 1 ? 's' : ''}
            </p>
            
            {messageRequests.map((request) => {
              if (!request.sender) return null;
              
              return (
                <Card key={request.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={request.sender.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                        alt={request.sender.full_name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{request.sender.full_name}</h3>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {request.message}
                        </p>
                        
                        <div className="flex items-center space-x-3">
                          <Button
                            onClick={() => handleAccept(request.id)}
                            className="flex-1"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleDecline(request.id)}
                            className="flex-1"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                        </div>
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

export default MessageRequests;