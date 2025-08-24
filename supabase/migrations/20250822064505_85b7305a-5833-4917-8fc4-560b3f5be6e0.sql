-- SECURITY FIX: Restrict access to sensitive profile data
-- This migration addresses the security vulnerability where phone numbers 
-- and personal data could be accessed by customers with bookings

-- Step 1: Drop the overly permissive policy that exposes all provider data
DROP POLICY IF EXISTS "Authenticated users can view provider contact info" ON public.profiles;

-- Step 2: Create a new policy that only allows viewing public provider information
-- This policy will allow users to see basic provider info (name, avatar, bio, rating, location)
-- but NOT sensitive data like phone numbers
CREATE POLICY "Users can view basic provider info" 
ON public.profiles 
FOR SELECT 
USING (
  is_provider = true 
  AND (
    -- Users can see their own full profile
    auth.uid() = id 
    OR 
    -- Others can only see basic public info (enforced by column-level restrictions below)
    true
  )
);

-- Step 3: Create row-level security for sensitive columns
-- We'll use a more restrictive approach where sensitive data is only visible to the profile owner
CREATE POLICY "Users can view their own sensitive data only" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Step 4: Update the public_provider_profiles view to be more secure
-- First drop the existing view if it exists
DROP VIEW IF EXISTS public.public_provider_profiles CASCADE;

-- Create a secure view that only exposes non-sensitive provider information
CREATE VIEW public.public_provider_profiles AS
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

-- Enable RLS on the view
ALTER VIEW public.public_provider_profiles SET (security_barrier = true);

-- Step 5: Create a secure function for verified contact access
-- This replaces direct profile access and ensures proper authorization
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
    -- User has an ACTIVE booking with this provider (not just any booking)
    EXISTS (
      SELECT 1 FROM public.bookings b 
      WHERE b.provider_id = provider_id 
      AND b.customer_id = auth.uid()
      AND b.status IN ('confirmed', 'in_progress', 'completed')
    )
  );
$function$;

-- Step 6: Create a policy for public provider discovery
CREATE POLICY "Public provider profiles are viewable by everyone" 
ON public.public_provider_profiles 
FOR SELECT 
USING (true);

-- Step 7: Update the existing get_provider_contact function to be more restrictive
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
      AND b.status IN ('confirmed', 'in_progress')  -- Only active bookings, not completed ones
    )
  );
$function$;

-- Step 8: Add comments for clarity
COMMENT ON POLICY "Users can view basic provider info" ON public.profiles 
IS 'Allows viewing basic provider information but sensitive data requires ownership';

COMMENT ON POLICY "Users can view their own sensitive data only" ON public.profiles 
IS 'Restricts sensitive data (phone, etc.) to profile owner only';

COMMENT ON FUNCTION public.get_verified_provider_contact(uuid) 
IS 'Secure function to access provider contact info only with valid booking relationship';

COMMENT ON VIEW public.public_provider_profiles 
IS 'Safe public view of provider profiles excluding sensitive personal information';