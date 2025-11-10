# Student Super App - Frontend

A production-grade Next.js 15 application for the Student Super App ecosystem.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Server State:** @tanstack/react-query
- **Real-time:** Socket.IO Client
- **UI Components:** shadcn/ui + Tailwind CSS
- **Form Validation:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Authentication:** JWT (Access + Refresh Token)

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── dashboard/
│   ├── marketplace/
│   ├── printing/
│   ├── rentplace/
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   ├── ui/           # shadcn components
│   ├── common/       # Shared components
│   └── AuthGuard.tsx
├── features/
│   └── auth/
│       └── services.ts
├── lib/
│   ├── axios.ts      # Axios config with interceptors
│   ├── api-client.ts # API endpoints
│   ├── queryClient.ts
│   ├── socket.tsx    # Socket.IO setup
│   └── utils.ts
├── store/
│   ├── index.ts
│   ├── hooks.ts
│   └── slices/
│       ├── authSlice.ts
│       ├── marketplaceSlice.ts
│       ├── printingSlice.ts
│       └── rentplaceSlice.ts
├── types/
│   ├── api.d.ts
│   └── user.ts
└── utils/
    ├── validators.ts
    ├── auth.ts
    └── error.ts
```

## 🛠️ Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env.local` and update:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
   NEXT_PUBLIC_ENV=development
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## 🔐 Authentication Flow

1. User logs in/registers → receives JWT access token
2. Token stored in cookies with `js-cookie`
3. Axios interceptor automatically adds token to requests
4. On 401 error, auto-refresh using refresh token
5. If refresh fails, user redirected to login

## 🎨 Features Implemented

### Auth Module
- ✅ Login / Register
- ✅ Email verification
- ✅ Password reset flow
- ✅ Auto token refresh
- ✅ Protected routes (AuthGuard)
- ✅ Profile management

### Marketplace
- ✅ List/browse items
- ✅ Create listings
- ✅ View listing details
- 🔄 Real-time updates (Socket.IO ready)

### Printing Service
- ✅ Print order creation
- ✅ Order tracking
- ✅ Order history
- 🔄 Real-time status updates (Socket.IO ready)

### Rentplace
- ✅ Property listings
- ✅ Add property
- ✅ View property details
- 🔄 Chat functionality (Socket.IO ready)

## 📦 Key Libraries

- `@reduxjs/toolkit` - State management
- `@tanstack/react-query` - Server state & caching
- `axios` - HTTP client with interceptors
- `socket.io-client` - Real-time communication
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `js-cookie` - Cookie management
- `sonner` - Toast notifications

## 🔌 API Integration

All API endpoints are defined in `src/features/auth/services.ts` and `src/lib/api-client.ts`, mapped from the Postman collection.

### Auth Endpoints
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- POST `/api/auth/refresh-token`
- GET `/api/auth/profile`
- PUT `/api/auth/profile`
- POST `/api/auth/change-password`

### Protected Routes
All routes except auth pages are wrapped with `<AuthGuard>` component.

## 🎯 Next Steps

- [ ] Implement file upload for marketplace images
- [ ] Add React Query hooks for all API calls
- [ ] Implement Socket.IO event listeners
- [ ] Add pagination for listings
- [ ] Implement search & filters
- [ ] Add loading skeletons
- [ ] Implement dark mode
- [ ] Add unit tests
- [ ] Add E2E tests

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🌐 Deployment

This project is ready for deployment on Vercel:

```bash
vercel
```

## 📄 License

MIT
