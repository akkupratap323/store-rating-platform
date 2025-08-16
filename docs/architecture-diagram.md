# 🏗️ Store Rating Platform - Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER (Frontend)                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │   Next.js 15    │  │    React 18     │  │   TypeScript    │                │
│  │   App Router    │  │   Components    │  │   Type Safety   │                │
│  │                 │  │                 │  │                 │                │
│  │ • Route Mgmt    │  │ • UI Components │  │ • IntelliSense  │                │
│  │ • SSR/SSG       │  │ • State Mgmt    │  │ • Error Check   │                │
│  │ • Code Split    │  │ • Animations    │  │ • Auto-complete │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │  Tailwind CSS   │  │ Framer Motion   │  │  Aceternity UI  │                │
│  │   Styling       │  │   Animations    │  │   Components    │                │
│  │                 │  │                 │  │                 │                │
│  │ • Utility First │  │ • Smooth Trans  │  │ • Dark Theme    │                │
│  │ • Responsive    │  │ • Micro Interact│  │ • Gradients     │                │
│  │ • Custom Theme  │  │ • Performance   │  │ • Effects       │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                               HTTP/HTTPS Requests
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER (Backend)                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │  Next.js API    │  │   Middleware    │  │ Authentication  │                │
│  │    Routes       │  │    Layer        │  │     & Auth      │                │
│  │                 │  │                 │  │                 │                │
│  │ • RESTful APIs  │  │ • CORS Handle   │  │ • JWT Tokens    │                │
│  │ • Route Protect │  │ • Rate Limiting │  │ • Role Checks   │                │
│  │ • Error Handle  │  │ • Logging       │  │ • Session Mgmt  │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │   Validation    │  │  Data Models    │  │   Security      │                │
│  │     Layer       │  │   & Schemas     │  │    Layer        │                │
│  │                 │  │                 │  │                 │                │
│  │ • Zod Schemas   │  │ • Type Defs     │  │ • Input Sanit   │                │
│  │ • Input Valid   │  │ • Interfaces    │  │ • XSS Protect   │                │
│  │ • Error Format  │  │ • Enums         │  │ • CSRF Tokens   │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                 SQL Queries
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            DATABASE LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │   PostgreSQL    │  │ Connection Pool │  │  Database       │                │
│  │    Database     │  │   Management    │  │   Schema        │                │
│  │                 │  │                 │  │                 │                │
│  │ • ACID Trans    │  │ • Pool Config   │  │ • Tables        │                │
│  │ • Constraints   │  │ • Connection    │  │ • Indexes       │                │
│  │ • Performance   │  │ • Auto Scale    │  │ • Relations     │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐            │
│  │                      Core Tables                                 │            │
│  │                                                                 │            │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │            │
│  │  │    USERS    │    │   STORES    │    │   RATINGS   │        │            │
│  │  │             │    │             │    │             │        │            │
│  │  │ • id (PK)   │    │ • id (PK)   │    │ • id (PK)   │        │            │
│  │  │ • name      │◄──┐│ • name      │    │ • user_id   │────────┤            │
│  │  │ • email     │   ││ • email     │    │ • store_id  │────────┤            │
│  │  │ • password  │   ││ • address   │    │ • rating    │        │            │
│  │  │ • address   │   ││ • owner_id  │────┘│ • created   │        │            │
│  │  │ • role      │   ││ • created   │     │ • updated   │        │            │
│  │  │ • created   │   │└─────────────┘     └─────────────┘        │            │
│  │  │ • updated   │   │                                           │            │
│  │  └─────────────┘   │                                           │            │
│  │                    │                                           │            │
│  └────────────────────┼───────────────────────────────────────────┘            │
│                       │                                                        │
│                       └─── Relationships:                                     │
│                            • Users (1) ↔ (0..1) Stores (ownership)           │
│                            • Users (1) ↔ (0..*) Ratings (user ratings)       │
│                            • Stores (1) ↔ (0..*) Ratings (store ratings)     │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## User Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              USER AUTHENTICATION FLOW                          │
└─────────────────────────────────────────────────────────────────────────────────┘

                            ┌─────────────┐
                            │    Login    │
                            │    Page     │
                            └──────┬──────┘
                                   │
                              User Input
                                   │
                                   ▼
                            ┌─────────────┐
                            │ Validate    │
                            │ Credentials │
                            └──────┬──────┘
                                   │
                              Valid/Invalid
                                   │
                   ┌───────────────┴───────────────┐
                   │                               │
                   ▼                               ▼
            ┌─────────────┐                ┌─────────────┐
            │ Generate    │                │   Show      │
            │ JWT Token   │                │   Error     │
            └──────┬──────┘                └─────────────┘
                   │
              Store Token
                   │
                   ▼
            ┌─────────────┐
            │ Role-Based  │
            │ Dashboard   │
            │ Redirect    │
            └──────┬──────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
   ┌────────┐ ┌────────┐ ┌────────┐
   │ Admin  │ │ Store  │ │  User  │
   │Dashboard│ │Owner   │ │Dashboard│
   │        │ │Dashboard│ │        │
   └────────┘ └────────┘ └────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            COMPONENT HIERARCHY                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

                            ┌─────────────┐
                            │   App.tsx   │
                            │   (Root)    │
                            └──────┬──────┘
                                   │
                                   ▼
                            ┌─────────────┐
                            │AuthProvider │
                            │ (Context)   │
                            └──────┬──────┘
                                   │
                       ┌───────────┼───────────┐
                       │           │           │
                       ▼           ▼           ▼
                ┌──────────┐ ┌──────────┐ ┌──────────┐
                │   Auth   │ │Dashboard │ │  Public  │
                │  Pages   │ │  Pages   │ │  Pages   │
                └────┬─────┘ └────┬─────┘ └────┬─────┘
                     │            │            │
         ┌───────────┼─────┐      │       ┌────┼─────┐
         │           │     │      │       │    │     │
         ▼           ▼     ▼      │       ▼    ▼     ▼
    ┌────────┐ ┌────────┐ │      │  ┌────────┐ │ ┌────────┐
    │ Login  │ │Register│ │      │  │  Home  │ │ │ About  │
    │  Form  │ │  Form  │ │      │  │  Page  │ │ │  Page  │
    └────────┘ └────────┘ │      │  └────────┘ │ └────────┘
                          │      │             │
                          │      ▼             │
                          │ ┌──────────────────┤
                          │ │Role-Based Router │
                          │ └──────┬───────────┘
                          │        │
              ┌───────────┼────────┼────────────┐
              │           │        │            │
              ▼           ▼        ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐ │
        │  Admin   │ │   Store  │ │   User   │ │
        │Dashboard │ │  Owner   │ │Dashboard │ │
        │          │ │Dashboard │ │          │ │
        └────┬─────┘ └────┬─────┘ └────┬─────┘ │
             │            │            │       │
    ┌────────┼─────┐      │    ┌───────┼────┐  │
    │        │     │      │    │       │    │  │
    ▼        ▼     ▼      ▼    ▼       ▼    ▼  ▼
