import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import BottomNav from "@/components/navigation/BottomNav";
import { 
  ArrowLeft,
  Search,
  TrendingUp,
  Users,
  Star,
  Filter,
  Grid3X3,
  List
} from "lucide-react";
import { serviceCategories } from "@/data/serviceCategories";
import { useState } from "react";

const Categories = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/categories/${categoryId}`);
  };

  const filteredCategories = serviceCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories.some(sub => 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-white sticky top-0 z-10 shadow-elevated">
        <div className="flex items-center p-4 space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1">
            <h1 className="text-xl font-bold">Browse Services</h1>
            <p className="text-sm opacity-90">{serviceCategories.length} categories • 500+ providers</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="text-white hover:bg-white/20"
            >
              {viewMode === "grid" ? <List className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/90 border-white/20 text-foreground"
            />
          </div>
        </div>
      </header>

      {/* Popular Services */}
      <div className="p-4">
        <Card className="bg-gradient-surface border border-primary/10 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span>Trending This Week</span>
              </div>
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                Hot 🔥
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["House Cleaning", "Plumbing", "Math Tutoring", "Photography", "Dog Walking", "Web Design"].map((service) => (
                <Badge 
                  key={service}
                  variant="secondary" 
                  className="cursor-pointer hover:bg-secondary/80 hover:scale-105 transition-all duration-200 px-3 py-1"
                >
                  {service}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Categories */}
      <div className="px-4 space-y-4 pb-24">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={category.id}
                  className={`cursor-pointer hover:shadow-elevated transition-all hover:scale-[1.02] ${category.gradient} border-none group`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{category.name}</h3>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{category.description}</p>
                          </div>
                          <Badge variant="outline" className="text-xs bg-white/80">
                            {category.subcategories.length} services
                          </Badge>
                        </div>
                        
                        {/* Preview of subcategories */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {category.subcategories.slice(0, 3).map((sub, index) => (
                            <Badge key={index} variant="secondary" className="text-xs hover:bg-secondary/80 transition-colors">
                              {sub.name}
                            </Badge>
                          ))}
                          {category.subcategories.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{category.subcategories.length - 3} more
                            </Badge>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>120+ providers</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span>4.8 rating</span>
                            </div>
                          </div>
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                            Browse →
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={category.id}
                  className={`cursor-pointer hover:shadow-soft transition-all hover:scale-[1.02] ${category.gradient} border-none`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center mx-auto mb-3`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{category.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {category.subcategories.length} services
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* No results */}
      {filteredCategories.length === 0 && searchTerm && (
        <div className="text-center py-12 px-4">
          <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground mb-4">No categories found for "{searchTerm}"</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setSearchTerm("")}
          >
            Clear Search
          </Button>
        </div>
      )}

      {/* Add bottom navigation */}
      <BottomNav />
    </div>
  );
};

export default Categories;