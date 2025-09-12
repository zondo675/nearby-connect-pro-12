-- Enable comprehensive user profile search and discovery
-- This migration adds search functionality and public profile access

-- Step 1: Create a public function to search users by username/name
CREATE OR REPLACE FUNCTION public.search_user_profiles(search_term TEXT)
RETURNS TABLE(
    id UUID,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    is_provider BOOLEAN,
    rating NUMERIC,
    is_online BOOLEAN,
    last_seen TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
        p.last_seen
    FROM public.profiles p
    WHERE 
        p.full_name ILIKE '%' || search_term || '%'
        AND p.id != COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::UUID)
    ORDER BY 
        CASE WHEN p.is_online THEN 0 ELSE 1 END,
        p.rating DESC NULLS LAST,
        p.full_name ASC
    LIMIT 50;
END;
$$;

-- Step 2: Create a function to get public profile info (for non-sensitive data)
CREATE OR REPLACE FUNCTION public.get_public_profile(user_id UUID)
RETURNS TABLE(
    id UUID,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    is_provider BOOLEAN,
    rating NUMERIC,
    is_online BOOLEAN,
    last_seen TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
    FROM public.profiles p
    WHERE p.id = user_id;
END;
$$;

-- Step 3: Grant permissions
GRANT EXECUTE ON FUNCTION public.search_user_profiles(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_user_profiles(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_profile(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_profile(UUID) TO anon;

-- Step 4: Add comments for documentation
COMMENT ON FUNCTION public.search_user_profiles IS 'Search for user profiles by name with privacy protection';
COMMENT ON FUNCTION public.get_public_profile IS 'Get public profile information for a specific user';