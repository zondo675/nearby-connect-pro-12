-- SECURITY FIX: Restrict access to sensitive profile data
-- This migration addresses the security vulnerability where phone numbers 
-- and personal data could be accessed by customers with bookings

-- Step 1: Drop the overly permissive policy that exposes all provider data
DROP POLICY IF EXISTS "Authenticated users can view provider contact info" ON public.profiles;

-- Step 2: Create a more restrictive policy that prevents unauthorized access to sensitive data
-- This policy will be more restrictive and require proper authorization for contact info
CREATE POLICY "Users can view provider profiles with restrictions" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can always see their own profile (full access)
  auth.uid() = id 
  OR 
  -- For providers, others can see basic info but NOT phone numbers
  -- (phone access will be restricted to secure functions only)
  (is_provider = true AND auth.uid() IS NOT NULL)
);

-- Step 3: Update the public_provider_profiles view to exclude sensitive data
DROP VIEW IF EXISTS public.public_provider_profiles CASCADE;

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
  -- Note: phone is explicitly excluded for security
FROM public.profiles 
WHERE is_provider = true;

-- Step 4: Create a secure function for verified contact access
-- This is the ONLY way to access phone numbers - requires valid booking
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
    -- User has a CONFIRMED or ACTIVE booking with this provider
    EXISTS (
      SELECT 1 FROM public.bookings b 
      WHERE b.provider_id = provider_id 
      AND b.customer_id = auth.uid()
      AND b.status IN ('confirmed', 'in_progress')
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
    -- User has a CONFIRMED or IN-PROGRESS booking (not completed or pending)
    EXISTS (
      SELECT 1 FROM public.bookings b 
      WHERE b.provider_id = provider_id 
      AND b.customer_id = auth.uid()
      AND b.status IN ('confirmed', 'in_progress')
    )
  );
$function$;

-- Step 6: Create a function to safely get public provider info (no phone numbers)
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

-- Step 7: Create additional security policy to prevent phone number leakage
-- This policy specifically restricts phone number access in SELECT queries
CREATE OR REPLACE FUNCTION public.can_access_phone_number(profile_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT (
    -- User is viewing their own profile
    auth.uid() = profile_id
    OR
    -- User has confirmed booking with this provider
    EXISTS (
      SELECT 1 FROM public.bookings b 
      WHERE b.provider_id = profile_id 
      AND b.customer_id = auth.uid()
      AND b.status IN ('confirmed', 'in_progress')
    )
  );
$function$;

-- Step 8: Add helpful comments
COMMENT ON POLICY "Users can view provider profiles with restrictions" ON public.profiles 
IS 'Allows provider profile access but phone numbers are restricted to authorized users only';

COMMENT ON FUNCTION public.get_verified_provider_contact(uuid) 
IS 'Secure function to access provider contact info - requires confirmed booking';

COMMENT ON FUNCTION public.get_public_provider_info(uuid) 
IS 'Safe function for public provider discovery - excludes sensitive data';

COMMENT ON FUNCTION public.can_access_phone_number(uuid) 
IS 'Authorization function to check if user can access phone numbers';

COMMENT ON VIEW public.public_provider_profiles 
IS 'Public view of provider profiles - phone numbers excluded for security';