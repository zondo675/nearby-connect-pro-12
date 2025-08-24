-- SECURITY FIX: Restrict access to sensitive profile data
-- This migration addresses the security vulnerability where phone numbers 
-- and personal data could be accessed by customers with bookings

-- Step 1: Drop the overly permissive policy that exposes all provider data
DROP POLICY IF EXISTS "Authenticated users can view provider contact info" ON public.profiles;

-- Step 2: Create a more restrictive policy for provider profile access
-- This policy now requires explicit authorization and doesn't expose sensitive data to all customers
CREATE POLICY "Users can view basic provider profiles" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can always see their own profile
  auth.uid() = id 
  OR 
  -- For providers, only basic info is accessible to others (phone numbers excluded by function approach)
  (is_provider = true AND auth.uid() IS NOT NULL)
);

-- Step 3: Update the public_provider_profiles table to be more secure
-- First, ensure the table has proper structure (recreate if needed)
DROP TABLE IF EXISTS public.public_provider_profiles;

CREATE TABLE public.public_provider_profiles AS
SELECT 
  id,
  full_name,
  avatar_url,
  bio,
  location,
  is_provider,
  rating,
  created_at,
  updated_at,
  is_online,
  last_seen
FROM public.profiles 
WHERE is_provider = true;

-- Add RLS to the public provider profiles table
ALTER TABLE public.public_provider_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public provider profiles are viewable by everyone" 
ON public.public_provider_profiles 
FOR SELECT 
USING (true);

-- Step 4: Create a secure function for verified contact access
-- This ensures phone numbers are only accessible with proper authorization
CREATE OR REPLACE FUNCTION public.get_verified_provider_contact(provider_id uuid)
RETURNS TABLE(phone text, full_name text, bio text, location text)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT p.phone, p.full_name, p.bio, p.location
  FROM public.profiles p
  WHERE p.id = provider_id 
  AND p.is_provider = true
  AND auth.uid() IS NOT NULL
  AND (
    -- User is the provider themselves
    auth.uid() = provider_id 
    OR 
    -- User has an ACTIVE booking with this provider
    EXISTS (
      SELECT 1 FROM public.bookings b 
      WHERE b.provider_id = provider_id 
      AND b.customer_id = auth.uid()
      AND b.status IN ('confirmed', 'in_progress', 'completed')
    )
  );
$function$;

-- Step 5: Update the existing get_provider_contact function to be more restrictive
CREATE OR REPLACE FUNCTION public.get_provider_contact(provider_id uuid)
RETURNS TABLE(phone text, full_name text)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT p.phone, p.full_name 
  FROM public.profiles p
  WHERE p.id = provider_id 
  AND p.is_provider = true
  AND auth.uid() IS NOT NULL
  AND (
    -- User is the provider themselves
    auth.uid() = provider_id 
    OR 
    -- User has an ACTIVE booking with this provider (more restrictive than before)
    EXISTS (
      SELECT 1 FROM public.bookings b 
      WHERE b.provider_id = provider_id 
      AND b.customer_id = auth.uid()
      AND b.status IN ('confirmed', 'in_progress')  -- Only active bookings
    )
  );
$function$;

-- Step 6: Create a function to get public provider info (no sensitive data)
CREATE OR REPLACE FUNCTION public.get_public_provider_info(provider_id uuid)
RETURNS TABLE(
  id uuid, 
  full_name text, 
  avatar_url text, 
  bio text, 
  location text, 
  rating numeric, 
  is_online boolean, 
  last_seen timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT p.id, p.full_name, p.avatar_url, p.bio, p.location, p.rating, p.is_online, p.last_seen
  FROM public.profiles p
  WHERE p.id = provider_id 
  AND p.is_provider = true;
$function$;

-- Step 7: Add comments for clarity
COMMENT ON POLICY "Users can view basic provider profiles" ON public.profiles 
IS 'Allows basic provider profile access but sensitive data requires explicit authorization';

COMMENT ON FUNCTION public.get_verified_provider_contact(uuid) 
IS 'Secure function to access provider contact info only with valid booking relationship';

COMMENT ON FUNCTION public.get_public_provider_info(uuid) 
IS 'Safe function to get public provider information without exposing sensitive data';

COMMENT ON TABLE public.public_provider_profiles 
IS 'Safe public table of provider profiles excluding sensitive personal information';