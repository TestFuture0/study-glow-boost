-- Seed the public.badges table with default badge data
INSERT INTO public.badges (id, name, description, icon) VALUES
(1, 'Quiz Master', 'Complete 10 quizzes with 90% or higher score', '🏆'),
(2, 'Streak Champion', 'Maintain a 7-day study streak', '🔥'),
(3, 'Flashcard Pro', 'Create and review 100 flashcards', '🧠'),
(4, 'Early Bird', 'Complete 5 study sessions before 9 AM', '🌅'),
(5, 'Night Owl', 'Complete 5 study sessions after 10 PM', '🌙'),
(6, 'Speed Learner', 'Complete a quiz in under 2 minutes with 80% score', '⚡')
ON CONFLICT (id) DO NOTHING; -- Optional: Prevents error if you run it multiple times 