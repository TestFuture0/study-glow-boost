-- Add INSERT policy for points_history table
CREATE POLICY "Users can insert their own points history" 
ON public.points_history FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add INSERT policy for user_badges table
CREATE POLICY "Users can insert their own badges" 
ON public.user_badges FOR INSERT 
WITH CHECK (auth.uid() = user_id); 