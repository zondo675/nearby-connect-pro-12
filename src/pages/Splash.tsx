import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "@/assets/servicehub-logo.png";

const Splash = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const initializeApp = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate("/home");
    };

    initializeApp();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 text-center px-6">
        {/* Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl" />
          <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
            <img 
              src={logoImage} 
              alt="ServiceHub Logo" 
              className="w-24 h-24 mx-auto drop-shadow-lg"
            />
          </div>
        </div>

        {/* App Name */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            ServiceHub
          </h1>
          <p className="text-lg text-white/80 font-medium">
            Connect • Service • Excellence
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="text-white/60 text-sm">Initializing...</p>
        </div>
      </div>

      {/* Version info */}
      <div className="absolute bottom-8 text-white/50 text-xs">
        Version 1.0.0
      </div>
    </div>
  );
};

export default Splash;