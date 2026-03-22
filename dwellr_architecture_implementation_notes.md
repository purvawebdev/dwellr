# Dwellr – Full Handoff Document (Complete Context)

---

## 1. Project Vision

Dwellr is a full-stack application designed to help students discover nearby PG (Paying Guest) accommodations with real user-driven insights.

Core idea:
- Primary → PG discovery (map + ratings)
- Secondary → community + room sharing (future)

Philosophy:
- Build for understanding, not just output
- Avoid "vibe coding"
- Focus on system design, scalability, and reasoning

---

## 2. Core Product Breakdown

### Primary System (MVP)
- Location-based PG discovery
- Map visualization
- Ratings system (future enhancement)

### Secondary System (Future)
- Roommate listings
- Interest/matching system
- Community-driven contributions

---

## 3. Tech Stack (Finalized)

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query (React Query)

### Backend
- Next.js API Routes
- MongoDB Atlas
- Mongoose
- Zod (validation)
- JWT (authentication)

### Maps
- Leaflet (UI rendering)
- OpenStreetMap (tile provider)

### Deployment
- Vercel (serverless)
- MongoDB Atlas

---

## 4. Key Architectural Decisions

### Monorepo Approach
- Frontend + Backend in same Next.js app
- API routes inside `app/api`

Reason:
- Simpler setup
- Shared types
- Faster development

---

### Feature-Based Structure (Industry-Aligned)

```
dwellr/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   ├── api/
│   │   ├── pgs/route.ts
│   │   ├── auth/route.ts
│
├── components/
│   ├── MapView.tsx
│   ├── LeafletMap.tsx
│
├── hooks/
│   ├── useLocation.ts
│   ├── usePGs.ts
│
├── features/
│   ├── pg/
│   │   ├── pg.model.ts
│   │   ├── pg.service.ts
│   │   ├── pg.validation.ts
│
├── lib/
│   ├── db.ts
│   ├── jwt.ts
│   ├── auth.ts
│
├── types/
│   └── global.d.ts
```

---

## 5. Backend System Deep Dive

### 5.1 MongoDB Connection (Critical Logic)

Problem:
- Serverless environments create multiple connections

Solution:
- Cache connection using global object
- Use BOTH `conn` and `promise`

Why BOTH?

| Variable | Role |
|--------|------|
| conn | stores ready connection |
| promise | prevents duplicate concurrent connections |

Concurrency Handling:
- First request → creates connection
- Other requests → wait for same promise
- Prevents connection storm

---

### 5.2 Geospatial Logic

MongoDB uses GeoJSON:

```
[lng, lat]
```

NOT:
```
[lat, lng]
```

Query:

```
$near + $maxDistance
```

Used to fetch PGs within radius.

---

### 5.3 Validation Layer (Zod)

Purpose:
- Prevent invalid inputs
- Avoid DB crashes

Example:
- Latitude: -90 → 90
- Longitude: -180 → 180

---

### 5.4 API Route Flow

```
Request
 → Parse params
 → Validate
 → Call service
 → Query DB
 → Return structured response
```

Response format:

```
{ success: true, data: [...] }
```

Reason:
- consistency
- extensibility

---

### 5.5 JWT Authentication

Functions:

- signToken(payload)
- verifyToken(token)

Concepts:
- token is signed, not encrypted
- signature ensures integrity

---

## 6. Frontend System Deep Dive

### 6.1 Location Handling

Using:

```
navigator.geolocation
```

Returns:
- latitude
- longitude

User flow:
- click button
- browser asks permission
- returns coordinates

---

### 6.2 Data Fetching (React Query)

Why used:
- caching
- avoids duplicate requests
- handles loading states

---

### 6.3 Map System (Leaflet + OSM)

Separation:

| Tool | Role |
|------|------|
| Leaflet | renders map |
| OSM | provides map tiles |

Flow:
- Leaflet loads map
- requests tiles from OSM
- markers added from backend data

---

### 6.4 Coordinate Conversion

Backend:
```
[lng, lat]
```

Frontend:
```
[lat, lng]
```

Must convert before rendering.

---

## 7. Full Data Flow

```
User clicks "Use Location"
   ↓
Browser returns lat/lng
   ↓
React Query triggers API
   ↓
/api/pgs
   ↓
Validation (Zod)
   ↓
Service layer
   ↓
MongoDB geo query
   ↓
Return PGs
   ↓
Leaflet renders markers
```

---

## 8. Security Model

- API routes are server-side
- DB not exposed to client
- JWT for protected routes
- Validation prevents malformed input

---

## 9. Performance Considerations

Handled:
- connection reuse
- query limiting
- client-side caching

Not yet implemented:
- rate limiting
- pagination
- Redis caching
- clustering markers

---

## 10. Scalability Reality

### What works now:
- connection pooling
- promise-based concurrency control

### Serverless Behavior:
- each instance has its own connection
- global cache is per instance

### Important insight:
- this is acceptable for MVP

---

## 11. Naming Decision Insight

- "PG" is domain-specific
- not required
- industry prefers generic names (property/accommodation)

Decision:
- keep PG for now (acceptable)

---

## 12. Key Concepts Learned

- GeoJSON coordinate system
- MongoDB 2dsphere indexing
- connection pooling vs concurrency
- async/non-blocking execution
- client vs server boundaries
- validation importance
- API design consistency

---

## 13. Future Roadmap

- Reviews system
- Roommate listings
- Interest/matching system
- Authentication flow
- Map clustering
- Search by location name

---

## 14. Mental Model

You are building:

NOT → CRUD app

BUT →

A distributed system:
- frontend (interaction)
- backend (logic)
- database (state)
- map layer (visualization)

---

## 15. Final Summary

Dwellr is composed of:

- Backend → API + DB logic
- Frontend → UI + state
- Map → Leaflet + OSM

All layers are:
- decoupled
- scalable
- extensible

---

END OF HANDOFF DOCUMENT

