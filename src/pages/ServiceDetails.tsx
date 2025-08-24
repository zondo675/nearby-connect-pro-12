import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Verified,
  MessageCircle,
  Heart,
  Share,
  Calendar
} from "lucide-react";

const providerDetails = {
  1: {
    name: "Mike Johnson",
    service: "Professional Plumber",
    rating: 4.9,
    reviews: 127,
    price: "$45/hr",
    distance: "0.8 mi",
    bio: "Experienced plumber with 10+ years in residential and commercial plumbing. Specialized in emergency repairs and bathroom renovations.",
    verified: true,
    specialties: ["Emergency repairs", "Pipe installation", "Bathroom renovation", "Leak detection"],
    availability: ["Today 2:00 PM - 6:00 PM", "Tomorrow 9:00 AM - 5:00 PM", "Friday 10:00 AM - 4:00 PM"],
    images: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1558618047-b93c1794c2d9?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop"
    ],
    profile: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    recentReviews: [
      {
        name: "Sarah M.",
        rating: 5,
        comment: "Mike fixed our kitchen sink perfectly. Very professional and clean work!",
        date: "2 days ago"
      },
      {
        name: "John D.",
        rating: 5,
        comment: "Emergency call on Sunday - he came quickly and solved the problem efficiently.",
        date: "1 week ago"
      }
    ]
  }
};

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const provider = providerDetails[Number(id) as keyof typeof providerDetails];
  
  if (!provider) {
    return <div>Provider not found</div>;
  }

  const handleChatNow = () => {
    navigate(`/chat/${id}`);
  };

  const handleHireNow = () => {
    navigate(`/booking/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="pb-24">
        {/* Image Gallery */}
        <div className="h-64 bg-muted relative overflow-hidden">
          <img
            src={provider.images[0]}
            alt="Service showcase"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 right-4">
            <Badge className="bg-black/50 text-white">
              1 / {provider.images.length}
            </Badge>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Provider Info */}
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <img
                  src={provider.profile}
                  alt={provider.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-soft"
                />
                {provider.verified && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-secondary rounded-full flex items-center justify-center border-2 border-white">
                    <Verified className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{provider.name}</h1>
                <p className="text-lg text-muted-foreground">{provider.service}</p>
                
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{provider.rating}</span>
                    <span className="text-muted-foreground">({provider.reviews} reviews)</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{provider.distance}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{provider.price}</div>
                <div className="text-sm text-muted-foreground">per hour</div>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">{provider.bio}</p>
          </div>

          {/* Specialties */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Specialties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {provider.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {provider.availability.map((slot, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{slot}</span>
                  </div>
                  <Button size="sm" variant="outline">
                    Book
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {provider.recentReviews.map((review, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{review.name}</span>
                      <div className="flex">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                  {index < provider.recentReviews.length - 1 && <Separator />}
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                View All Reviews
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-elevated p-4">
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={handleChatNow}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Chat Now
          </Button>
          <Button 
            variant="gradient" 
            className="flex-1" 
            onClick={handleHireNow}
          >
            Hire Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;