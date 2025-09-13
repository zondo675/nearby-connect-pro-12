-- Add policy to allow viewing limited public profile information
CREATE POLICY "Public profiles are viewable by authenticated users" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Update the get_public_profile function to ensure it works correctly
CREATE OR REPLACE FUNCTION public.get_public_profile(user_id uuid)
RETURNS TABLE(
  id uuid,
  full_name text,
  avatar_url text,
  bio text,
  location text,
  is_provider boolean,
  rating numeric,
  is_online boolean,
  last_seen timestamp with time zone,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.avatar_url,
    p.bio,
    p.location,
    p.is_provider,
    p.rating,
    p.is_online,
    p.last_seen,
    p.created_at
  FROM profiles p
  WHERE p.id = user_id;
END;
$$;