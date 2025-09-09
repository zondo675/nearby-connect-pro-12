import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

export const useDirectMessages = (receiverId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial messages
  useEffect(() => {
    if (!user || !receiverId) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('direct_messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
          .order('timestamp', { ascending: true });

        if (error) throw error;
        
        // Fetch sender profiles separately to avoid relation issues
        const messagesWithSenders = await Promise.all(
          (data || []).map(async (msg) => {
            const { data: senderData } = await supabase
              .from('profiles')
              .select('id, full_name, avatar_url')
              .eq('id', msg.sender_id)
              .single();
            
            return {
              ...msg,
              sender: senderData || undefined
            } as DirectMessage;
          })
        );
        
        setMessages(messagesWithSenders);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user, receiverId]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user || !receiverId) return;

    const channel = supabase
      .channel(`direct-messages-${user.id}-${receiverId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages',
        filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id}))`
      }, async (payload) => {
        console.log('New message received:', payload);
        
        // Fetch sender info for the new message
        const { data: senderData } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('id', payload.new.sender_id)
          .single();

        const newMessage: DirectMessage = {
          ...payload.new as DirectMessage,
          sender: senderData
        };

        setMessages(prev => [...prev, newMessage]);

        // Mark as read if it's a message to current user
        if (payload.new.receiver_id === user.id) {
          await markAsRead(payload.new.id);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, receiverId]);

  const sendMessage = async (content: string) => {
    if (!user || !receiverId || !content.trim()) return false;

    try {
      const { error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content: content.trim()
        });

      return !error;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('direct_messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .eq('receiver_id', user.id);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user || !receiverId) return;

    try {
      await supabase
        .from('direct_messages')
        .update({ is_read: true })
        .eq('receiver_id', user.id)
        .eq('sender_id', receiverId)
        .eq('is_read', false);
    } catch (error) {
      console.error('Error marking all messages as read:', error);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    markAsRead,
    markAllAsRead
  };
};