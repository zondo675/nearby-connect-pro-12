import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserService {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  availability: boolean;
  images: string[];
  created_at: string;
  category: {
    name: string;
    icon: string;
    color: string;
  };
}

export const useUserServices = (userId: string | undefined) => {
  const [services, setServices] = useState<UserService[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const fetchUserServices = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('services')
          .select(`
            id,
            title,
            description,
            price,
            location,
            availability,
            images,
            created_at,
            service_categories (
              name,
              icon,
              color
            )
          `)
          .eq('user_id', userId)
          .eq('availability', true)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        const formattedServices = data?.map(service => ({
          ...service,
          category: service.service_categories
        })) || [];

        setServices(formattedServices);
      } catch (error: any) {
        console.error('Error fetching user services:', error);
        toast({
          title: "Error",
          description: "Failed to load user services. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserServices();
  }, [userId, toast]);

  return { services, loading };
};