import React, { useState } from 'react';
import { MessageCircle, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { UserSearchDialog } from '@/components/chat/UserSearchDialog';
import { AuthGuard } from '@/components/auth/AuthGuard';

const DirectChatList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserSearch, setShowUserSearch] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">Direct Messages</h1>
            <Button
              onClick={() => setShowUserSearch(true)}
              size="icon"
              variant="ghost"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="px-4 space-y-2">
          {/* Empty state for now - you can implement conversation history later */}
          <Card className="p-6 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">No conversations yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start a conversation by searching for users
            </p>
            <Button onClick={() => setShowUserSearch(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Start New Chat
            </Button>
          </Card>
        </div>

        {/* User Search Dialog */}
        <UserSearchDialog
          open={showUserSearch}
          onOpenChange={setShowUserSearch}
        />
      </div>
    </AuthGuard>
  );
};

export default DirectChatList;