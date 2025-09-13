import { useState } from "react";
import { ArrowLeft, Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserSearchResults } from "@/components/search/UserSearchResults";
import { useUserSearch, UserProfile } from "@/hooks/useUserSearch";
import { useDebounce } from "@/hooks/use-mobile";

export default function UserSearch() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { searchUsers, results, loading } = useUserSearch();
  
  // Debounce search to avoid too many API calls
  useDebounce(() => {
    if (searchTerm.trim()) {
      searchUsers(searchTerm);
    }
  }, [searchTerm], 500);

  const handleUserSelect = (user: UserProfile) => {
    // Navigate to user's profile page
    navigate(`/profile/${user.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Find Users</h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Search Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Search Users</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {searchTerm.trim() && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">
                {loading ? "Searching..." : `Search Results`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <UserSearchResults 
                  results={results} 
                  onUserSelect={handleUserSelect}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {!searchTerm.trim() && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Users className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="font-medium">Discover Users</h3>
                <p className="text-sm text-muted-foreground">
                  Search for other users by their name to connect and start conversations.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}