-- Add is_pro column to profiles table
ALTER TABLE public.profiles
ADD COLUMN is_pro BOOLEAN DEFAULT FALSE NOT NULL;

-- Optionally, if you want to ensure existing users also get this default
-- (though if profile creation was failing, there might not be many existing profiles)
-- UPDATE public.profiles SET is_pro = FALSE WHERE is_pro IS NULL; 