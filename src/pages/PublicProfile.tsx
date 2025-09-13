import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, MapPin, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserSearch, UserProfile } from "@/hooks/useUserSearch";
import { useToast } from "@/hooks/use-toast";

export default function PublicProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { getPublicProfile } = useUserSearch();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        navigate(-1);
        return;
      }

      try {
        setLoading(true);
        const profileData = await getPublicProfile(userId);
        if (profileData) {
          setProfile(profileData);
        } else {
          toast({
            title: "Profile not found",
            description: "The user profile you're looking for doesn't exist.",
            variant: "destructive",
          });
          navigate(-1);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, getPublicProfile, navigate, toast]);

  const handleStartChat = () => {
    if (profile) {
      navigate(`/direct-chat/${profile.id}`);
    }
  };

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || '?';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="text-center space-y-2">
                  <Skeleton className="h-6 w-32 mx-auto" />
                  <Skeleton className="h-4 w-48 mx-auto" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold truncate">{profile.full_name}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              {/* Avatar with online status */}
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                  <AvatarFallback className="text-xl">
                    {getInitials(profile.full_name)}
                  </AvatarFallback>
                </Avatar>
                {profile.is_online && (
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-4 border-background"></div>
                )}
              </div>

              {/* Name and Status */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <h2 className="text-xl font-semibold">{profile.full_name}</h2>
                  {profile.is_provider && (
                    <Badge variant="secondary" className="text-xs">
                      Provider
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-center space-x-1 text-sm">
                  <div className={`h-2 w-2 rounded-full ${profile.is_online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-muted-foreground">
                    {profile.is_online ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-center text-muted-foreground text-sm leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Location */}
              {profile.location && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{profile.location}</span>
                </div>
              )}

              {/* Rating */}
              {profile.rating > 0 && (
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm">{profile.rating.toFixed(1)} rating</span>
                </div>
              )}

              {/* Last seen */}
              {!profile.is_online && profile.last_seen && (
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Last seen {new Date(profile.last_seen).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Button */}
        <Button
          onClick={handleStartChat}
          className="w-full"
          size="lg"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Start Conversation
        </Button>
      </main>
    </div>
  );
}