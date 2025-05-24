# Reachee - Influencer Marketing Platform

A simplified, modern platform connecting brands with influencers for successful collaborations.

## ✨ Features

- **User Authentication** - Secure registration and login with database integration
- **Role-based Onboarding** - Simplified forms for influencers and brands
- **Dashboard** - Personalized experience based on user type
- **Campaign Management** - Create and browse campaigns
- **Real-time Messaging** - Connect brands with influencers

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Tailwind CSS, shadcn/ui components
- **Authentication**: Custom auth with bcrypt
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation

## 🛠️ Recent Improvements

### Simplified & Refactored
- ✅ **Removed complex multi-step forms** - Single page onboarding
- ✅ **Eliminated unnecessary dependencies** - No more react-select, country-state-city
- ✅ **Simplified validation** - Clean react-hook-form integration
- ✅ **Database integration** - Real authentication instead of mock data
- ✅ **Cleaner codebase** - Removed unused hooks and components

### Authentication System
- ✅ **User Registration** - Creates account with hashed password
- ✅ **User Login** - Database verification with proper redirects
- ✅ **Profile Creation** - Saves influencer/brand data to database
- ✅ **Role-based Flow** - Automatic redirection based on profile completion

## 📁 Project Structure

```
app/
├── api/auth/          # Authentication endpoints
├── login/             # Login page
├── register/          # Registration page
├── influencer/        # Influencer onboarding
├── brand/             # Brand onboarding
└── dashboard/         # Main dashboard

components/
├── ui/                # Reusable UI components
├── layout/            # Layout components
└── shared/            # Shared business components

lib/
├── db.ts              # Prisma client
└── utils.ts           # Utility functions

stores/
└── useAuthStore.ts    # Authentication state
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd reachee
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Update DATABASE_URL and other variables
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Visit** http://localhost:3000

## 📝 Usage

1. **Register** as either an Influencer or Brand
2. **Complete onboarding** with simplified single-page forms
3. **Access dashboard** based on your role
4. **Create campaigns** (brands) or **browse opportunities** (influencers)

## 🔧 Development

- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **State**: Zustand for client state management

## 📦 Key Dependencies

- `next` - React framework
- `prisma` - Database ORM
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `tailwindcss` - Styling
- `zustand` - State management
- `bcrypt` - Password hashing

## 🎯 Next Steps

- [ ] Add email verification
- [ ] Implement file upload for profiles
- [ ] Add search and filtering
- [ ] Enhance messaging system
- [ ] Add campaign analytics
- [ ] Payment integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ for the influencer marketing community**
