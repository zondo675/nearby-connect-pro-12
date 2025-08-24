import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Filter, 
  X, 
  DollarSign, 
  Star, 
  MapPin, 
  Clock,
  Shield,
  Award
} from "lucide-react";

export interface FilterOptions {
  priceRange: [number, number];
  rating: number;
  distance: number;
  availability: string;
  verified: boolean;
  sortBy: string;
  serviceTypes: string[];
}

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onApply: () => void;
  onClear: () => void;
}

const availabilityOptions = [
  { id: "now", label: "Available Now", icon: Clock },
  { id: "today", label: "Available Today", icon: Clock },
  { id: "tomorrow", label: "Available Tomorrow", icon: Clock },
  { id: "week", label: "This Week", icon: Clock },
  { id: "anytime", label: "Anytime", icon: Clock }
];

const sortOptions = [
  { value: "relevance", label: "Most Relevant" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "distance", label: "Nearest First" },
  { value: "reviews", label: "Most Reviews" }
];

const serviceTypeOptions = [
  "Emergency Service",
  "Same Day Service",
  "Remote Service",
  "In-Person Service",
  "Consultation",
  "Installation",
  "Repair",
  "Maintenance"
];

const AdvancedFilters = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApply,
  onClear
}: AdvancedFiltersProps) => {
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);

  const updateFilters = (updates: Partial<FilterOptions>) => {
    setTempFilters(prev => ({ ...prev, ...updates }));
  };

  const handleApply = () => {
    onFiltersChange(tempFilters);
    onApply();
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: FilterOptions = {
      priceRange: [0, 200],
      rating: 0,
      distance: 25,
      availability: "anytime",
      verified: false,
      sortBy: "relevance",
      serviceTypes: []
    };
    setTempFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClear();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Advanced Filters</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Price Range */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <Label className="font-medium">Price Range (per hour)</Label>
            </div>
            <div className="px-2">
              <Slider
                value={tempFilters.priceRange}
                onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                max={200}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>${tempFilters.priceRange[0]}</span>
                <span>${tempFilters.priceRange[1]}+</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <Label className="font-medium">Minimum Rating</Label>
            </div>
            <RadioGroup
              value={tempFilters.rating.toString()}
              onValueChange={(value) => updateFilters({ rating: parseFloat(value) })}
            >
              {[4.5, 4.0, 3.5, 3.0, 0].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                  <Label htmlFor={`rating-${rating}`} className="flex items-center space-x-1">
                    {rating > 0 ? (
                      <>
                        <span>{rating}+</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(rating) 
                                  ? "fill-yellow-400 text-yellow-400" 
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <span>Any Rating</span>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Distance */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Label className="font-medium">Maximum Distance</Label>
            </div>
            <div className="px-2">
              <Slider
                value={[tempFilters.distance]}
                onValueChange={(value) => updateFilters({ distance: value[0] })}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>1 mi</span>
                <span>{tempFilters.distance} mi</span>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Label className="font-medium">Availability</Label>
            </div>
            <RadioGroup
              value={tempFilters.availability}
              onValueChange={(value) => updateFilters({ availability: value })}
            >
              {availabilityOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={`availability-${option.id}`} />
                  <Label htmlFor={`availability-${option.id}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Verified Providers */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="verified"
              checked={tempFilters.verified}
              onCheckedChange={(checked) => updateFilters({ verified: !!checked })}
            />
            <Label htmlFor="verified" className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-secondary" />
              <span>Verified Providers Only</span>
            </Label>
          </div>

          {/* Service Types */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <Label className="font-medium">Service Types</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {serviceTypeOptions.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`service-${type}`}
                    checked={tempFilters.serviceTypes.includes(type)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilters({
                          serviceTypes: [...tempFilters.serviceTypes, type]
                        });
                      } else {
                        updateFilters({
                          serviceTypes: tempFilters.serviceTypes.filter(t => t !== type)
                        });
                      }
                    }}
                  />
                  <Label htmlFor={`service-${type}`} className="text-sm">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-3">
            <Label className="font-medium">Sort By</Label>
            <Select
              value={tempFilters.sortBy}
              onValueChange={(value) => updateFilters({ sortBy: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Summary */}
          {(tempFilters.rating > 0 || 
            tempFilters.verified || 
            tempFilters.serviceTypes.length > 0 ||
            tempFilters.availability !== "anytime") && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Active Filters:</Label>
              <div className="flex flex-wrap gap-1">
                {tempFilters.rating > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {tempFilters.rating}+ stars
                  </Badge>
                )}
                {tempFilters.verified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified only
                  </Badge>
                )}
                {tempFilters.availability !== "anytime" && (
                  <Badge variant="secondary" className="text-xs">
                    {availabilityOptions.find(a => a.id === tempFilters.availability)?.label}
                  </Badge>
                )}
                {tempFilters.serviceTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button onClick={handleClear} variant="outline" className="flex-1">
              Clear All
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedFilters;