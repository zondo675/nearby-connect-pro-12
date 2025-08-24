import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  MapPin, 
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
  
  // Mock user data
  const user = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    completedJobs: 23,
    memberSince: "Jan 2024"
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-white p-6">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="opacity-90">{user.email}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{user.rating}</span>
              </div>
              <span className="text-sm opacity-75">Member since {user.memberSince}</span>
            </div>
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

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="text-center p-4">
              <div className="text-2xl font-bold text-primary">{user.completedJobs}</div>
              <div className="text-sm text-muted-foreground">Jobs Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-4">
              <div className="text-2xl font-bold text-secondary">4.8</div>
              <div className="text-sm text-muted-foreground">Rating</div>
            </CardContent>
          </Card>
        </div>

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
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <span>Location</span>
                  <p className="text-sm text-muted-foreground">{user.location}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Change
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