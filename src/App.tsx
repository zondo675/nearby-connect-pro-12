
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "./components/auth/AuthGuard";

// Pages
import Home from "./pages/Home";
import PostService from "./pages/PostService";
import Login from "./pages/Login";
import InstagramLogin from "./pages/InstagramLogin";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
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
import BottomNav from "./components/navigation/BottomNav";

const queryClient = new QueryClient();

const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <Routes>
          {/* Public routes */}
          <Route path="/splash" element={<Splash />} />
          <Route path="/login" element={
            <AuthGuard requireAuth={false}>
              <Login />
            </AuthGuard>
          } />
          <Route path="/instagram-login" element={<InstagramLogin />} />
          <Route path="/signup" element={
            <AuthGuard requireAuth={false}>
              <Signup />
            </AuthGuard>
          } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/language-selection" element={<LanguageSelection />} />
          <Route path="/location-permission" element={<LocationPermission />} />
          
          {/* Main routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:type" element={<CategoryListing />} />
          <Route path="/services/:category" element={<ServiceListing />} />
          <Route path="/service-details/:id" element={<ServiceDetails />} />
          <Route path="/profile" element={
            <AuthGuard>
              <Profile />
            </AuthGuard>
          } />
          <Route path="/profile/edit" element={
            <AuthGuard>
              <ProfileEdit />
            </AuthGuard>
          } />
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
        <BottomNav />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
