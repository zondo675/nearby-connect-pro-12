-- Fix Function Search Path security warnings

-- Update can_access_phone_number function with proper search_path
CREATE OR REPLACE FUNCTION public.can_access_phone_number(profile_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    has_access boolean := false;
BEGIN
    -- Only the profile owner can access their own phone number
    IF auth.uid() = profile_id THEN
        has_access := true;
    -- Or if there's an active booking relationship
    ELSIF EXISTS (
        SELECT 1 FROM public.bookings 
        WHERE (customer_id = auth.uid() AND provider_id = profile_id)
           OR (provider_id = auth.uid() AND customer_id = profile_id)
        AND status IN ('confirmed', 'pending')
    ) THEN
        has_access := true;
    -- Or if there's an accepted message request
    ELSIF EXISTS (
        SELECT 1 FROM public.message_requests
        WHERE (sender_id = auth.uid() AND receiver_id = profile_id)
           OR (receiver_id = auth.uid() AND sender_id = profile_id)
        AND status = 'accepted'
    ) THEN
        has_access := true;
    END IF;
    
    RETURN has_access;
END;
$$;

-- Update get_provider_contact function with proper search_path
CREATE OR REPLACE FUNCTION public.get_provider_contact(provider_id uuid)
RETURNS TABLE(full_name text, phone text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check access permission first
    IF NOT public.can_access_phone_number(provider_id) THEN
        RAISE EXCEPTION 'Access denied: You do not have permission to view this contact information';
    END IF;
    
    RETURN QUERY
    SELECT p.full_name, p.phone
    FROM public.profiles p
    WHERE p.id = provider_id
    AND p.is_provider = true;
END;
$$;