┌────────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
│ Users  │ │Stores││Stats││Analytics││Stores││Ratings│
│ Mgmt   │ │ Mgmt││Cards││ Charts  ││Browse││ Mgmt  │
└────────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW DIAGRAM                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

  User Action          Component           API Layer         Database         Response
       │                   │                   │                │               │
       │ 1. Click Submit   │                   │                │               │
       ├──────────────────►│                   │                │               │
       │                   │ 2. Form Data      │                │               │
       │                   ├──────────────────►│                │               │
       │                   │                   │ 3. Validate    │               │
       │                   │                   │    & Auth      │               │
       │                   │                   │                │               │
       │                   │                   │ 4. SQL Query   │               │
       │                   │                   ├───────────────►│               │
       │                   │                   │                │ 5. Execute    │
       │                   │                   │                │    & Return   │
       │                   │                   │ 6. Result      │               │
       │                   │                   │◄───────────────┤               │
       │                   │ 7. JSON Response  │                │               │
       │                   │◄──────────────────┤                │               │
       │ 8. UI Update      │                   │                │               │
       │◄──────────────────┤                   │                │               │
       │                   │                   │                │               │

Example: User Rating Submission
────────────────────────────────
1. User clicks 5-star rating
2. Component captures rating value
3. POST /api/ratings with {storeId: 1, rating: 5}
4. Validate JWT token and user permissions
5. INSERT INTO ratings (user_id, store_id, rating) VALUES (1, 1, 5)
6. Database returns success confirmation
7. API returns {success: true, message: "Rating saved"}
8. UI shows success toast and updates store rating
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                             SECURITY LAYERS                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                         CLIENT-SIDE SECURITY                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ • Input Validation (Frontend)        • XSS Prevention                          │
│ • Form Validation (Real-time)        • Content Security Policy                 │
│ • Token Storage (Secure)             • HTTPS Enforcement                       │
│ • Route Protection (Client)          • Secure Headers                          │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                 Secure HTTPS
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          SERVER-SIDE SECURITY                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│ • JWT Authentication                 • Rate Limiting                            │
│ • Role-Based Access Control          • Input Sanitization                      │
│ • Password Hashing (Bcrypt)          • SQL Injection Prevention                │
│ • Session Management                 • CORS Configuration                      │
│ • API Route Protection               • Error Handling (Secure)                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                              Encrypted Connection
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          DATABASE SECURITY                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│ • SSL/TLS Encryption                 • Data Validation (Constraints)           │
│ • Connection Pooling (Secure)        • Backup & Recovery                       │
│ • Parameterized Queries              • Access Logging                          │
│ • Data Integrity (ACID)              • Performance Monitoring                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          PRODUCTION DEPLOYMENT                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

                            ┌─────────────┐
                            │   Users     │
                            │ (Browsers)  │
                            └──────┬──────┘
                                   │
                              HTTPS/HTTP
                                   │
                                   ▼
                            ┌─────────────┐
                            │     CDN     │
                            │  (Vercel)   │
                            └──────┬──────┘
                                   │
                             Static Assets
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │      Vercel Platform        │
                    │   (Next.js Deployment)     │
                    ├─────────────────────────────┤
                    │ • Auto Scaling              │
                    │ • Edge Functions            │
                    │ • Server-Side Rendering     │
                    │ • API Routes                │
                    │ • Environment Variables     │
                    └──────────────┬──────────────┘
                                   │
                              Database API
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │      Neon PostgreSQL        │
                    │    (Cloud Database)         │
                    ├─────────────────────────────┤
                    │ • Connection Pooling        │
                    │ • Auto Backup               │
                    │ • High Availability         │
                    │ • SSL Encryption            │
                    │ • Performance Monitoring    │
                    └─────────────────────────────┘
```

---

This architecture diagram provides a comprehensive visual overview of the Store Rating Platform's system design, showing how all components interact from the frontend user interface down to the database layer, including security measures and deployment architecture.