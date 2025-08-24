import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { ChatMessage, ChatParticipant } from './useRealTimeChats';

export const useRealTimeMessages = (chatId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [otherParticipant, setOtherParticipant] = useState<ChatParticipant | null>(null);

  // Fetch initial messages and participants
  useEffect(() => {
    if (!chatId || !user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Get other participant
        const { data: participants } = await supabase
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
          .eq('chat_id', chatId)
          .neq('user_id', user.id);

        if (participants && participants[0]?.profiles) {
          setOtherParticipant({
            id: participants[0].profiles.id,
            full_name: participants[0].profiles.full_name,
            avatar_url: participants[0].profiles.avatar_url,
            is_online: participants[0].profiles.is_online,
            last_seen: participants[0].profiles.last_seen
          });
        }

        // Get messages
        const { data: messagesData } = await supabase
          .from('messages')
          .select(`
            id,
            chat_id,
            sender_id,
            content,
            type,
            status,
            file_url,
            created_at,
            profiles!messages_sender_id_fkey (
              id,
              full_name,
              avatar_url,
              is_online,
              last_seen
            )
          `)
          .eq('chat_id', chatId)
          .order('created_at', { ascending: true });

        const formattedMessages: ChatMessage[] = messagesData?.map(msg => ({
          id: msg.id,
          chat_id: msg.chat_id,
          sender_id: msg.sender_id,
          content: msg.content,
          type: msg.type as any,
          status: msg.status as any,
          file_url: msg.file_url,
          created_at: msg.created_at,
          sender: msg.profiles ? {
            id: msg.profiles.id,
            full_name: msg.profiles.full_name,
            avatar_url: msg.profiles.avatar_url,
            is_online: msg.profiles.is_online,
            last_seen: msg.profiles.last_seen
          } : undefined
        })) || [];

        setMessages(formattedMessages);

        // Mark messages as delivered
        await supabase
          .from('messages')
          .update({ status: 'delivered' })
          .eq('chat_id', chatId)
          .neq('sender_id', user.id)
          .eq('status', 'sent');

      } catch (error) {
        console.error('Error fetching chat data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [chatId, user]);

  // Set up real-time subscription for messages
  useEffect(() => {
    if (!chatId || !user) return;

    const channel = supabase
      .channel(`messages-${chatId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`
      }, async (payload) => {
        console.log('New message received:', payload);
        
        // Fetch sender info
        const { data: senderData } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, is_online, last_seen')
          .eq('id', payload.new.sender_id)
          .single();

        const newMessage: ChatMessage = {
          id: payload.new.id,
          chat_id: payload.new.chat_id,
          sender_id: payload.new.sender_id,
          content: payload.new.content,
          type: payload.new.type,
          status: payload.new.status,
          file_url: payload.new.file_url,
          created_at: payload.new.created_at,
          sender: senderData ? {
            id: senderData.id,
            full_name: senderData.full_name,
            avatar_url: senderData.avatar_url,
            is_online: senderData.is_online,
            last_seen: senderData.last_seen
          } : undefined
        };

        setMessages(prev => [...prev, newMessage]);

        // Mark as delivered if not sent by current user
        if (payload.new.sender_id !== user.id) {
          await supabase
            .from('messages')
            .update({ status: 'delivered' })
            .eq('id', payload.new.id);
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`
      }, (payload) => {
        console.log('Message updated:', payload);
        setMessages(prev => prev.map(msg => 
          msg.id === payload.new.id ? { ...msg, status: payload.new.status } : msg
        ));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, user]);

  const sendMessage = async (content: string, type: 'text' | 'image' | 'video' | 'audio' | 'file' = 'text', fileUrl?: string) => {
    if (!chatId || !user || !content.trim()) return false;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          content: content.trim(),
          type,
          file_url: fileUrl
        });

      if (!error) {
        // Update chat's updated_at timestamp
        await supabase
          .from('chats')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', chatId);
      }

      return !error;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  const markMessagesAsSeen = async () => {
    if (!chatId || !user) return;

    try {
      await supabase
        .from('messages')
        .update({ status: 'seen' })
        .eq('chat_id', chatId)
        .neq('sender_id', user.id)
        .in('status', ['sent', 'delivered']);
    } catch (error) {
      console.error('Error marking messages as seen:', error);
    }
  };

  return {
    messages,
    otherParticipant,
    loading,
    sendMessage,
    markMessagesAsSeen
  };
};