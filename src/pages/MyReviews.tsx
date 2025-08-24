import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Star } from "lucide-react";

const MyReviews = () => {
  const navigate = useNavigate();

  // TODO: Replace with real reviews data from Supabase
  const reviews: any[] = [];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground"
        }`}
      />
    ));
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
          <h1 className="text-xl font-semibold">My Reviews</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground">
              Your reviews for service providers will appear here.
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{review.providerName}</h3>
                          <p className="text-sm text-muted-foreground">{review.service}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 mt-2">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm leading-relaxed">{review.comment}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MyReviews;