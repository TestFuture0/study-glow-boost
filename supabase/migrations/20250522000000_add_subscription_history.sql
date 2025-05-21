
-- Update subscriptions table if it doesn't have all the fields we need
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS interval TEXT DEFAULT 'month',
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS trial_end TIMESTAMP WITH TIME ZONE;

-- Create table for subscription history if it doesn't exist
CREATE TABLE IF NOT EXISTS public.subscription_history (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  plan_type TEXT NOT NULL,
  status TEXT NOT NULL,
  action TEXT NOT NULL, -- e.g., 'created', 'renewed', 'cancelled', 'verified'
  payment_amount INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policy for subscription history
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription history" ON public.subscription_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Insert subscription history records" ON public.subscription_history
  FOR INSERT WITH CHECK (true);
