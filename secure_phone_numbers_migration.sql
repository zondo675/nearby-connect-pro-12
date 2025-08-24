-- Critical Security Fix: Secure Phone Numbers in Profiles Table
-- This migration addresses the vulnerability where phone numbers 
-- are accessible to any authenticated user

-- Step 1: Drop overly permissive RLS policies
DROP POLICY IF EXISTS "Allow authenticated users to view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Step 2: Create strict RLS policies
-- Users can only view their own complete profile (including phone)
CREATE POLICY "Own profile full access" ON public.profiles
    FOR ALL USING (auth.uid() = id);

-- Step 3: Recreate secure public view without phone numbers
DROP VIEW IF EXISTS public.public_provider_profiles;

CREATE VIEW public.public_provider_profiles AS
SELECT 
    id,
    full_name,
    avatar_url,
    bio,
    location,
    rating,
    is_online,
    last_seen,
    created_at,
    updated_at,
    is_provider
FROM public.profiles
WHERE is_provider = true;

-- Enable security invoker on the view
ALTER VIEW public.public_provider_profiles SET (security_invoker = on);

-- Step 4: Create secure phone access function
CREATE OR REPLACE FUNCTION public.can_access_phone_number(profile_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Step 5: Secure contact retrieval function
CREATE OR REPLACE FUNCTION public.get_provider_contact(provider_id uuid)
RETURNS TABLE(full_name text, phone text)
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Step 6: Grant necessary permissions
GRANT SELECT ON public.public_provider_profiles TO authenticated;
GRANT SELECT ON public.public_provider_profiles TO anon;
GRANT EXECUTE ON FUNCTION public.can_access_phone_number(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_provider_contact(uuid) TO authenticated;