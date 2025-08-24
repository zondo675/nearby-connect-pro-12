import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Star, MapPin, User } from "lucide-react";

const SavedProviders = () => {
  const navigate = useNavigate();

  // TODO: Replace with real saved providers data from Supabase
  const savedProviders: any[] = [];

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
        {savedProviders.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No saved providers yet</h3>
            <p className="text-muted-foreground">
              Save providers you like to easily find them later.
            </p>
          </div>
        ) : (
          savedProviders.map((provider) => (
            <Card key={provider.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
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
          ))
        )}
      </div>
    </div>
  );
};

export default SavedProviders;