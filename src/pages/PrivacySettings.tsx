import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Shield, Eye, MapPin, Phone } from "lucide-react";

const PrivacySettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    profileVisible: true,
    showLocation: true,
    showPhoneNumber: false,
    allowMessages: true,
    shareActivity: false,
    dataAnalytics: true
  });

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white p-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => navigate("/profile")}
            aria-label="Go back to profile"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Privacy Settings</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Profile Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Profile Visibility</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Public Profile</h4>
                <p className="text-sm text-muted-foreground">
                  Make your profile visible to service providers
                </p>
              </div>
              <Switch 
                checked={settings.profileVisible}
                onCheckedChange={() => handleSettingChange('profileVisible')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Show Location</h4>
                  <p className="text-sm text-muted-foreground">
                    Display your general location to providers
                  </p>
                </div>
              </div>
              <Switch 
                checked={settings.showLocation}
                onCheckedChange={() => handleSettingChange('showLocation')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Show Phone Number</h4>
                  <p className="text-sm text-muted-foreground">
                    Allow providers to see your phone number
                  </p>
                </div>
              </div>
              <Switch 
                checked={settings.showPhoneNumber}
                onCheckedChange={() => handleSettingChange('showPhoneNumber')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Communication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Communication</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Allow Messages</h4>
                <p className="text-sm text-muted-foreground">
                  Let service providers message you directly
                </p>
              </div>
              <Switch 
                checked={settings.allowMessages}
                onCheckedChange={() => handleSettingChange('allowMessages')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data & Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Data & Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Share Activity</h4>
                <p className="text-sm text-muted-foreground">
                  Help improve our service with usage data
                </p>
              </div>
              <Switch 
                checked={settings.shareActivity}
                onCheckedChange={() => handleSettingChange('shareActivity')}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Allow us to analyze your app usage for improvements
                </p>
              </div>
              <Switch 
                checked={settings.dataAnalytics}
                onCheckedChange={() => handleSettingChange('dataAnalytics')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full">
              Download My Data
            </Button>
            <Button variant="outline" className="w-full">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacySettings;