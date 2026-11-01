import dotenv from 'dotenv';
import path from 'path';

// Load .env from root workspace, backend directory, or process cwd
const envCandidates = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../.env'),
  path.resolve(process.cwd(), 'backend/.env'),
];
for (const p of envCandidates) {
  dotenv.config({ path: p });
}
dotenv.config();

const clientUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000';
const extraOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim().replace(/\/$/, ''))
  : [];

const allowedOrigins = Array.from(new Set([clientUrl.replace(/\/$/, ''), ...extraOrigins])).filter(Boolean);

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: (process.env.NODE_ENV || '').toLowerCase() === 'production',
  jwtSecret: process.env.JWT_SECRET || 'impactlink-super-secret-jwt-key-2026',
  supabase: {
    url: process.env.SUPABASE_URL || 'https://mock.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'mock-anon-key',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || 'mock-service-role-key',
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'timepass-fe09d',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'timepass-fe09d.firebasestorage.app',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    isTls: (process.env.REDIS_URL || '').startsWith('rediss://'),
  },
  geminiApiKey: process.env.GEMINI_API_KEY || process.env.AI_PROVIDER_API_KEY || '',
  mlServiceUrl: (process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000').replace(/\/$/, ''),
  mlServiceSecret: process.env.ML_SERVICE_SECRET || 'impactlink-ml-secret-key-2026',
  clientUrl,
  allowedOrigins,
  deposit: {
    standardAmount: 5000.0, // Default INR deposit for new organizations
    currency: 'INR',
    requiredEventsForExemption: 3,
  }
};
