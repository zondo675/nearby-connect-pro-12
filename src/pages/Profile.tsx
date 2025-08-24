import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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
  const { signOut } = useAuth();
  const [isProviderMode, setIsProviderMode] = useState(false);
  
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/home");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Sign in required</h3>
          <p className="text-muted-foreground">Please sign in to access your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-white p-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.email?.split('@')[0] || 'User'}</h1>
            <p className="opacity-90">{user.email}</p>
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
              onCheckedChange={setIsProviderMode}
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