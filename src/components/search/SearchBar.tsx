import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  MapPin, 
  X,
  Mic,
  Camera
} from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterClick: () => void;
  onLocationClick?: () => void;
  placeholder?: string;
  showVoiceSearch?: boolean;
  showImageSearch?: boolean;
  activeFiltersCount?: number;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

const SearchBar = ({
  value,
  onChange,
  onFilterClick,
  onLocationClick,
  placeholder = "Search for services...",
  showVoiceSearch = true,
  showImageSearch = true,
  activeFiltersCount = 0,
  suggestions = [],
  onSuggestionClick
}: SearchBarProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    onSuggestionClick?.(suggestion);
  };

  const clearSearch = () => {
    onChange("");
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      {/* Main Search Bar */}
      <div className="relative flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className="pl-10 pr-20 bg-white/90 border-white/20 text-foreground h-12"
          />
          
          {/* Right side controls */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {value && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="h-8 w-8 hover:bg-muted/20"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            {showVoiceSearch && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted/20"
                title="Voice Search"
              >
                <Mic className="h-4 w-4" />
              </Button>
            )}
            
            {showImageSearch && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted/20"
                title="Image Search"
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Location Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onLocationClick}
          className="text-white hover:bg-white/20 bg-white/10 h-12 w-12"
          title="Change Location"
        >
          <MapPin className="h-5 w-5" />
        </Button>

        {/* Filter Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onFilterClick}
          className="text-white hover:bg-white/20 bg-white/10 h-12 w-12 relative"
          title="Advanced Filters"
        >
          <Filter className="h-5 w-5" />
          {activeFiltersCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && isFocused && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;