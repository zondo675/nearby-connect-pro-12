import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  location: string;
  is_provider: boolean;
  rating: number;
  is_online: boolean;
  last_seen: string;
}

export const useUserSearch = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<UserProfile[]>([]);
  const { toast } = useToast();

  const searchUsers = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('search_user_profiles', {
        search_term: searchTerm.trim()
      });

      if (error) {
        throw error;
      }

      setResults(data || []);
    } catch (error: any) {
      console.error('Error searching users:', error);
      toast({
        title: "Search Failed",
        description: "Failed to search users. Please try again.",
        variant: "destructive",
      });
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getPublicProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase.rpc('get_public_profile', {
        user_id: userId
      });

      if (error) {
        throw error;
      }

      return data?.[0] || null;
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return {
    searchUsers,
    getPublicProfile,
    clearResults,
    results,
    loading
  };
};