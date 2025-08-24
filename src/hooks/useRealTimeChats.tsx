import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ChatParticipant {
  id: string;
  full_name: string;
  avatar_url?: string;
  is_online: boolean;
  last_seen: string;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  status: 'sent' | 'delivered' | 'seen';
  file_url?: string;
  created_at: string;
  sender?: ChatParticipant;
}

export interface Chat {
  id: string;
  created_at: string;
  updated_at: string;
  participants: ChatParticipant[];
  last_message?: ChatMessage;
  unread_count: number;
}

export interface MessageRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  sender?: ChatParticipant;
}

export const useRealTimeChats = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [messageRequests, setMessageRequests] = useState<MessageRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial chats
  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
      try {
        // Get user's chats with participants and last messages
        const { data: chatParticipants } = await supabase
          .from('chat_participants')
          .select(`
            chat_id,
            chats (
              id,
              created_at,
              updated_at
            )
          `)
          .eq('user_id', user.id);

        if (!chatParticipants) return;

        const chatData: Chat[] = [];

        for (const cp of chatParticipants) {
          if (!cp.chats) continue;

          // Get other participants
          const { data: otherParticipants } = await supabase
            .from('chat_participants')
            .select(`
              user_id,
              profiles (
                id,
                full_name,
                avatar_url,
                is_online,
                last_seen
              )
            `)
            .eq('chat_id', cp.chat_id)
            .neq('user_id', user.id);

          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select(`
              id,
              content,
              type,
              created_at,
              sender_id,
              profiles!messages_sender_id_fkey (
                full_name,
                avatar_url
              )
            `)
            .eq('chat_id', cp.chat_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get unread count
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('id', { count: 'exact' })
            .eq('chat_id', cp.chat_id)
            .neq('sender_id', user.id)
            .eq('status', 'sent');

          const participants = otherParticipants
            ?.map(p => p.profiles)
            .filter(Boolean) as ChatParticipant[] || [];

          chatData.push({
            id: cp.chats.id,
            created_at: cp.chats.created_at,
            updated_at: cp.chats.updated_at,
            participants,
            last_message: lastMessage ? {
              id: lastMessage.id,
              chat_id: cp.chat_id,
              sender_id: lastMessage.sender_id,
              content: lastMessage.content,
              type: lastMessage.type as any,
              status: 'sent' as any,
              created_at: lastMessage.created_at,
              sender: lastMessage.profiles ? {
                id: lastMessage.sender_id,
                full_name: lastMessage.profiles.full_name,
                avatar_url: lastMessage.profiles.avatar_url,
                is_online: false,
                last_seen: new Date().toISOString()
              } : undefined
            } : undefined,
            unread_count: unreadCount || 0
          });
        }

        setChats(chatData.sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        ));
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user]);

  // Fetch message requests
  useEffect(() => {
    if (!user) return;

    const fetchMessageRequests = async () => {
      try {
        const { data } = await supabase
          .from('message_requests')
          .select(`
            id,
            sender_id,
            receiver_id,
            message,
            status,
            created_at,
            profiles!message_requests_sender_id_fkey (
              id,
              full_name,
              avatar_url,
              is_online,
              last_seen
            )
          `)
          .eq('receiver_id', user.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        const requests = data?.map(req => ({
          id: req.id,
          sender_id: req.sender_id,
          receiver_id: req.receiver_id,
          message: req.message,
          status: req.status as any,
          created_at: req.created_at,
          sender: req.profiles ? {
            id: req.profiles.id,
            full_name: req.profiles.full_name,
            avatar_url: req.profiles.avatar_url,
            is_online: req.profiles.is_online,
            last_seen: req.profiles.last_seen
          } : undefined
        })) || [];

        setMessageRequests(requests);
      } catch (error) {
        console.error('Error fetching message requests:', error);
      }
    };

    fetchMessageRequests();
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('messages-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        console.log('New message:', payload);
        // Refresh chats when new message arrives
        // In production, you'd want to update the specific chat
      })
      .subscribe();

    // Subscribe to message requests
    const requestsChannel = supabase
      .channel('requests-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'message_requests',
        filter: `receiver_id=eq.${user.id}`
      }, (payload) => {
        console.log('New message request:', payload);
        // Add new request to state
      })
      .subscribe();

    // Subscribe to user presence updates
    const presenceChannel = supabase
      .channel('user-presence')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles'
      }, (payload) => {
        console.log('User presence updated:', payload);
        // Update user online status in chats
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(requestsChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, [user]);

  const createChatWithUser = async (otherUserId: string) => {
    if (!user) return null;

    try {
      const { data } = await supabase.rpc('create_chat_with_user', {
        other_user_id: otherUserId
      });

      return data;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  };

  const sendMessageRequest = async (receiverId: string, message: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('message_requests')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          message
        });

      return !error;
    } catch (error) {
      console.error('Error sending message request:', error);
      return false;
    }
  };

  const respondToMessageRequest = async (requestId: string, accept: boolean) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('message_requests')
        .update({ status: accept ? 'accepted' : 'declined' })
        .eq('id', requestId);

      if (!error && accept) {
        // If accepted, create the chat
        const request = messageRequests.find(r => r.id === requestId);
        if (request) {
          await createChatWithUser(request.sender_id);
        }
      }

      return !error;
    } catch (error) {
      console.error('Error responding to message request:', error);
      return false;
    }
  };

  return {
    chats,
    messageRequests,
    loading,
    createChatWithUser,
    sendMessageRequest,
    respondToMessageRequest
  };
};