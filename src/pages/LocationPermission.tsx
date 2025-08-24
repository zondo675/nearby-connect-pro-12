import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Map, ArrowRight, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LocationPermission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleAllowLocation = async () => {
    setIsGettingLocation(true);
    
    try {
      // Simulate getting location
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock location data
      const location = {
        latitude: 40.7128,
        longitude: -74.0060,
        city: "New York",
        country: "USA"
      };
      
      // Update user with location
      const user = JSON.parse(localStorage.getItem("servicehub_user") || "{}");
      user.location = location;
      localStorage.setItem("servicehub_user", JSON.stringify(user));
      
      toast({
        title: "Location detected",
        description: `Found you in ${location.city}`,
      });
      
      navigate("/home");
    } catch (error) {
      toast({
        title: "Location error",
        description: "Couldn't detect your location. Please set it manually.",
        variant: "destructive"
      });
      setIsGettingLocation(false);
    }
  };

  const handleManualLocation = () => {
    toast({
      title: "Manual location",
      description: "Taking you to location picker",
    });
    // For now, just continue to home with default location
    const user = JSON.parse(localStorage.getItem("servicehub_user") || "{}");
    user.location = {
      latitude: 40.7128,
      longitude: -74.0060,
      city: "New York",
      country: "USA",
      manual: true
    };
    localStorage.setItem("servicehub_user", JSON.stringify(user));
    navigate("/home");
  };

  const handleSkip = () => {
    toast({
      title: "Location skipped",
      description: "You can set your location later in settings",
    });
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <MapPin className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Enable Location Access</h1>
          <p className="text-muted-foreground">
            Find the best service providers near you
          </p>
        </div>

        {/* Location options */}
        <div className="space-y-4">
          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-lg">
                <Navigation className="h-5 w-5 text-primary" />
                Auto-detect Location
              </CardTitle>
              <CardDescription>
                Allow GPS access to find services nearby automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleAllowLocation}
                disabled={isGettingLocation}
                variant="gradient"
              >
                {isGettingLocation ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    Allow Location Access
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Card className="hover:shadow-soft transition-shadow">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-lg">
                <Map className="h-5 w-5 text-secondary" />
                Set Manually
              </CardTitle>
              <CardDescription>
                Choose your location on the map
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="secondary" 
                className="w-full" 
                size="lg"
                onClick={handleManualLocation}
              >
                Set Location Manually
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Skip option */}
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="mr-2 h-4 w-4" />
            Skip for now
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full" />
          <div className="w-2 h-2 bg-primary rounded-full" />
          <div className="w-2 h-2 bg-primary rounded-full" />
          <div className="w-2 h-2 bg-muted rounded-full" />
        </div>

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center">
          Your location data is kept secure and only used to show relevant services
        </p>
      </div>
    </div>
  );
};

export default LocationPermission;