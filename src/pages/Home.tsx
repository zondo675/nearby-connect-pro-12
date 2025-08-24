
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchBar from "@/components/search/SearchBar";
import { 
  Bell, 
  Search,
  MessageCircle,
  Plus,
  User,
  TrendingUp,
  Clock,
  Award
} from "lucide-react";
import { serviceCategories } from "@/data/serviceCategories";

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleCategoryClick = () => {
    navigate(`/categories`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white p-4 shadow-elevated">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold">Good morning! 👋</h1>
            <p className="text-sm opacity-90">Find services near you</p>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Bell className="h-5 w-5" />
          </Button>
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
          <Card>
            <CardHeader>
              <CardTitle>New to the Platform?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Find Services</p>
                  <p className="text-xs text-muted-foreground">Browse categories and find what you need</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Plus className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Offer Services</p>
                  <p className="text-xs text-muted-foreground">Share your skills and get hired</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">Connect</p>
                  <p className="text-xs text-muted-foreground">Chat with providers and customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-elevated">
        <div className="flex items-center justify-around py-2">
          <Button variant="ghost" className="flex flex-col items-center space-y-1 text-primary">
            <Search className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="flex flex-col items-center space-y-1"
            onClick={() => navigate("/chat")}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs">Chat</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="flex flex-col items-center space-y-1"
            onClick={() => navigate("/post-service")}
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs">Post</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="flex flex-col items-center space-y-1"
            onClick={() => navigate("/profile")}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Home;
