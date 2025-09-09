import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { DirectChatInterface } from '@/components/chat/DirectChatInterface';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Skeleton } from '@/components/ui/skeleton';

const DirectChat: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [receiverInfo, setReceiverInfo] = useState<{
    id: string;
    full_name: string;
    avatar_url: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchReceiverInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setReceiverInfo(data);
      } catch (error) {
        console.error('Error fetching receiver info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceiverInfo();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
              <Skeleton className="h-12 w-48 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!receiverInfo) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">User not found</h2>
          <p className="text-muted-foreground">The user you're trying to chat with doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <DirectChatInterface
        receiverId={receiverInfo.id}
        receiverName={receiverInfo.full_name || 'User'}
        receiverAvatar={receiverInfo.avatar_url}
      />
    </AuthGuard>
  );
};

export default DirectChat;