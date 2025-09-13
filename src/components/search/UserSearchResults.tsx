import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/hooks/useUserSearch";
import { useNavigate } from "react-router-dom";

interface UserSearchResultsProps {
  results: UserProfile[];
  onUserSelect?: (user: UserProfile) => void;
}

export const UserSearchResults = ({ results, onUserSelect }: UserSearchResultsProps) => {
  const navigate = useNavigate();

  const handleMessageUser = (user: UserProfile) => {
    navigate(`/direct-chat?userId=${user.id}`);
  };

  const handleViewProfile = (user: UserProfile) => {
    navigate(`/profile/${user.id}`);
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No users found matching your search.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((user) => (
        <Card key={user.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar_url} alt={user.full_name} />
                  <AvatarFallback>
                    {user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                {user.is_online && (
                  <div className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-foreground truncate">
                    {user.full_name}
                  </h3>
                  {user.is_provider && (
                    <Badge variant="secondary" className="text-xs">
                      Provider
                    </Badge>
                  )}
                </div>
                
                {user.bio && (
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {user.bio}
                  </p>
                )}
                
                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                  {user.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  
                  {user.rating > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{user.rating.toFixed(1)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1">
                    <div className={`h-2 w-2 rounded-full ${user.is_online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span>{user.is_online ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewProfile(user)}
                >
                  View
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleMessageUser(user)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Message
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};