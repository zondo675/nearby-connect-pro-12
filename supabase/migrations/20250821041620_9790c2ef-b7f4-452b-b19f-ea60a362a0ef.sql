-- Create custom types for enums
CREATE TYPE user_role AS ENUM ('worker', 'customer', 'both');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE payment_method AS ENUM ('upi', 'card', 'cash');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed');
CREATE TYPE message_type AS ENUM ('text', 'image', 'video', 'audio', 'file');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'seen');
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'declined');

-- Update existing profiles table with additional fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'customer',
ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT false;

-- Create categories table (update existing service_categories)
INSERT INTO public.service_categories (name, description, icon, color) VALUES
('Plumbing', 'Professional plumbing services for home and office', 'wrench', '#3B82F6'),
('Electrical', 'Licensed electrical work and installations', 'zap', '#F59E0B'),
('Cleaning', 'Home and office cleaning services', 'sparkles', '#10B981'),
('Computer Repair', 'Tech support and computer maintenance', 'laptop', '#8B5CF6'),
('Carpentry', 'Custom woodwork and furniture repair', 'hammer', '#DC2626'),
('Painting', 'Interior and exterior painting services', 'palette', '#EC4899')
ON CONFLICT (name) DO NOTHING;

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID NOT NULL REFERENCES public.service_categories(id),
  price NUMERIC(10,2),
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  location TEXT,
  location_lat NUMERIC(10,8),
  location_lng NUMERIC(11,8),
  availability BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for services
CREATE POLICY "Services are viewable by everyone" ON public.services
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own services" ON public.services
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own services" ON public.services
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own services" ON public.services
FOR DELETE USING (auth.uid() = user_id);

-- Update existing bookings table to match new structure
ALTER TABLE public.bookings 
DROP COLUMN IF EXISTS provider_id,
ADD COLUMN IF NOT EXISTS worker_id UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES public.services(id),
ADD COLUMN IF NOT EXISTS booking_date DATE,
ADD COLUMN IF NOT EXISTS booking_time TIME;

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  payment_method payment_method DEFAULT 'upi',
  status payment_status DEFAULT 'pending',
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.bookings b 
    WHERE b.id = payments.booking_id 
    AND (b.customer_id = auth.uid() OR b.worker_id = auth.uid())
  )
);

-- Create chats table
CREATE TABLE public.chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on chats
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

-- Create chat_participants table
CREATE TABLE public.chat_participants (
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (chat_id, user_id)
);

-- Enable RLS on chat_participants
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for chats and participants
CREATE POLICY "Users can view chats they participate in" ON public.chats
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chat_participants cp 
    WHERE cp.chat_id = chats.id AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their own chat participations" ON public.chat_participants
FOR SELECT USING (user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM public.chat_participants cp2 
  WHERE cp2.chat_id = chat_participants.chat_id AND cp2.user_id = auth.uid()
));

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT,
  type message_type DEFAULT 'text',
  status message_status DEFAULT 'sent',
  file_url TEXT,
  reply_to UUID REFERENCES public.messages(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for messages
CREATE POLICY "Users can view messages from their chats" ON public.messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chat_participants cp 
    WHERE cp.chat_id = messages.chat_id AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert messages to their chats" ON public.messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.chat_participants cp 
    WHERE cp.chat_id = messages.chat_id AND cp.user_id = auth.uid()
  )
);

-- Create message_requests table
CREATE TABLE public.message_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT,
  status request_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(sender_id, receiver_id)
);

-- Enable RLS on message_requests
ALTER TABLE public.message_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for message_requests
CREATE POLICY "Users can view requests they sent or received" ON public.message_requests
FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can create message requests" ON public.message_requests
FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update requests they received" ON public.message_requests
FOR UPDATE USING (receiver_id = auth.uid());

-- Create storage buckets for media
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('chat-media', 'chat-media', false),
('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
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

-- Create updated_at triggers
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chats_updated_at
BEFORE UPDATE ON public.chats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create functions for chat operations
CREATE OR REPLACE FUNCTION public.create_chat_with_user(other_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Enable realtime for tables
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.chats REPLICA IDENTITY FULL;
ALTER TABLE public.chat_participants REPLICA IDENTITY FULL;
ALTER TABLE public.message_requests REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER publication supabase_realtime ADD TABLE public.messages;
ALTER publication supabase_realtime ADD TABLE public.chats; 
ALTER publication supabase_realtime ADD TABLE public.chat_participants;
ALTER publication supabase_realtime ADD TABLE public.message_requests;
ALTER publication supabase_realtime ADD TABLE public.profiles;