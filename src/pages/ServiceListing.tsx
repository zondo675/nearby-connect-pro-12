import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  MapPin,
  Plus,
  Users,
  SlidersHorizontal,
  Grid3X3,
  List
} from "lucide-react";
import { getCategoryById } from "@/data/serviceCategories";
import { useServices } from "@/hooks/useServices";
import ServiceCard from "@/components/services/ServiceCard";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const ServiceListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { category } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'rating'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const categoryData = category ? getCategoryById(category) : null;
  const categoryName = categoryData?.name;
  
  const { services, loading, error, refetch } = useServices({
    category: categoryName,
    location: locationFilter,
    sortBy
  });

  const handleContactService = async (serviceId: string, providerId: string) => {
    if (!user) {
      toast.error("Please sign in to contact service providers");
      navigate("/");
      return;
    }

    // Here you would typically create a chat or send a message request
    // For now, we'll navigate to the chat system
    toast.success("Redirecting to chat...");
    navigate(`/chat`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white sticky top-0 z-10 shadow-elevated">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div>
              <h1 className="text-lg font-bold">{categoryData?.name || 'Services'}</h1>
              <p className="text-sm opacity-90">Find professionals near you</p>
            </div>
          </div>
        </div>
      </header>

      <div className="pb-20">
        {/* Search and Filters */}
        <div className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={`Search in ${categoryData?.name || 'Services'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                placeholder="Location (city, state)"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={refetch}>
              Refresh
            </Button>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="px-4 pb-2">
            <p className="text-sm text-muted-foreground">
              {services.length} {services.length === 1 ? 'service' : 'services'} found
              {categoryData && ` in ${categoryData.name}`}
            </p>
          </div>
        )}

        {/* Service Listings */}
        <div className="p-4">
          {loading ? (
            // Loading State
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="h-48 bg-muted animate-pulse" />
                  <CardContent className="p-4 space-y-3">
                    <div className="flex space-x-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 flex-1" />
                      <Skeleton className="h-8 flex-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            // Error State
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-destructive mb-4">
                  <Users className="h-16 w-16 mx-auto mb-2" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Error loading services</h3>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={refetch}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : services.length === 0 ? (
            // Empty State
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No services available yet</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to offer services in {categoryData?.name || 'this category'}!
                </p>
                <Button onClick={() => navigate("/post-service")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your Service
                </Button>
              </CardContent>
            </Card>
          ) : (
            // Services Grid/List
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
              {services
                .filter(service => 
                  searchQuery === '' || 
                  service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (service.specialties && service.specialties.some(specialty => 
                    specialty.toLowerCase().includes(searchQuery.toLowerCase())
                  ))
                )
                .map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onContact={handleContactService}
                  />
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceListing;