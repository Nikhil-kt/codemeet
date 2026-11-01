# ImpactLink – Production Deployment & Operations Runbook

This guide provides step-by-step instructions for deploying the **ImpactLink** platform to production across modern cloud providers:

- **Frontend**: [Vercel](https://vercel.com) (Next.js 14 App Router)
- **Backend API**: [Render](https://render.com) (Node.js / Express / Socket.io)
- **AI/ML Service**: [Render](https://render.com) (Python / FastAPI / Scikit-learn)
- **Database & Auth**: [Firebase](https://firebase.google.com) (Firebase Authentication & Cloud Firestore)
- **Storage**: [Firebase Storage](https://firebase.google.com) (`timepass-fe09d.firebasestorage.app`)
- **Cache & Queue**: [Upstash](https://upstash.com) or [Redis Cloud](https://redis.com) (Managed Redis with TLS)
- **Generative AI**: [Google AI Studio](https://aistudio.google.com) (Gemini 2.5 Flash API)

---

## 1. Cloud Architecture Overview

```mermaid
graph TD
    Client["Browser / Client Apps"] -->|HTTPS| Frontend["Next.js 14 (Vercel)"]
    Client -->|HTTPS / WSS| Backend["Node.js Express API (Render)"]
    
    Backend -->|Admin SDK| Firestore["Firebase Firestore (NoSQL DB)"]
    Backend -->|HTTPS / REST| Gemini["Google Gemini API (v1beta / 2.5-flash)"]
    Backend -->|rediss:// TLS| Redis["Managed Redis (Upstash / Redis Cloud)"]
    Backend -->|HTTP / X-Service-Key| MLService["Python FastAPI ML Service (Render)"]
    
    Frontend -->|Client SDK| FirebaseAuth["Firebase Authentication"]
    Frontend -->|Client SDK| FirebaseStorage["Firebase Cloud Storage"]
    Frontend -->|HTTPS / API| Backend
```

---

## 2. Pre-Deployment Configuration Matrix

Before deploying, ensure you have the following credentials ready in your environment:

| Variable | Service | Purpose | Safe in Browser? |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Frontend | Base URL of hosted backend (e.g. `https://api.yourdomain.com/api/v1`) | **Yes** |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Frontend | Firebase Web API Key | **Yes** |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Frontend | Firebase Auth domain (`timepass-fe09d.firebaseapp.com`) | **Yes** |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Frontend & Backend | Firebase Project ID (`timepass-fe09d`) | **Yes** |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Frontend & Backend | Firebase Storage bucket (`timepass-fe09d.firebasestorage.app`) | **Yes** |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Frontend | Firebase Messaging sender ID | **Yes** |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Frontend | Firebase Web App ID | **Yes** |
| `FIREBASE_PROJECT_ID` | Backend | Project ID for Firebase Admin SDK | Server only |
| `JWT_SECRET` | Backend | High-entropy secret string for signing session tokens | **NO (Server only)** |
| `GEMINI_API_KEY` | Backend & ML | Google AI Studio API key | **NO (Server only)** |
| `REDIS_URL` | Backend | Cloud Redis connection string with `rediss://` protocol | **NO (Server only)** |
| `ML_SERVICE_URL` | Backend | Hosted URL of the Python ML microservice | **NO (Server only)** |
| `ML_SERVICE_SECRET` | Backend & ML | Shared secret token for inter-service authentication | **NO (Server only)** |
| `ALLOWED_ORIGINS` | Backend & ML | Whitelist of frontend domains allowed for CORS / WebSockets | Server only |

---

## 3. Step 1: Firebase Console Configuration

Your Firebase project is configured for: **`timepass-fe09d`**.

### 3.1 Authentication Setup
1. In the [Firebase Console](https://console.firebase.google.com/project/timepass-fe09d/authentication), navigate to **Authentication** -> **Sign-in method**.
2. Enable **Email/Password** provider.
3. In **Settings** -> **Authorized domains**, add:
   - `localhost`
   - `your-app.vercel.app` (Your production frontend Vercel URL)

### 3.2 Cloud Firestore Database Setup
1. In Firebase Console, click **Firestore Database** -> **Create database**.
2. Select **Production mode** (or test mode during active development).
3. Choose your nearest Cloud Firestore location (e.g., `asia-south1` or `us-central`).
4. ImpactLink uses the following collections automatically:
   - `profiles` (User records, role mapping: Volunteer, Organization, Admin, Team Leader)
   - `organizations` (Organization profiles, verification status, trust scores)
   - `volunteer_profiles` (Volunteer bios, reliability scores, hours)
   - `events` (Community campaign events)
   - `event_registrations` (Volunteer bookings and attendance)

### 3.3 Firebase Cloud Storage Setup
1. In Firebase Console, click **Storage** -> **Get started**.
2. Bucket: `timepass-fe09d.firebasestorage.app`.
3. Stores NGO certificates, government Darpan IDs, and volunteer task completion evidence photos.

---

## 4. Step 2: Deploy the Python ML Microservice (Render)

1. In [Render Dashboard](https://dashboard.render.com), click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure:
   - **Name**: `impactlink-ml`
   - **Root Directory**: `ml-service`
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. In **Environment Variables**:
   - `PORT` = `8000`
   - `ALLOWED_ORIGINS` = `https://your-backend-api.onrender.com,https://your-frontend.vercel.app`
   - `ML_SERVICE_SECRET` = `<Generate a secure random string>`
   - `GEMINI_API_KEY` = `<Your Google Gemini API Key>`
5. Click **Deploy Web Service** and copy your URL (e.g., `https://impactlink-ml.onrender.com`).

---

## 5. Step 3: Deploy the Node.js Backend (Render)

1. Click **New +** -> **Web Service**.
2. Configure:
   - **Name**: `impactlink-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
3. Add the **Environment Variables**:
   ```ini
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://your-frontend.vercel.app
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   JWT_SECRET=<Generate a 64-character secret>
   FIREBASE_PROJECT_ID=timepass-fe09d
   FIREBASE_STORAGE_BUCKET=timepass-fe09d.firebasestorage.app
   GEMINI_API_KEY=<Your Google Gemini API key>
   REDIS_URL=rediss://default:password@your-database.upstash.io:6379
   ML_SERVICE_URL=https://impactlink-ml.onrender.com
   ML_SERVICE_SECRET=<Must match the ML_SERVICE_SECRET set on impactlink-ml>
   ```
4. Click **Deploy Web Service**.

---

## 6. Step 4: Deploy the Next.js Frontend (Vercel)

1. In [Vercel](https://vercel.com), click **Add New...** -> **Project**.
2. Select your repository.
3. Root Directory: `frontend`.
4. Framework Preset: **Next.js**.
5. Add **Environment Variables**:
   ```ini
   NEXT_PUBLIC_API_URL=https://your-backend-api.onrender.com/api/v1
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBnRD3hU_5uYk_lqnv9JBz47mrPIgQtaws
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=timepass-fe09d.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=timepass-fe09d
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=timepass-fe09d.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=960444975278
   NEXT_PUBLIC_FIREBASE_APP_ID=1:960444975278:web:f366c1d7599e63e095853f
   ```
6. Click **Deploy**.

---

## 7. Verification & Smoke Testing

1. **Firebase Authentication**: Open `/register` and create an account. Check Firebase Console Authentication tab to verify user presence.
2. **Dashboard Routing**: Log in with Volunteer, Organizer, or Admin accounts. Verify automatic redirection to the respective dashboard.
3. **Backend Health Check**:
   ```bash
   curl https://impactlink-backend.onrender.com/health
   ```
4. **AI Matching & Deduplication**: Create a campaign event as an Organizer, run AI Volunteer Matching, and submit evidence as a Volunteer.
