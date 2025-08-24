import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft,
  Search,
  TrendingUp,
  Users,
  Star
} from "lucide-react";
import { serviceCategories } from "@/data/serviceCategories";
import { useState } from "react";

const Categories = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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
      <header className="bg-gradient-primary text-white sticky top-0 z-10 shadow-elevated">
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
            <h1 className="text-lg font-bold">Service Categories</h1>
            <p className="text-sm opacity-90">{serviceCategories.length} categories available</p>
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
        <Card className="bg-gradient-card border-none mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Most Popular This Week</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                House Cleaning
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                Plumbing
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                Tutoring
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                Photography
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Categories */}
      <div className="px-4 space-y-4 pb-20">
        {filteredCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card
              key={category.id}
              className={`cursor-pointer hover:shadow-soft transition-all hover:scale-[1.02] ${category.gradient} border-none`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {category.subcategories.length} services
                      </Badge>
                    </div>
                    
                    {/* Preview of subcategories */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {category.subcategories.slice(0, 3).map((sub, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
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
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>120+ providers</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>4.8 avg rating</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No results */}
      {filteredCategories.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No categories found for "{searchTerm}"</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setSearchTerm("")}
          >
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
};

export default Categories;