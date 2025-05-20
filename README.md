
# StudySpark - Study Management Platform

StudySpark is a comprehensive study management platform that helps students track their progress, create flashcards, take quizzes, and earn points and achievements.

## Features

- **User Authentication**: Secure signup and login with email/password
- **Dashboard**: View study progress, goals, streaks, and recent activity
- **Flashcards**: Create and review flashcards for effective learning
- **AI Quizzes**: Generate quizzes based on your study materials
- **AI Concept Explainer**: Get clear explanations of complex topics (Pro feature)
- **Points & Achievements**: Earn points and unlock achievements as you study
- **Pro Subscription**: Access premium features with a Pro subscription

## Technologies

- React + TypeScript
- Tailwind CSS
- Shadcn UI components
- Supabase for authentication and database
- Stripe for payment processing (in development)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/studyspark.git
cd studyspark
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a Supabase project at https://supabase.com
2. Get your Supabase URL and anon key from the API settings
3. Apply the database migrations from `supabase/migrations/` to set up the required tables
4. Set up the following environment variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up Stripe (for Pro subscription)

1. Create a Stripe account at https://stripe.com
2. Get your Stripe publishable key and secret key
3. Set up the appropriate Stripe products and prices
4. Create the necessary Supabase Edge Functions for Stripe integration
5. Set up the following environment variables:

```
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 5. Run the development server

```bash
npm run dev
```

## Database Schema

The application uses the following database tables:

- `profiles`: User profiles with points, levels, and streak information
- `points_history`: Record of points earned by users
- `goals`: User study goals
- `activity`: Record of user activity
- `study_sessions`: Record of study sessions
- `badges`: Available achievements/badges
- `user_badges`: Badges earned by users
- `subscriptions`: User subscription information

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)
