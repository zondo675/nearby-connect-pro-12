import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Search, 
  TrendingUp,
  Users,
  Star,
  Clock,
  DollarSign
} from "lucide-react";
import { getCategoryById } from "@/data/serviceCategories";
import { useState } from "react";

const CategoryListing = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const category = getCategoryById(type || "");
  
  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <Button onClick={() => navigate("/categories")}>
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  const filteredSubcategories = category.subcategories.filter(sub =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubcategoryClick = (subcategoryId: string) => {
    navigate(`/services/${subcategoryId}`);
  };

  const IconComponent = category.icon;

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
          
          <div className="flex items-center space-x-3 flex-1">
            <div className={`w-10 h-10 rounded-full ${category.color} bg-white/20 flex items-center justify-center`}>
              <IconComponent className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">{category.name}</h1>
              <p className="text-sm opacity-90">{category.subcategories.length} services available</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={`Search in ${category.name.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/90 border-white/20 text-foreground"
            />
          </div>
        </div>
      </header>

      {/* Subcategories */}
      <div className="px-4 space-y-4 pb-20 pt-4">
        {filteredSubcategories.map((subcategory) => {
          const SubIconComponent = subcategory.icon;
          return (
            <Card
              key={subcategory.id}
              className="cursor-pointer hover:shadow-soft transition-all hover:scale-[1.02] bg-gradient-card border-none"
              onClick={() => handleSubcategoryClick(subcategory.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-14 h-14 rounded-full ${category.color} flex items-center justify-center flex-shrink-0`}>
                    <SubIconComponent className="h-7 w-7" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{subcategory.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{subcategory.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs font-medium">
                        {subcategory.averagePrice}
                      </Badge>
                    </div>
                    
                    {/* Service Stats */}
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>45+ nearby</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>4.9 rating</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Same day</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryListing;