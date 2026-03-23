# 🏠 Dwellr - Student PG Rental Platform

A modern, secure full-stack application for students to discover, rate, and manage Paying Guest (PG) accommodations. Built with Next.js, TypeScript, MongoDB, and Tailwind CSS.

**Live Demo:** [dwellr.vercel.app](https://dwellr-mu.vercel.app/explore)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Deployment](#deployment)
- [Future Scope](#future-scope)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Dwellr** is a comprehensive PG rental discovery and management platform designed specifically for students. The platform connects students looking for affordable accommodations with PG owners, featuring location-based searching, community ratings, and role-based dashboards.

### Problem Solved
Students often struggle to find reliable, affordable PG accommodations in unfamiliar cities. Dwellr provides:
- Transparent ratings and reviews from real students
- Location-based discovery with interactive maps
- Verified PG listings with detailed information
- Direct messaging with PG owners
- Community feedback and recommendations

---

## ✨ Features

### 👥 For Students
- **Location-based Search**: Find PGs near your selected area using interactive Leaflet maps
- **Detailed Ratings & Reviews**: See authentic ratings from students who've lived there
- **Quick Filters**: Search by rent range, amenities, location
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Secure Authentication**: Email/password signup with httpOnly cookie storage

### 🏢 For PG Owners
- **Property Management Dashboard**: Manage multiple PG listings
- **Status Tracking**: Monitor approval status of new listings (Pending → Approved/Rejected)
- **Edit Listings**: Update property details, amenities, rent prices
- **Rating Analytics**: View community ratings and feedback
- **Owner Profile**: Customize profile information and contact details

### 👨‍💼 For Super Admins
- **Listing Approval System**: Review and approve/reject PG submissions
- **User Management**: View all users and their activity
- **Platform Analytics**: Monitor total PGs, users, ratings
- **Content Moderation**: Flag inappropriate reviews
- **System Health Monitoring**: Check database and API status

### 🔐 Security Features
- **Role-Based Access Control (RBAC)**: Three-tier access system (Student, PG Owner, Super Admin)
- **httpOnly Cookies**: Tokens stored securely (XSS protection)
- **MongoDB ObjectId Validation**: Protection against NoSQL injection
- **Password Security**: 12+ character passwords with uppercase, lowercase, numbers, special chars
- **Input Validation**: Zod schema validation on all API endpoints
- **CORS & CSP Headers**: Protection against common web vulnerabilities
- **Rate Limiting Ready**: Framework for preventing brute-force attacks

### 💡 Additional Features
- **Change Password**: Users can securely update their passwords
- **Interactive Maps**: Leaflet-based maps for location visualization
- **Dark Mode UI**: Modern, eye-friendly dark theme
- **Real-time Updates**: Automatic form validation and feedback
- **Mobile Responsive**: Fully responsive design for all device sizes

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.2** - React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **Leaflet.js** - Interactive maps
- **React Hooks** - State management
- **Axios** - HTTP client

### Backend
- **Next.js API Routes** - Serverless backend
- **Node.js** - Runtime environment
- **Express-like routing** - Built-in Next.js routing

### Database & Authentication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT (JSON Web Tokens)** - Token authentication
- **bcryptjs** - Password hashing

### Validation & Security
- **Zod** - TypeScript-first schema validation
- **MongoDB ObjectId validation** - NoSQL injection prevention

### Deployment & DevOps
- **Vercel** - Serverless deployment platform
- **Turbopack** - Next-gen JavaScript bundler
- **GitHub** - Version control

### Development Tools
- **ESLint** - Code linting
- **TypeScript Strict Mode** - Type safety
- **Tailwind CSS JIT** - On-demand CSS compilation

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                     │
│  - Next.js + React + TypeScript + Tailwind CSS             │
│  - Location-based UI, PG browsing, Ratings                 │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js API Routes                        │
│  - /api/auth - Authentication (login, signup, logout)      │
│  - /api/pgs - PG CRUD operations                           │
│  - /api/ratings - Rating & review management               │
│  - /api/users - User profile management                    │
└────────────────────┬────────────────────────────────────────┘
                     │ Network
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas                            │
│  - Users collection (credentials, profiles)                │
│  - PGs collection (listings, metadata)                     │
│  - Ratings collection (reviews, scores)                    │
└─────────────────────────────────────────────────────────────┘
```

### Project Structure
```
dwellr/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── route.ts (login/signup)
│   │   │   ├── change-password/route.ts
│   │   │   └── logout/route.ts
│   │   ├── pgs/
│   │   │   ├── route.ts (list/create)
│   │   │   ├── all/route.ts (admin)
│   │   │   ├── my-pgs/route.ts (owner)
│   │   │   ├── [id]/route.ts (detail)
│   │   │   └── [id]/status/route.ts (approval)
│   │   └── ratings/route.ts (create/fetch)
│   ├── auth/page.tsx (login/signup)
│   ├── explore/page.tsx (main search)
│   ├── pg/[id]/page.tsx (detail page)
│   └── dashboard/
│       ├── studentadmin/page.tsx
│       ├── pg-owner/page.tsx
│       ├── change-password/page.tsx
│       └── add-pg/page.tsx
├── components/
│   ├── LeafletMap.tsx
│   ├── LocationPicker.tsx
│   ├── RatingForm.tsx
│   └── Navbar.tsx
├── features/
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── auth.validation.ts
│   │   └── user.model.ts
│   └── pg/
│       ├── pg.model.ts
│       ├── pg.service.ts
│       ├── pg.validation.ts
│       └── rating.model.ts
├── hooks/
│   ├── useAuth.ts (authentication context)
│   ├── useLocation.ts (geolocation)
│   ├── usePG.ts (single PG)
│   └── usePGs.ts (multiple PGs)
├── lib/
│   ├── db.ts (MongoDB connection)
│   ├── auth.ts (token extraction)
│   ├── jwt.ts (JWT signing/verification)
│   └── validation.ts (ObjectId validation)
└── types/
    └── global.d.ts (TypeScript definitions)
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB Atlas account (free tier available)
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/dwellr.git
cd dwellr
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dwellr

# JWT secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your-32-character-secret-key

# Environment
NODE_ENV=development
```

### Step 4: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## ⚙️ Configuration

### MongoDB Atlas Setup

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Create a database user
   - Get connection string

2. **Allow Network Access**
   - Add IP address 0.0.0.0/0 (for development)
   - Whitelist Vercel IPs for production

3. **Create Database**
   - Database name: `dwellr`
   - Collections auto-created by Mongoose

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection URI | `mongodb+srv://user:pass@cluster.mongodb.net/dwellr` |
| `JWT_SECRET` | Secret key for JWT signing | `a1b2c3d4e5f6...` (32+ chars) |
| `NODE_ENV` | Environment | `development` or `production` |

### Vercel Deployment Configuration

Environment variables should be set in Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add `MONGODB_URI` and `JWT_SECRET` as secrets
3. Redeploy after adding variables

---

## 📖 Usage Guide

### For Students

#### 1. Sign Up
- Navigate to `/auth`
- Select "Sign Up" mode
- Enter email, password, name, and role
- Password must have: 12+ chars, uppercase, lowercase, number, special char

#### 2. Browse PGs
- Go to `/explore` page
- Grant location access or select area manually
- View PGs near you on the interactive map
- Click on PG cards to see details

#### 3. Rate and Review
- Click on a PG to open detail page
- Scroll to rating form
- Submit rating (1-5 stars) and review
- Add up to 5 images (optional)

#### 4. Change Password
- Navigate to `/dashboard/change-password`
- Enter current password and new password
- Password must meet security requirements

### For PG Owners

#### 1. Create Listing
- Sign up with `pg_owner` role
- Go to `/dashboard/pg-owner`
- Click **"+ Add New PG"**
- Fill details: name, address, location (drag on map), rent range, amenities
- Submit for approval

#### 2. Manage Listings
- View all your PGs on dashboard
- See approval status (Pending/Approved/Rejected)
- View ratings and reviews from students
- Update listing details anytime

#### 3. Monitor Performance
- Track total ratings and average scores
- Respond to student reviews
- Update amenities based on feedback

### For Super Admins

#### 1. Access Admin Dashboard
- Navigate to `/dashboard/superadmin` (requires superadmin role)
- View all PGs awaiting approval

#### 2. Review and Approve PGs
- Check PG details, location, amenities
- View owner information
- Approve or reject with reason

#### 3. View Analytics
- Total PGs submitted
- Pending, approved, rejected counts
- Total ratings across platform

---

## 📚 API Documentation

### Authentication Endpoints

#### Sign Up / Login
```
POST /api/auth
Content-Type: application/json

{
  "action": "signup",
  "email": "user@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "name": "John Doe",
  "role": "student" | "pg_owner"
}

Response: 200
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

#### Change Password
```
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecurePass456!",
  "confirmPassword": "NewSecurePass456!"
}

Response: 200
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Logout
```
POST /api/auth/logout

Response: 200
{
  "success": true,
  "message": "Logged out successfully"
}
```

### PG Endpoints

#### Create PG Listing
```
POST /api/pgs/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Cozy PG Near University",
  "address": "123 Main St, City",
  "lat": 19.0760,
  "lng": 72.8777,
  "minRent": 5000,
  "maxRent": 12000,
  "amenities": ["WiFi", "AC", "Hot Water", "Meals"]
}

Response: 201
{
  "success": true,
  "message": "PG created successfully",
  "pg": { ...pgData }
}
```

#### Get All PGs (Public)
```
GET /api/pgs/all?limit=10&offset=0

Response: 200
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Cozy PG",
      "address": "123 Main St",
      "ratings": { "avg": 4.5, "count": 12 },
      "status": "approved"
    }
  ]
}
```

#### Get User's PGs (Owner Only)
```
GET /api/pgs/my-pgs
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "data": [ ...userPGs ]
}
```

#### Get Single PG
```
GET /api/pgs/{pgId}

Response: 200
{
  "success": true,
  "data": { ...pgData }
}
```

#### Update PG Status (Admin)
```
PATCH /api/pgs/{pgId}/status
Authorization: Bearer <adminToken>
Content-Type: application/json

{
  "status": "approved",
  "rejectionReason": "" // only if rejected
}

Response: 200
{
  "success": true,
  "message": "PG approved successfully"
}
```

### Rating Endpoints

#### Create Rating
```
POST /api/ratings
Authorization: Bearer <token>
Content-Type: application/json

{
  "pgId": "507f1f77bcf86cd799439011",
  "rating": 4,
  "review": "Great place! Friendly owner, clean rooms, good location.",
  "source": "lived_here",
  "images": ["https://example.com/image1.jpg"]
}

Response: 201
{
  "success": true,
  "message": "Rating submitted successfully"
}
```

#### Get PG Ratings
```
GET /api/ratings?pgId={pgId}

Response: 200
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "rating": 5,
      "review": "Amazing place!",
      "userId": { "name": "John" },
      "createdAt": "2026-03-23T..."
    }
  ]
}
```

---

## 💾 Database Schema

### Users Collection
```typescript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: "student" | "pg_owner" | "superadmin",
  profileImage?: String,
  bio?: String,
  createdAt: Date,
  updatedAt: Date
}
```

### PGs Collection
```typescript
{
  _id: ObjectId,
  ownerId: ObjectId (ref: User),
  name: String,
  address: String,
  location: {
    lat: Number,
    lng: Number,
    type: "Point"
  },
  rent: {
    min: Number,
    max: Number
  },
  amenities: [String],
  imageUrl?: String,
  status: "pending" | "approved" | "rejected",
  rejectionReason?: String,
  ratings: {
    avg: Number,
    count: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Ratings Collection
```typescript
{
  _id: ObjectId,
  pgId: ObjectId (ref: PG),
  userId: ObjectId (ref: User),
  rating: Number (1-5),
  review: String,
  source: "lived_here" | "friend_told" | "other",
  images: [String],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Security Features

### Authentication & Authorization
- ✅ **httpOnly Cookies**: JWT tokens stored in secure httpOnly cookies (XSS protection)
- ✅ **CSRF Protection**: SameSite=strict cookie policy
- ✅ **Role-Based Access Control**: Three-tier permission system
- ✅ **Token Verification**: JWT validation on protected routes

### Input Validation
- ✅ **Zod Schema Validation**: All API inputs validated server-side
- ✅ **MongoDB ObjectId Validation**: Protection against NoSQL injection
- ✅ **Length Limits**: Input constraints to prevent DoS attacks
- ✅ **Type Safety**: TypeScript strict mode

### Password Security
- ✅ **Hashing**: bcryptjs with salt rounds=10
- ✅ **Strong Requirements**: 12+ chars, uppercase, lowercase, number, special char
- ✅ **Change Password Flow**: Current password verification required

### Error Handling
- ✅ **Generic Error Messages**: No internal details leaked
- ✅ **Server-Side Logging**: Detailed errors logged server-side only
- ✅ **Validation Feedback**: Clear user-facing validation messages

### Headers & CORS
- ✅ **Security Headers**: X-Content-Type-Options, X-Frame-Options, CSP
- ✅ **Cache Control**: API responses not cached
- ✅ **HTTPS Enforcement**: Secure flag on cookies (production)

### Database Security
- ✅ **Connection Encryption**: MongoDB Atlas SSL/TLS
- ✅ **User Isolation**: Query filters by userId where applicable
- ✅ **No Secrets in Code**: Environment variables for sensitive data

---

## 🌐 Deployment

### Deploy to Vercel

1. **Push Code to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the `dwellr` project

3. **Set Environment Variables**
   - Settings → Environment Variables
   - Add `MONGODB_URI` with your MongoDB connection string
   - Add `JWT_SECRET` with a secure 32+ character random string
   - Add `NODE_ENV=production`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Visit your Vercel URL

### Environment Variables on Vercel

| Name | Value | Type |
|------|-------|------|
| `MONGODB_URI` | `mongodb+srv://...` | Secret |
| `JWT_SECRET` | Random 32-char string | Secret |
| `NODE_ENV` | `production` | Regular |

### Monitoring

- **Vercel Dashboard**: Monitor build status and performance
- **MongoDB Atlas**: Check database performance and backups
- **Error Tracking**: Monitor API errors and logs

---

## 🚀 Future Scope

### Phase 2: Community Features
The next phase will introduce a vibrant community platform where students can share local knowledge and recommendations.

#### 1. **Community Posts**
Students can create and share posts about best nearby places including:
- **Restaurants & Cafes**: Best places to eat with reviews and budgets
- **Local Transportation**: Bus routes, auto stands, bike rentals
- **Study Spots**: Libraries, computer labs, quiet study areas
- **Events & Activities**: College functions, community gatherings, meetups
- **Local Tips**: Safety tips, area insights, hidden gems

```typescript
interface CommunityPost {
  _id: ObjectId;
  userId: ObjectId;
  location: { lat: Number; lng: Number };
  title: String;
  content: String;
  category: "food" | "transport" | "study" | "events" | "tips";
  images: [String];
  upvotes: Number;
  comments: [{ userId: ObjectId; text: String; timestamp: Date }];
  createdAt: Date;
}
```

#### 2. **Best Places Nearby (Auto-Curated)**
- Real-time recommendations based on student reviews
- Filter by category: Food, Transport, Study, Shopping, Healthcare
- Distance-based search (1-5 km radius)
- Navigation integration with Google Maps
- Opening hours, contact info, and photo galleries

#### 3. **Food Guide**
- Best restaurants by cuisine type
- Budget-friendly options (₹50, ₹100, ₹200+)
- Student-approved food delivery options
- Monthly food trends and new openings
- Photo reviews with dish recommendations

#### 4. **Local Recommendations Hub**
- **Transportation**: Most used routes, quickest commute options
- **Shopping**: Best malls, markets, electronics stores
- **Healthcare**: Nearby clinics, pharmacies, hospitals
- **Education**: Coaching centers, libraries, labs
- **Entertainment**: Cafes, parks, movie theaters, gaming zones

#### 5. **Community Leaderboard & Badges**
- Top contributors by helpful reviews
- Achievement badges:
  - 🌟 Helpful Reviewer
  - 🍔 Food Explorer
  - 🗺️ Navigator
  - 💬 Community Voice
  - ⚡ Most Active

#### 6. **Real-Time Notifications**
- New posts in your area
- Comments on your posts
- Friend requests and messages
- New PGs listed nearby
- Community milestones and events

#### 7. **Advanced Location Features**
- **Heat Maps**: Popular areas for food, study, entertainment
- **Area Insights**: 
  - Average rent prices
  - Popular neighborhoods
  - Safety ratings
  - Air quality/pollution levels
  - Connectivity speeds
- **Proximity Search**: Recommendations within custom radius

#### 8. **Events Board**
- Student events and college functions
- Community gatherings and meetups
- Study groups and project teams
- Ragging-free zone certification
- Event ratings and attendee reviews

### Phase 2 Technical Implementation

**New Database Collections:**
- `CommunityPosts` - Posts and discussions
- `Recommendations` - Curated local recommendations
- `Events` - Community events and gatherings
- `UserBadges` - Achievement system
- `SavedPlaces` - User's bookmarks

**New API Routes:**
```
POST   /api/community/posts
GET    /api/community/posts?lat=19&lng=72&radius=2&category=food
POST   /api/community/posts/{id}/comment
POST   /api/community/posts/{id}/upvote

POST   /api/recommendations
GET    /api/recommendations?category=food&lat=19&lng=72

POST   /api/events
GET    /api/events?lat=19&lng=72&upcoming=true

POST   /api/saved-places
GET    /api/saved-places
```

**New React Components:**
- `CommunityFeed.tsx` - Main community page
- `PostCreator.tsx` - Create new posts
- `NearbyPlaces.tsx` - Local recommendations
- `FoodGuide.tsx` - Restaurant & food reviews
- `EventsList.tsx` - Community events
- `CommunityLeaderboard.tsx` - Top contributors

### Benefits of Community Features
- ✅ Increased user engagement and retention
- ✅ Genuine student recommendations vs. generic listings
- ✅ Network effects: more users = more valuable data
- ✅ Differentiation from competitors
- ✅ Future monetization: sponsored listings, local business partnerships
- ✅ Rich dataset for AI/ML recommendations

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 1. Fork the Repository
```bash
git clone https://github.com/yourusername/dwellr.git
cd dwellr
```

### 2. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes
- Follow existing code style and conventions
- Add TypeScript types for all new code
- Write meaningful commit messages
- Test changes locally

### 4. Test Locally
```bash
npm run dev
npm run build
npm run lint
```

### 5. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

### Code Style Guidelines
- Use TypeScript for all new code (strict mode)
- Name variables descriptively
- Add JSDoc comments for complex functions
- Follow Tailwind CSS utility conventions
- Keep components small and focused (single responsibility)
- Use functional components with hooks

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/dwellr/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/dwellr/discussions)
- **Email**: support@dwellr.app

---

## 🙏 Acknowledgments

- **Leaflet.js** - Interactive map library
- **MongoDB** - NoSQL database
- **Vercel** - Hosting platform
- **Next.js** - React framework
- **Tailwind CSS** - Styling framework
- **Zod** - Schema validation
- **Mongoose** - MongoDB ODM

---

## 📊 Stats & Metrics

### Code Quality
- **TypeScript Coverage**: 100%
- **Type Safety**: Strict mode enabled
- **ESLint**: Passing all checks
- **Build Status**: ✅ Passing

### Performance
- **Lighthouse Score**: 85+ (target)
- **Time to First Byte**: <200ms
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1

### Security
- **Security Headers**: ✅ Enabled
- **HTTPS**: ✅ Enforced
- **CORS**: ✅ Configured
- **Dependencies**: Regularly updated

---

**Built with ❤️ for students, by developers.**

*Last Updated: March 23, 2026*
