import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  price_type?: string;
  location: string;
  specialties?: string[];
  images?: string[];
  availability: boolean;
  created_at: string;
  user_id: string;
  category_id: string;
  experience?: string;
  location_lat?: number;
  location_lng?: number;
  updated_at: string;
  profiles?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    is_verified?: boolean;
    bio?: string;
    phone_number?: string;
  } | null;
  service_categories?: {
    name: string;
    icon?: string;
  } | null;
}

interface UseServicesProps {
  category?: string;
  location?: string;
  priceRange?: [number, number];
  sortBy?: 'newest' | 'price_low' | 'price_high' | 'rating';
  limit?: number;
}

export const useServices = ({
  category,
  location,
  priceRange,
  sortBy = 'newest',
  limit = 20
}: UseServicesProps = {}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('services')
        .select(`
          *,
          profiles!inner (
            id,
            full_name,
            avatar_url,
            is_verified
          ),
          service_categories!inner (
            name,
            icon
          )
        `)
        .eq('availability', true);

      // Apply filters
      if (category) {
        // First, get the category ID
        const { data: categoryData } = await supabase
          .from('service_categories')
          .select('id')
          .eq('name', category)
          .single();
        
        if (categoryData) {
          query = query.eq('category_id', categoryData.id);
        }
      }

      if (location) {
        query = query.ilike('location', `%${location}%`);
      }

      if (priceRange) {
        query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);
      }

      // Apply sorting
      switch (sortBy) {
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      query = query.limit(limit);

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Transform the data to match our Service interface
      const transformedData = (data || []).map((item: any) => ({
        ...item,
        profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles,
        service_categories: Array.isArray(item.service_categories) ? item.service_categories[0] : item.service_categories
      })) as Service[];

      setServices(transformedData);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services');
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [category, location, priceRange, sortBy, limit]);

  const refetch = () => {
    fetchServices();
  };

  return {
    services,
    loading,
    error,
    refetch
  };
};

// Hook for getting a single service by ID
export const useService = (serviceId: string) => {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return;

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('services')
          .select(`
            *,
            profiles!inner (
              id,
              full_name,
              avatar_url,
              is_verified,
              bio,
              phone_number
            ),
            service_categories!inner (
              name,
              icon
            )
          `)
          .eq('id', serviceId)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        // Transform the data to match our Service interface
        const transformedData = {
          ...data,
          profiles: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles,
          service_categories: Array.isArray(data.service_categories) ? data.service_categories[0] : data.service_categories
        } as Service;

        setService(transformedData);
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Failed to load service');
        toast.error('Failed to load service details');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  return {
    service,
    loading,
    error
  };
};