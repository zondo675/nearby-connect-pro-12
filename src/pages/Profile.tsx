import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  Star, 
  Settings, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  LogOut,
  Edit,
  Shield,
  Heart,
  MessageCircle,
  Briefcase
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { signOut, user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const [isProviderMode, setIsProviderMode] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setIsProviderMode(profile.is_provider || false);
    }
  }, [profile]);

  const handleLogout = async () => {
    if (user) {
      await signOut();
    }
    navigate("/login");
  };

  const handleProviderModeToggle = async (checked: boolean) => {
    setIsProviderMode(checked);
    await updateProfile({ is_provider: checked });
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="bg-gradient-primary text-white p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-32 bg-white/20" />
              <Skeleton className="h-4 w-48 bg-white/20" />
            </div>
          </div>
        </div>
        <div className="p-4 space-y-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;


  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-white p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20 border-4 border-white/20">
            <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || 'User'} />
            <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
              {getInitials(profile?.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {profile?.full_name || user?.email?.split('@')[0] || 'Guest User'}
            </h1>
            <p className="opacity-90">{user?.email || 'Not signed in'}</p>
            {profile?.bio && (
              <p className="text-sm opacity-80 mt-1">{profile.bio}</p>
            )}
          </div>
          <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate("/profile/edit")} aria-label="Edit profile">
            <Edit className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Provider Mode Toggle */}
        <Card className="bg-gradient-card">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">Provider Mode</h3>
                <p className="text-sm text-muted-foreground">
                  {isProviderMode ? "You're offering services" : "Switch to offer services"}
                </p>
              </div>
            </div>
            <Switch 
              checked={isProviderMode} 
              onCheckedChange={handleProviderModeToggle}
            />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate("/profile/chats")}
            >
              <MessageCircle className="mr-3 h-4 w-4" />
              My Chats
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate("/profile/saved-providers")}
            >
              <Heart className="mr-3 h-4 w-4" />
              Saved Providers
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate("/profile/reviews")}
            >
              <Star className="mr-3 h-4 w-4" />
              My Reviews
            </Button>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <span>Personal Information</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/profile/edit")}>
                Edit
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span>Payment Methods</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/profile/payment-methods")}
              >
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span>Notifications</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/profile/notifications")}
              >
                Manage
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span>Privacy Settings</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/profile/privacy")}
              >
                Manage
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span>App Settings</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/profile/app-settings")}
              >
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate("/profile/help")}
            >
              <HelpCircle className="mr-3 h-4 w-4" />
              Help Center
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="p-4">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;