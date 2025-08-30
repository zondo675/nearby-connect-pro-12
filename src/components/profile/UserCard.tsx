import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star,
  MapPin,
  Clock,
  CheckCircle,
  MessageCircle,
  Heart,
  Share2
} from "lucide-react";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    bio?: string;
    rating?: number;
    reviewCount?: number;
    location?: string;
    responseTime?: string;
    isVerified?: boolean;
    skills?: string[];
  };
  variant?: "compact" | "detailed";
  showActions?: boolean;
  onMessageClick?: () => void;
  onBookClick?: () => void;
}

const UserCard = ({ 
  user, 
  variant = "detailed", 
  showActions = true,
  onMessageClick,
  onBookClick
}: UserCardProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="overflow-hidden hover:shadow-elevated transition-all duration-200 bg-gradient-surface border border-primary/10">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-lg leading-tight">{user.name}</h3>
                {user.bio && variant === "detailed" && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{user.bio}</p>
                )}
              </div>
              
              {/* Actions */}
              {variant === "compact" && (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Rating & Stats */}
            <div className="flex items-center space-x-4 mb-3">
              {user.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{user.rating}</span>
                  {user.reviewCount && (
                    <span className="text-sm text-muted-foreground">({user.reviewCount})</span>
                  )}
                </div>
              )}
              
              {user.location && (
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
              )}
              
              {user.responseTime && (
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{user.responseTime}</span>
                </div>
              )}
            </div>

            {/* Skills */}
            {user.skills && user.skills.length > 0 && variant === "detailed" && (
              <div className="flex flex-wrap gap-1 mb-4">
                {user.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {user.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{user.skills.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {showActions && variant === "detailed" && (
              <div className="flex items-center space-x-3">
                <Button 
                  onClick={onBookClick}
                  className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-200"
                >
                  Book Now
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onMessageClick}
                  className="flex-1"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;