import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Star, MapPin } from "lucide-react";

const SavedProviders = () => {
  const navigate = useNavigate();

  // Mock saved providers data
  const savedProviders = [
    {
      id: 1,
      name: "John Smith",
      service: "Plumbing",
      rating: 4.9,
      reviews: 150,
      price: "$80/hr",
      location: "Downtown",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      verified: true
    },
    {
      id: 2,
      name: "Maria Garcia",
      service: "House Cleaning",
      rating: 4.8,
      reviews: 89,
      price: "$60/hr",
      location: "Uptown",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b820?w=150&h=150&fit=crop&crop=face",
      verified: true
    },
    {
      id: 3,
      name: "David Lee",
      service: "Electrical Work",
      rating: 4.7,
      reviews: 203,
      price: "$90/hr",
      location: "Midtown",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      verified: false
    }
  ];

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
          <h1 className="text-xl font-semibold">Saved Providers</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {savedProviders.map((provider) => (
          <Card key={provider.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{provider.name}</h3>
                        {provider.verified && (
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{provider.service}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-secondary">
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{provider.rating}</span>
                      <span className="text-muted-foreground">({provider.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{provider.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary">{provider.price}</span>
                    <Button size="sm" onClick={() => navigate(`/service-details/${provider.id}`)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavedProviders;