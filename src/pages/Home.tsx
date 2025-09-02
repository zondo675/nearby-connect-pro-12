
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchBar from "@/components/search/SearchBar";
import BottomNav from "@/components/navigation/BottomNav";
import { 
  Bell, 
  Search,
  MessageCircle,
  Plus,
  User,
  TrendingUp,
  Clock,
  Award,
  Sparkles,
  MapPin
} from "lucide-react";
import { serviceCategories } from "@/data/serviceCategories";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const handleCategoryClick = () => {
    navigate(`/categories`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-white p-4 shadow-elevated">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Good morning! 👋</h1>
              <div className="flex items-center space-x-1 text-sm opacity-90">
                <MapPin className="h-4 w-4" />
                <span>New York, NY</span>
              </div>
            </div>
          </div>
          {user ? (
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <div className="flex space-x-2">
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Enhanced Search Bar */}
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onFilterClick={() => navigate("/categories")}
          placeholder="Search for services..."
          suggestions={[
            "Emergency plumbing",
            "House cleaning",
            "Math tutoring",
            "Photography services",
            "Personal training",
            "Computer repair"
          ]}
          onSuggestionClick={(suggestion) => {
            setSearchTerm(suggestion);
            navigate("/categories");
          }}
        />
      </header>

      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        <section>
          <div className="grid grid-cols-2 gap-3">
            <Card className="cursor-pointer hover:shadow-soft transition-all hover:scale-[1.02] bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="font-medium text-sm">Trending Services</p>
              </CardContent>
            </Card>
            <Card 
              className="cursor-pointer hover:shadow-soft transition-all hover:scale-[1.02] bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20"
              onClick={() => navigate("/post-service")}
            >
              <CardContent className="p-4 text-center">
                <Plus className="h-6 w-6 text-secondary mx-auto mb-2" />
                <p className="font-medium text-sm">Post Your Service</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Service Categories Preview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Browse Categories</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/categories")}>
              View all
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {serviceCategories.slice(0, 4).map((category) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={category.id}
                  className={`cursor-pointer hover:shadow-soft transition-all hover:scale-[1.02] ${category.gradient} border-none`}
                  onClick={() => navigate(`/categories/${category.id}`)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mx-auto mb-3`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-sm">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {category.subcategories.length} services
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Platform Stats */}
        <section>
          <Card className="bg-gradient-card border-none">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-primary" />
                <span>Join Our Community</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Connect with skilled professionals and grow your business
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">2.5K+</div>
                    <div className="text-xs text-muted-foreground">Providers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">50K+</div>
                    <div className="text-xs text-muted-foreground">Services</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">4.9</div>
                    <div className="text-xs text-muted-foreground">Avg Rating</div>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate("/post-service")} 
                  className="w-full mt-4"
                >
                  Start Offering Your Services
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Get Started Section */}
        <section>
          <Card className="bg-gradient-surface border border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span>New to ServiceHub?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Find Services</p>
                    <p className="text-xs text-muted-foreground">Browse categories and find what you need</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Plus className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Offer Services</p>
                    <p className="text-xs text-muted-foreground">Share your skills and get hired</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Connect</p>
                    <p className="text-xs text-muted-foreground">Chat with providers and customers</p>
                  </div>
                </div>
              </div>
              
              <Button className="w-full mt-4 bg-gradient-accent hover:shadow-glow transition-all duration-300">
                <Sparkles className="mr-2 h-4 w-4" />
                Get Started Now
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Add bottom navigation */}
      <BottomNav />
    </div>
  );
};

export default Home;
