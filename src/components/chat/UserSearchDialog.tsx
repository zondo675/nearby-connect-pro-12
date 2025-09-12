import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserSearch } from '@/hooks/useUserSearch';
import { useDebounce } from '@/hooks/use-mobile';

interface UserSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserSearchDialog: React.FC<UserSearchDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { searchUsers, results, loading } = useUserSearch();
  
  // Debounce search to avoid too many API calls
  useDebounce(() => {
    if (searchQuery.trim()) {
      searchUsers(searchQuery);
    }
  }, [searchQuery], 500);

  const handleStartChat = (userId: string) => {
    navigate(`/direct-chat/${userId}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start a conversation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {loading ? (
              // Loading skeletons
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 rounded-lg border">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              ))
            ) : results.length === 0 && searchQuery ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>No users found</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>Start typing to search for users</p>
              </div>
            ) : (
              results.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar_url} alt={user.full_name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user.full_name || 'Unknown User'}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.is_online ? (
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                          Online
                        </span>
                      ) : (
                        'Offline'
                      )}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleStartChat(user.id)}
                    className="h-8 w-8"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};