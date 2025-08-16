# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

**Development:**
```bash
npm run dev --turbopack    # Start development server with Turbopack
npm run build             # Build for production
npm run lint              # Run ESLint
```

**Database Initialization:**
```bash
# POST request to initialize database with sample data
curl -X POST http://localhost:3000/api/init-db
```

## Architecture Overview

This is a **Store Rating Platform** built with Next.js 15 App Router, featuring three distinct user roles with role-based access control.

### Core Architecture Patterns

**Authentication Flow:**
- JWT-based authentication with role-based access (`admin`, `user`, `store_owner`)
- AuthContext provides global auth state using React Context
- Token stored in localStorage, user data persisted across sessions
- All API routes protected with Bearer token authentication

**Database Layer:**
- PostgreSQL with connection pooling via `pg` library
- Database connection configured in `src/lib/database/connection.ts`
- Neon database integration with SSL required
- Auto-initialization via `/api/init-db` endpoint creates tables, indexes, triggers, and sample data

**Validation Strategy:**
- Zod schemas in `src/lib/validations/schemas.ts` define strict validation rules
- Name: 20-60 characters, Password: 8-16 chars with uppercase + special char, Address: max 400 chars
- Schema validation applied on both client and server sides

### User Role System

**Three Role Types:**
1. **Admin** (`/dashboard/admin`) - Manages all users and stores, platform statistics
2. **Store Owner** (`/dashboard/store-owner`) - Views store performance and ratings
3. **User** (`/dashboard/user`) - Browses stores, submits ratings (1-5 stars)

**Role-Based API Access:**
- `/api/admin/*` - Admin-only endpoints
- `/api/store-owner/*` - Store owner specific operations  
- `/api/ratings` - Users can submit/update ratings
- `/api/stores` - Public store browsing with search/filter

### Component Organization

**Layout Structure:**
- `src/app/layout.tsx` wraps app with AuthProvider
- `src/components/common/DashboardLayout.tsx` provides role-based navigation
- Each role has dedicated dashboard components in respective folders

**UI Components:**
- Shadcn/ui components in `src/components/ui/` (button, card, input, table, etc.)
- Role-specific components organized by user type
- Reusable form components for auth (LoginForm, RegisterForm)

### Database Schema

**Core Tables:**
- `users` - User accounts with role column and validation constraints
- `stores` - Store entities with optional owner relationship
- `ratings` - User ratings for stores (1-5 scale) with unique constraint per user-store pair

**Key Relationships:**
- stores.owner_id → users.id (optional foreign key)
- ratings.user_id → users.id (required)
- ratings.store_id → stores.id (required)

### Environment Configuration

**Required Environment Variables:**
```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=your-secret-key
```

**Sample Accounts (created by init-db):**
- Admin: admin@storerating.com / Admin123!
- Store Owner: storeowner@demo.com / StoreOwner123!
- User: user@demo.com / NormalUser123!

### Development Workflow

1. **Database Setup:** Run `/api/init-db` endpoint to create tables and sample data
2. **Role Testing:** Use sample accounts to test different user experiences
3. **API Testing:** All endpoints require Authorization header with Bearer token
4. **Form Validation:** Client-side validation mirrors server-side Zod schemas

### Testing

**Test Scripts:**
```bash
node test-pages.js        # Basic page accessibility testing  
node test-complete.js     # Full application testing suite
```

**Test Coverage:**
- Database initialization and setup
- Page route accessibility 
- Authentication flow with all user roles
- User registration process
- API endpoint functionality
- Protected route access with JWT tokens

### Key Integration Points

**API Route Structure:**
- Authentication routes in `/api/auth/`
- Role-specific routes follow `/api/{role}/` pattern
- Database operations use connection pool from shared module
- All routes include proper error handling and validation