# Rumered

A production-ready web app for college students to showcase their style and dorm room setups. Built with Next.js 14, TypeScript, Tailwind CSS, and Prisma.

## Features

- **Fit Check**: Browse and vote on outfit collections from college students
- **Dorm Room Tours**: Explore dorm room setups and get decorating ideas
- **Voting System**: Rate content on aestheticness, cleanliness, and creativity (1-10 scale)
- **Room Applications**: Submit applications to feature your own room
- **Admin Dashboard**: Manage content and review applications
- **Authentication**: Secure login/register with StackAuth

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon)
- **Authentication**: StackAuth
- **Deployment**: Netlify
- **UI Components**: Radix UI, Lucide React
- **Forms**: React Hook Form + Zod validation

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- StackAuth account

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd rumered
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp env.example .env.local
```

Fill in your environment variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/rumered"
STACKAUTH_API_KEY="your_stackauth_api_key"
STACKAUTH_ISSUER="your_stackauth_issuer"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

4. Set up the database:

```bash
npm run db:push
npm run db:seed
```

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Database Schema

The app uses the following main models:

- **User**: StackAuth user with role-based permissions
- **Room**: Individual dorm room features
- **Outfit**: Outfit features
- **Vote**: User votes on rooms/outfits
- **RoomApplication**: Applications to feature rooms

## API Endpoints

### Public

- `GET /api/outfits` - Get published outfits
- `GET /api/rooms` - Get published rooms

### Authenticated

- `POST /api/votes` - Submit/update vote
- `GET /api/votes` - Get user's vote for specific target
- `POST /api/applications` - Submit room application
- `GET /api/applications` - Get user's applications
- `GET /api/user-votes` - Get user's voting history

### Admin

- `GET /api/admin/stats` - Get admin dashboard stats
- `GET /api/admin/rooms` - Get all rooms (admin)
- `POST /api/admin/rooms` - Create room
- `PUT /api/admin/rooms/[id]` - Update room
- `DELETE /api/admin/rooms/[id]` - Delete room
- `GET /api/admin/outfits` - Get all outfits (admin)
- `POST /api/admin/outfits` - Create outfit
- `PUT /api/admin/outfits/[id]` - Update outfit
- `DELETE /api/admin/outfits/[id]` - Delete outfit
- `GET /api/admin/applications` - Get all applications
- `PATCH /api/admin/applications/[id]` - Update application status

## Deployment

### Netlify

1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

The app is configured with:

- `netlify.toml` for build settings
- `@netlify/plugin-nextjs` for Next.js optimization
- Automatic Prisma migrations on deploy

### Environment Variables for Production

```env
DATABASE_URL="your_production_database_url"
STACKAUTH_API_KEY="your_stackauth_api_key"
STACKAUTH_ISSUER="your_stackauth_issuer"
NEXT_PUBLIC_SITE_URL="https://your-domain.netlify.app"
```

## Development

### Database Commands

```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes to database
npm run db:migrate   # Create and run migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

### Code Quality

The project includes:

- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks
- TypeScript for type safety

## Admin Access

The seed script creates an admin user with email `admin@rumered.app`. You'll need to:

1. Set up StackAuth with this email
2. Update the user ID in the database to match StackAuth's user ID

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
