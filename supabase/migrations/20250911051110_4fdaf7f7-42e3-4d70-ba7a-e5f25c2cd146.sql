-- Fix Security Definer View issue
-- Change public_provider_profiles view to use SECURITY INVOKER instead of default SECURITY DEFINER

-- Drop and recreate the view with SECURITY INVOKER
DROP VIEW IF EXISTS public.public_provider_profiles;

CREATE VIEW public.public_provider_profiles
WITH (security_invoker = true)
AS
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

-- Grant appropriate permissions
GRANT SELECT ON public.public_provider_profiles TO authenticated;
GRANT SELECT ON public.public_provider_profiles TO anon;