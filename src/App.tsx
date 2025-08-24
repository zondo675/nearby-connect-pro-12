
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

// Pages
import Home from "./pages/Home";
import PostService from "./pages/PostService";

import Splash from "./pages/Splash";
import LanguageSelection from "./pages/LanguageSelection";
import LocationPermission from "./pages/LocationPermission";
import Categories from "./pages/Categories";
import CategoryListing from "./pages/CategoryListing";
import ServiceListing from "./pages/ServiceListing";
import ServiceDetails from "./pages/ServiceDetails";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import MyChats from "./pages/MyChats";
import MyReviews from "./pages/MyReviews";
import SavedProviders from "./pages/SavedProviders";
import PaymentMethods from "./pages/PaymentMethods";
import NotificationSettings from "./pages/NotificationSettings";
import PrivacySettings from "./pages/PrivacySettings";
import AppSettings from "./pages/AppSettings";
import HelpCenter from "./pages/HelpCenter";
import NotFound from "./pages/NotFound";
import ChatList from "./components/chat/ChatList";
import ChatInterface from "./components/chat/ChatInterface";
import MessageRequests from "./components/chat/MessageRequests";

const queryClient = new QueryClient();

const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <Routes>
          {/* Public routes */}
          <Route path="/splash" element={<Splash />} />
          <Route path="/language-selection" element={<LanguageSelection />} />
          <Route path="/location-permission" element={<LocationPermission />} />
          
          {/* Main routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:type" element={<CategoryListing />} />
          <Route path="/services/:category" element={<ServiceListing />} />
          <Route path="/service-details/:id" element={<ServiceDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/post-service" element={<PostService />} />
          
          {/* Chat routes */}
          <Route path="/chat" element={<ChatList />} />
          <Route path="/chat/:id" element={<ChatInterface />} />
          <Route path="/message-requests" element={<MessageRequests />} />
          <Route path="/profile/chats" element={<MyChats />} />
          
          {/* Profile settings routes */}
          <Route path="/profile/reviews" element={<MyReviews />} />
          <Route path="/profile/saved-providers" element={<SavedProviders />} />
          <Route path="/profile/payment-methods" element={<PaymentMethods />} />
          <Route path="/profile/notifications" element={<NotificationSettings />} />
          <Route path="/profile/privacy" element={<PrivacySettings />} />
          <Route path="/profile/app-settings" element={<AppSettings />} />
          <Route path="/profile/help" element={<HelpCenter />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
