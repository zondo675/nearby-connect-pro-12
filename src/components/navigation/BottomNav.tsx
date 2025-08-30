import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home,
  Search, 
  MessageCircle, 
  Plus,
  User
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    path: "/home"
  },
  {
    id: "search",
    label: "Search",
    icon: Search,
    path: "/categories"
  },
  {
    id: "post",
    label: "Post",
    icon: Plus,
    path: "/post-service"
  },
  {
    id: "chat",
    label: "Chat",
    icon: MessageCircle,
    path: "/chat",
    badge: 3 // Mock unread messages count
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    path: "/profile"
  }
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/home") {
      return location.pathname === "/" || location.pathname === "/home";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t shadow-elevated z-50">
      <div className="flex items-center justify-around py-2 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.path);
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 h-14 px-3 relative transition-all duration-200 ${
                active 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <div className="relative">
                <IconComponent className={`h-6 w-6 transition-transform duration-200 ${active ? "scale-110" : ""}`} />
                {item.badge && item.badge > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {item.badge > 9 ? "9+" : item.badge}
                  </Badge>
                )}
                {active && (
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </div>
              <span className={`text-xs font-medium transition-all duration-200 ${
                active ? "text-primary" : ""
              }`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;