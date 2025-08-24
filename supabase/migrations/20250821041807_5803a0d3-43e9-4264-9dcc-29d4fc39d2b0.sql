-- Fix function security issue by setting proper search_path
CREATE OR REPLACE FUNCTION public.create_chat_with_user(other_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  chat_id UUID;
  existing_chat_id UUID;
BEGIN
  -- Check if chat already exists between these users
  SELECT c.id INTO existing_chat_id
  FROM public.chats c
  WHERE EXISTS (
    SELECT 1 FROM public.chat_participants cp1 
    WHERE cp1.chat_id = c.id AND cp1.user_id = auth.uid()
  ) AND EXISTS (
    SELECT 1 FROM public.chat_participants cp2 
    WHERE cp2.chat_id = c.id AND cp2.user_id = other_user_id
  );
  
  IF existing_chat_id IS NOT NULL THEN
    RETURN existing_chat_id;
  END IF;
  
  -- Create new chat
  INSERT INTO public.chats DEFAULT VALUES RETURNING id INTO chat_id;
  
  -- Add participants
  INSERT INTO public.chat_participants (chat_id, user_id) VALUES 
    (chat_id, auth.uid()),
    (chat_id, other_user_id);
  
  RETURN chat_id;
END;
$$;

-- Add storage policies for proper security
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects 
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" ON storage.objects 
FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view chat media in their conversations" ON storage.objects 
FOR SELECT USING (
  bucket_id = 'chat-media' AND
  EXISTS (
    SELECT 1 FROM public.messages m
    JOIN public.chat_participants cp ON m.chat_id = cp.chat_id
    WHERE m.file_url LIKE '%' || name || '%' AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Users can upload chat media" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'chat-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Service images are publicly accessible" ON storage.objects 
FOR SELECT USING (bucket_id = 'service-images');

CREATE POLICY "Users can upload service images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'service-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add tables to realtime publication
ALTER publication supabase_realtime ADD TABLE public.messages;
ALTER publication supabase_realtime ADD TABLE public.chats; 
ALTER publication supabase_realtime ADD TABLE public.chat_participants;
ALTER publication supabase_realtime ADD TABLE public.message_requests;
ALTER publication supabase_realtime ADD TABLE public.profiles;