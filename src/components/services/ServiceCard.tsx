import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  MapPin, 
  DollarSign, 
  Clock, 
  MessageCircle,
  Heart,
  Share2,
  Verified
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    price: number;
    price_type?: string;
    location: string;
    specialties?: string[];
    images?: string[];
    availability: boolean;
    created_at: string;
    profiles?: {
      id: string;
      full_name: string;
      avatar_url?: string;
      is_verified?: boolean;
    } | null;
    service_categories?: {
      name: string;
      icon?: string;
    } | null;
    // Mock rating data - you can add this to your database later
    rating?: number;
    review_count?: number;
  };
  onContact?: (serviceId: string, providerId: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onContact }) => {
  const navigate = useNavigate();

  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onContact && service.profiles) {
      onContact(service.id, service.profiles.id);
    }
  };

  const handleCardClick = () => {
    navigate(`/service-details/${service.id}`);
  };

  const formatPrice = (price: number, priceType?: string) => {
    return `$${price}${priceType === 'hourly' ? '/hr' : ''}`;
  };

  // Mock rating data - replace with actual data from your database
  const rating = service.rating || 4.5;
  const reviewCount = service.review_count || Math.floor(Math.random() * 50) + 1;

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-card shadow-sm hover:shadow-elevated"
      onClick={handleCardClick}
    >
      {/* Service Image */}
      {service.images && service.images.length > 0 && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img 
            src={service.images[0]} 
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 flex space-x-2">
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          
          {service.availability && (
            <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600">
              Available
            </Badge>
          )}
        </div>
      )}

      <CardContent className="p-4">
        {/* Provider Info */}
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={service.profiles?.avatar_url} />
            <AvatarFallback>
              {service.profiles?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-1">
              <p className="font-medium text-sm">{service.profiles?.full_name || 'Anonymous'}</p>
              {service.profiles?.is_verified && (
                <Verified className="h-4 w-4 text-blue-500" />
              )}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{rating.toFixed(1)}</span>
                <span>({reviewCount})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Service Title & Category */}
        <div className="mb-2">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {service.title}
          </h3>
          <Badge variant="outline" className="text-xs mt-1">
            {service.service_categories?.name}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {service.description}
        </p>

        {/* Location & Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{service.location}</span>
          </div>
          <div className="flex items-center space-x-1 font-semibold text-primary">
            <DollarSign className="h-4 w-4" />
            <span>{formatPrice(service.price, service.price_type)}</span>
          </div>
        </div>

        {/* Specialties */}
        {service.specialties && service.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {service.specialties.slice(0, 3).map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {service.specialties.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{service.specialties.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2 border-t">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={handleContactClick}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/service-details/${service.id}`);
            }}
          >
            View Details
          </Button>
        </div>

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Posted {new Date(service.created_at).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;