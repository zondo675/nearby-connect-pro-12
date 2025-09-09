-- Create the messages table as requested
CREATE TABLE public.direct_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own messages" 
ON public.direct_messages 
FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" 
ON public.direct_messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received messages" 
ON public.direct_messages 
FOR UPDATE 
USING (auth.uid() = receiver_id);

-- Create index for better performance
CREATE INDEX idx_direct_messages_participants ON public.direct_messages(sender_id, receiver_id);
CREATE INDEX idx_direct_messages_timestamp ON public.direct_messages(timestamp DESC);

-- Enable realtime for the table
ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages;